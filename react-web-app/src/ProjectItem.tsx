import React, { useState } from 'react';
import { ProjectWithLinks, TransitionStates } from './models';
import { FaCheck, FaTimes, FaEye, FaEdit, FaTrash, FaFolderOpen } from 'react-icons/fa';
import axios from 'axios';

interface ProjectItemProps {
    project: ProjectWithLinks;
    states: TransitionStates;
    tokenID: number;
    onDelete: (projectID: number) => void; //  prop to help delete project
}

export default function ProjectItem(props: ProjectItemProps) {
    const { project } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(project.project.ProjectName); // tracking the new name of project
    const [error, setError] = useState<string | null>(null); // error tracking when updating 


    // updating the project name
const handleUpdateProject = async () => {
    if (!newName.trim()) {
        setError("Project name cannot be empty.");
        return;
    }

    try {
        await axios.put(
            project.links.update,
            { ProjectName: newName },
            {
                headers: { TokenID: props.tokenID }, 
            }
        );
        project.project.ProjectName = newName;
        setIsEditing(false);
        setError(null);
    } catch (err) {
        setError("Error updating project.");
    }
};


const handleDeleteProject = async () => {
    try {
        await axios.delete(project.links.delete, {
            headers: { TokenID: props.tokenID },
        });
        props.onDelete(project.project.ProjectID); // telling project.tsx to delete
    } catch (err) {
        console.error("Error deleting project:", err);
        setError("Error deleting project.");
    }
};


return (
    <li
        key={project.project.ProjectID}
        className="border-b border-gray-300 py-4 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
    >
        <div>
            {isEditing ? (
                <div className="flex items-center space-x-2">
                    {/* field for editing the name */}
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    {/* save editing name */}
                    <button
                        onClick={handleUpdateProject}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        <FaCheck />
                    </button>
                    {/* cancel editing name */}
                    <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                        <FaTimes />
                    </button>
                </div>
            ) : (
                <h3 className="text-xl font-semibold text-gray-800">
                    {project.project.ProjectName}
                </h3>
            )}
            <p className="text-sm text-gray-600">
                Created on: {new Date(project.project.CreationDate).toLocaleString()}
            </p>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
            {/* view project */}
            <button
                onClick={() => props.states.project_files(project.project.ProjectID)}
                className="flex items-center space-x-1 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors"
            >
                <FaEye />
                <span>View Project</span>
            </button>
            {/* update project */}
            <button
                onClick={() => setIsEditing(true)} 
                className="flex items-center space-x-1 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-700 transition-colors"
            >
                <FaEdit />
                <span>Update Project</span>
            </button>
            {/* delete project button */}
            <button
            onClick={handleDeleteProject} 
            className="flex items-center space-x-1 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors"
        >
            <FaTrash />
            <span>Delete Project</span>
        </button>
        </div>
        
        {error && <p className="text-red-600 mt-2">{error}</p>}
    </li>
);

}