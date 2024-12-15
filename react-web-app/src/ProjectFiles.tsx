import React, { useEffect, useState } from "react";
import axios from "axios";
import { TransitionStates, PaginationLinks, ProjectFileStructure } from "./models";
import Pagination from "./Pagination";
import { FaFolder, FaFolderOpen, FaFile, FaPlus, FaTrash } from "react-icons/fa";

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

  const [showAddInput, setShowAddInput] = useState<boolean>(false); // Add Directory
  const [newDirectoryName, setNewDirectoryName] = useState<string>("");

  const [showAddFileInput, setShowAddFileInput] = useState<boolean>(false); // Add File
  const [newFileName, setNewFileName] = useState<string>("");

  const [draggedFile, setDraggedFile] = useState<ProjectFileStructure | null>(null);

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

  useEffect(() => {
    fetchFiles(`${files_endpoint}?ProjectID=${props.project_id}&limit=250&offset=0`);
  }, [props.project_id, props.tokenID]);

  const handleAddDirectory = () => {
    if (!newDirectoryName.trim()) return;

    const newDirectory: ProjectFileStructure = {
      file: {
        FileID: Date.now(),
        FileName: newDirectoryName,
        IsDirectory: true,
        ParentDirectory: null,
        ProjectID: props.project_id,
        creationDate: new Date(),
      },
      children: new Map(),
    };

    setFiles((prevFiles) => [...prevFiles, newDirectory]);
    setNewDirectoryName("");
    setShowAddInput(false);
  };

  const handleAddFile = async () => {
    if (!newFileName.trim()) return;
    //check to make sure if the file name already exists
    // if exists, return.

    const newFile: ProjectFileStructure = {
      file: {
        FileID: Date.now(),
        FileName: newFileName,
        IsDirectory: false,
        ParentDirectory: null,
        ProjectID: props.project_id,
        creationDate: new Date(),
      },
      children: new Map(),
    };

   // setFiles((prevFiles) => [...prevFiles, newFile]);
  //  setNewFileName("");
    setShowAddFileInput(false);
    await axios.post(files_endpoint!, newFile.file, {
      headers: {
        'TokenID': props.tokenID
      }
    });
    fetchFiles(`${files_endpoint}?ProjectID=${props.project_id}&limit=250&offset=0`);
  };

  const renderFiles = (fileStructure: ProjectFileStructure) => {
    const isExpanded = expandedFolders.has(fileStructure.file.FileID!);

    return (
      <li key={fileStructure.file.FileID} className="ml-4 flex items-center space-x-2">
        {fileStructure.file.IsDirectory ? (
          <FaFolderOpen className="text-yellow-600" />
        ) : (
          <FaFile className="text-blue-500" />
        )}
        <span>{fileStructure.file.FileName}</span>
        <button
          onClick={() =>
            setFiles((prevFiles) => prevFiles.filter((file) => file.file.FileID !== fileStructure.file.FileID))
          }
          className="text-red-500 hover:text-red-700 ml-2"
        >
          <FaTrash />
        </button>
      </li>
    );
  };

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 bg-gray-100 p-4 border-r overflow-y-auto">
        <h1 className="text-lg font-bold mb-4">Project Files</h1>

        {/* Add Directory */}
        <button
          onClick={() => setShowAddInput((prev) => !prev)}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-2"
        >
          <FaPlus className="inline-block mr-2" /> Add Directory
        </button>

        {showAddInput && (
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newDirectoryName}
              onChange={(e) => setNewDirectoryName(e.target.value)}
              placeholder="Enter directory name"
              className="w-full px-2 py-1 border rounded"
            />
            <button
              onClick={handleAddDirectory}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        )}

        {/* Add File */}
        <button
          onClick={() => setShowAddFileInput((prev) => !prev)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          <FaPlus className="inline-block mr-2" /> Add File
        </button>

        {showAddFileInput && (
          <div className="flex space-x-2 mt-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter file name"
              className="w-full px-2 py-1 border rounded"
            />
            <button
              onClick={handleAddFile}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
        )}

        {/* file and directory rendering */}
        <ul className="space-y-2 mt-4">
          {files.map((file) => renderFiles(file))}
        </ul>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        <h2 className="text-xl font-bold">Project Overview</h2>
        <p>Select or create directories and files.</p>
      </main>
    </div>
  );
}
