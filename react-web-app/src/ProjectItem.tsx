import React from 'react';
import { ProjectWithLinks, TransitionStates } from './models';

interface ProjectItemProps {
    project: ProjectWithLinks;
    states:TransitionStates;
}

export default function ProjectItem(props: ProjectItemProps) {
    const project = props.project;
    return (
        <li key={project.project.ProjectID} className="border-b border-gray-300 py-4 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800">{project.project.ProjectName}</h3>
            <p className="text-sm text-gray-600">Owned by User ID: {project.project.OwningUserID}</p>
            <p className="text-sm text-gray-600">Created on: {new Date(project.project.CreationDate).toLocaleString()}</p>
            <div className="mt-3 space-x-4">
                <button onClick={() => props.states.project_files(project.project.ProjectID)} className="text-blue-600 hover:text-blue-800 underline">
                    View Project
                </button>
                <span className="text-gray-400">|</span>
                <a href={project.links.update} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                    Update Project
                </a>
                <span className="text-gray-400">|</span>
                <a href={project.links.delete} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-700 underline">
                    Delete Project
                </a>
                <span className="text-gray-400">|</span>
                <a href={project.links.open} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                    Open Project Files
                </a>
            </div>
        </li>
    );
}
