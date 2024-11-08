import React from 'react';
import { ProjectWithLinks, TransitionStates } from './models';
import { FaEye, FaEdit, FaTrash, FaFolderOpen } from 'react-icons/fa';

interface ProjectItemProps {
    project: ProjectWithLinks;
    states: TransitionStates;
}

export default function ProjectItem(props: ProjectItemProps) {
    const { project } = props;

    return (
        <li
            key={project.project.ProjectID}
            className="border-b border-gray-300 py-4 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <h3 className="text-xl font-semibold text-gray-800">{project.project.ProjectName}</h3>
            <p className="text-sm text-gray-600">Owned by User ID: {project.project.OwningUserID}</p>
            <p className="text-sm text-gray-600">Created on: {new Date(project.project.CreationDate).toLocaleString()}</p>
            <div className="mt-4 flex justify-center space-x-4">
                <button
                    onClick={() => props.states.project_files(project.project.ProjectID)}
                    className="flex items-center space-x-1 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors"
                >
                    <FaEye />
                    <span>View Project</span>
                </button>
                <a
                    href={project.links.update}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-700 transition-colors"
                >
                    <FaEdit />
                    <span>Update Project</span>
                </a>
                <a
                    href={project.links.delete}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors"
                >
                    <FaTrash />
                    <span>Delete Project</span>
                </a>
            </div>
        </li>
    );
}
