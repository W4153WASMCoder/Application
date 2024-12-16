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
    //textbox
    const [newFileName, setNewFileName] = useState<string>('');
    //checkbox
    const [isDirectory, setIsDirectory] = useState<boolean>(false);

    const fetchFiles = async (url: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(url, {
                headers: { TokenID: props.tokenID },
            });
            setFiles(JSON.parse(response.data.data, function reviver(key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (value.dataType === 'Map') {
                        return new Map(value.value);
                    }
                }
                return value;
            }));
            setPaginationLinks(response.data.links);
        } catch (err: any) {
            setError("Error fetching project files.");
        } finally {
            setLoading(false);
        }
    };
    console.log(files);
    const reload = () => fetchFiles(`${files_endpoint}?ProjectID=${props.project_id}&limit=250&offset=0`);

    const handleAddFile = async (FileName:string, IsDirectory:boolean) => {
        if (!FileName) return;
        if (files.length != 0 && files.reduce(
            (prev, cur) => cur.file.FileName == FileName ? cur : prev
        ).file.FileName === FileName) return;
        const file:ProjectFile = 
        {
            FileID: null,
            ParentDirectory: null,
            ProjectID: props.project_id,
            FileName: FileName,
            IsDirectory: IsDirectory,
            creationDate: new Date(Date.now())
        };
        await axios.post(files_endpoint!, file, {
            headers: {
              'TokenID': props.tokenID
            }
          });
        reload();
    };
    const handleDeleteFile = async (file_id:number) => {
        await axios.delete(`${files_endpoint}/${file_id}`, {
            headers: {
              'TokenID': props.tokenID
            }
          });
        reload();
    };
    useEffect(() => {
        reload();
    }, [props.project_id, props.tokenID]);

    const handleNavigation = (url: string) => {
        if (url) fetchFiles(url);
    };

    const toggleFolder = (fileID: number) => {
        setExpandedFolders((prev) => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(fileID))
                newExpanded.delete(fileID);
            else
                newExpanded.add(fileID);
            return newExpanded;
        });
    };

    const renderFiles = (fileStructure: ProjectFileStructure) => {
        const isExpanded = expandedFolders.has(fileStructure.file.FileID!);
        return (
            <li key={fileStructure.file.FileID!} className="ml-4">
                <div
                    className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900"
                    onClick={() => {
                        if (fileStructure.file.IsDirectory) toggleFolder(fileStructure.file.FileID!);
                    }}
                >
                    {fileStructure.file.IsDirectory ? (
                        isExpanded ? <FaFolderOpen className="mr-2 text-yellow-600"/> :
                            <FaFolder className="mr-2 text-yellow-500"/>
                    ) : (
                        <FaFile className="mr-2 text-blue-500"/>
                    )}
                    <span>{fileStructure.file.FileName}</span>
                    <button
                        onClick={() => handleDeleteFile(fileStructure.file.FileID!)}
                        className="ml-2 p-2 text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Delete file"
                    >
                        <FaTrash/>
                    </button>



                </div>
                {fileStructure.file.IsDirectory && isExpanded && fileStructure.children.size > 0 && (
                    <ul className="ml-6">
                        {Array.from(fileStructure.children.entries()).map(([key, child]) =>
                            'file' in child ? (
                                renderFiles(child as ProjectFileStructure)
                            ) : (
                                <li key={key}>{key}</li>
                            )
                        )}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className="flex h-full">
            <aside className="w-1/4 p-4 bg-gray-200 border-r border-gray-300 h-screen overflow-y-auto">
                <button
                    onClick={() => props.states.projects()}
                    className="mb-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                    Back to Projects
                </button>

                <h1 className="text-lg font-semibold text-gray-800 mb-4">Project Files</h1>

                {loading && <p className="text-gray-600">Loading project files...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && (
                    <ul className="space-y-2">
                        {files.map((file) => renderFiles(file))}
                    </ul>
                )}
                {/* text box, check box, Add button */}
                <div className="mt-4">
                    <label className="block text-gray-700 mb-1">File Name:</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        placeholder="Enter file name"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                    />
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="isDirectory"
                            checked={isDirectory}
                            onChange={(e) => setIsDirectory(e.target.checked)}
                        />
                        <label htmlFor="isDirectory" className="ml-2 text-gray-700">
                            Is Directory
                        </label>
                    </div>
                    <button
                        onClick={() => handleAddFile(newFileName, isDirectory)}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                    >
                        Add
                    </button>
                </div>
                {/* done */}
                <div className="mt-4">
                    {paginationLinks && (
                        <Pagination paginationLinks={paginationLinks} handleNavigation={handleNavigation}/>
                    )}
                </div>
            </aside>
            <main className="flex-1 p-6 bg-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Files Overview</h2>
            </main>
        </div>
    );
}
