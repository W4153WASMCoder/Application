import React from 'react';
import { Project, ProjectWithLinks } from './models';

interface ProjectItemProps {
    project: ProjectWithLinks;
}

export default function ProjectItem(props:ProjectItemProps) {
    const project = props.project;
    return (
        <li key={project.project.ProjectID} className="border-b border-gray-300 py-4">
            <h3 className="text-lg font-semibold">{project.project.ProjectName}</h3>
            <p>Owned by User ID: {project.project.OwningUserID}</p>
            <p>Created on: {new Date(project.project.CreationDate).toLocaleString()}</p>
            <div className="mt-2">
                <a href={project.links.self} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Project
                </a>{" "}
                |{" "}
                <a href={project.links.update} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Update Project
                </a>{" "}
                |{" "}
                <a href={project.links.delete} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
                    Delete Project
                </a>{" "}
                |{" "}
                <a href={project.links.open} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Open Project Files
                </a>
            </div>
        </li>
    );
};

