import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TransitionStates, PaginationLinks, ProjectFileStructure } from './models';
import Pagination from './Pagination';

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

    const fetchFiles = async (url: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(url, {
                headers: { TokenID: props.tokenID },
            });
            console.log(response.data.data);
            setFiles(response.data.data);
            setPaginationLinks(response.data.links);
        } catch (err: any) {
            setError("Error fetching project files.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles(`${files_endpoint}?ProjectID=${props.project_id}&limit=25&offset=0`);
    }, [props.project_id, props.tokenID]);

    const handleNavigation = (url: string) => {
        if (url) fetchFiles(url);
    };

    const toggleFolder = (fileID: number) => {
        setExpandedFolders((prev) => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(fileID)) {
                newExpanded.delete(fileID);
            } else {
                newExpanded.add(fileID);
            }
            return newExpanded;
        });
    };

    const renderFiles = (fileStructure: ProjectFileStructure) => {
        const isExpanded = expandedFolders.has(fileStructure.file.FileID!);
        return (
            <li key={fileStructure.file.FileID!} className="ml-4">
                <div
                    className="font-semibold cursor-pointer"
                    onClick={() => {
                        if (fileStructure.file.IsDirectory) toggleFolder(fileStructure.file.FileID!);
                    }}
                >
                    {fileStructure.file.IsDirectory ? (isExpanded ? '📂' : '📁') : '📄'} {fileStructure.file.FileName}
                </div>
                {fileStructure.file.IsDirectory && isExpanded && fileStructure.children.size > 0 && (
                    <ul className="ml-4">
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
        <div>
            <div className="flex justify-between items-center">
                <button
                    onClick={() => props.states.projects()}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Back to Projects
                </button>
            </div>

            <h1>Project Files</h1>
            
            {loading && <p>Loading project files...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div>
                    <ul>
                        {files.map((file) => renderFiles(file))}
                    </ul>

                    <div style={{ marginTop: '20px' }}>
                        {paginationLinks && (
                            <Pagination paginationLinks={paginationLinks} handleNavigation={handleNavigation} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
