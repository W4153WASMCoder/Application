import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TransitionStates, PaginationLinks, ProjectFileStructure, ProjectFile } from './models';
import Pagination from './Pagination';
import { FaFolder, FaFolderOpen, FaFile, FaTrash } from 'react-icons/fa';

export interface ProjectFilesProps {
    tokenID: number;
    project_id: number;
    states: TransitionStates;
}

export default function ProjectFiles(props: ProjectFilesProps) {
    const files_endpoint = process.env.REACT_APP_PROJECT_FILES_ENDPOINT;
    const [files, setFiles] = useState<ProjectFileStructure[]>([]);
    const [paginationLinks, setPaginationLinks] = useState<PaginationLinks | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

    // File addition state
    const [newFileName, setNewFileName] = useState<string>('');
    const [isDirectory, setIsDirectory] = useState<boolean>(false);

    // File editing state
    const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);

    console.log("Files state:", files);

    // Fetch files
    const fetchFiles = async (url: string) => {
        console.log("Fetching files from:", url);
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(url, {
                headers: { TokenID: props.tokenID },
            });
            console.log("Response data:", response.data);
            console.log("Response data:", response.data);
            setFiles(JSON.parse(response.data.data, function reviver(key, value) {
                if (typeof value === 'object' && value !== null && value.dataType === 'Map') {
                    return new Map(value.value);
                }
                return value;
            }));
            setPaginationLinks(response.data.links);
        } catch (err) {
            console.error("Error fetching files:", err);
            setError("Error fetching project files.");
        } finally {
            setLoading(false);
        }
    };

    const reload = () => fetchFiles(`${files_endpoint}?ProjectID=${props.project_id}&limit=250&offset=0`);

    // Add a file
    const handleAddFile = async () => {
        if (!newFileName) return;

        const file: ProjectFile = {
            FileID: null,
            ParentDirectory: null,
            ProjectID: props.project_id,
            FileName: newFileName,
            IsDirectory: isDirectory,
            creationDate: new Date(),
        };

        try {
            console.log("Adding file:", file);
            await axios.post(files_endpoint!, file, { headers: { TokenID: props.tokenID } });
            reload();
        } catch (error) {
            console.error("Error adding file:", error);
        }
    };

    // Delete a file
    const handleDeleteFile = async (file_id: number) => {
        console.log("Deleting file ID:", file_id);
        try {
            await axios.delete(`${files_endpoint}/${file_id}`, {
                headers: { TokenID: props.tokenID },
            });
            reload();
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    // Handle file click for editing
    const handleFileClick = async (file: ProjectFile) => {
        if (file.IsDirectory) return;

        try {
            console.log("Fetching content for file ID:", file.FileID);
            const response = await axios.get(`${files_endpoint}/${file.FileID}`, {
                headers: { tokenid: props.tokenID },
                params: { ProjectID: props.project_id },
            });
            console.log(response)
            console.log(response.data.data.Content)
            setSelectedFile(file);
            setFileContent(response.data.data.Content || '');
        } catch (error) {
            console.error("Error fetching file content:", error);
            setFileContent("Error loading file content.");
        }
    };

    // Save file content
    const saveFileContent = async () => {
        if (!selectedFile) return;

        setIsSaving(true);
        console.log("Saving content for file ID:", selectedFile.FileID, fileContent);
        try {
            const response = await axios.put(
                `${files_endpoint}/${selectedFile.FileID}`,
                { ProjectID: props.project_id, UpdatedFile: { ...selectedFile, data: fileContent } },
                { headers: { TokenID: props.tokenID } }
            );
            console.log("Save file response:", response);

        // Log the specific response data
            console.log("Response data:", response.data);

            alert("File saved successfully!");
        } catch (error) {
            console.error("Error saving file:", error);
            alert("Failed to save file.");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleFolder = (fileID: number) => {
        setExpandedFolders((prev) => {
            const newSet = new Set(prev);
            newSet.has(fileID) ? newSet.delete(fileID) : newSet.add(fileID);
            return newSet;
        });
    };

    const renderFiles = (fileStructure: ProjectFileStructure) => {
        const isExpanded = expandedFolders.has(fileStructure.file.FileID!);
        return (
            <li key={fileStructure.file.FileID!} className="ml-4">
                <div
                    className="flex items-center cursor-pointer hover:text-blue-600"
                    onClick={() => fileStructure.file.IsDirectory ? toggleFolder(fileStructure.file.FileID!) : handleFileClick(fileStructure.file)}
                >
                    {fileStructure.file.IsDirectory ? (
                        isExpanded ? <FaFolderOpen className="mr-2 text-yellow-600" /> : <FaFolder className="mr-2 text-yellow-500" />
                    ) : (
                        <FaFile className="mr-2 text-blue-500" />
                    )}
                    <span>{fileStructure.file.FileName}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(fileStructure.file.FileID!);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                    >
                        <FaTrash />
                    </button>
                </div>
                {fileStructure.file.IsDirectory && isExpanded && (
                    <ul className="ml-6">
                        {Array.from(fileStructure.children.entries()).map(([key, child]) =>
                            'file' in child ? renderFiles(child as ProjectFileStructure) : <li key={key}>{key}</li>
                        )}
                    </ul>
                )}
            </li>
        );
    };

    useEffect(() => {
        reload();
    }, [props.project_id, props.tokenID]);

    return (
        <div className="flex h-full">
            <aside className="w-1/4 p-4 bg-gray-200 border-r h-screen overflow-y-auto">
                <button onClick={() => props.states.projects()} className="mb-4 w-full bg-blue-500 text-white py-2 px-4 rounded">
                    Back to Projects
                </button>
                <h1 className="text-lg font-semibold mb-4">Project Files</h1>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {!loading && !error && <ul>{files.map(file => renderFiles(file))}</ul>}

                <div className="mt-4">
                    <label className="block text-gray-700 mb-1">File Name:</label>
                    <input type="text" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} className="w-full p-2 border rounded mb-2" />
                    <div className="flex items-center mb-4">
                        <input type="checkbox" checked={isDirectory} onChange={(e) => setIsDirectory(e.target.checked)} />
                        <label className="ml-2 text-gray-700">Is Directory</label>
                    </div>
                    <button onClick={handleAddFile} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                        Add File
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6 bg-gray-100">
                <h2 className="text-xl font-semibold mb-4">{selectedFile ? `Editing: ${selectedFile.FileName}` : "Files Overview"}</h2>
                {selectedFile && (
                    <div>
                        <textarea value={fileContent} onChange={(e) => setFileContent(e.target.value)} className="w-full h-80 p-2 border rounded mb-4" />
                        <button onClick={saveFileContent} disabled={isSaving} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
