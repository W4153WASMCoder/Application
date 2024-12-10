import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TransitionStates, PaginationLinks, ProjectWithLinks } from './models';
import ProjectItem from './ProjectItem';
import Pagination from './Pagination';

export interface ProjectsProps {
    tokenID: number;
    states: TransitionStates;
}

export default function Projects(props: ProjectsProps) {
    const projects_endpoint = process.env.REACT_APP_PROJECTS_ENDPOINT;


    const [projects, setProjects] = useState<ProjectWithLinks[]>([]);
    const [paginationLinks, setPaginationLinks] = useState<PaginationLinks | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newProjectName, setNewProjectName] = useState(''); // new project name state
   
    const fetchProjects = async (url: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(url, {
                headers: { TokenID: props.tokenID },
            });
            setProjects(response.data.data);
            setPaginationLinks(response.data.links);
        } catch (err: any) {
            setError("Error fetching projects.");
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteProject = (projectID: number) => {
    setProjects((prevProjects) =>
        prevProjects.filter((project) => project.project.ProjectID !== projectID)
    );
};


    const handleAddProject = async () => {
        if (!newProjectName.trim()) {
            setError("Please add a name to your project");
            return;
        }

        try {
            const response = await axios.post(
                projects_endpoint || '',
                {
                    OwningUserID: props.tokenID,
                    ProjectName: newProjectName,
                },
                {
                    headers: { TokenID: props.tokenID },
                }
            );

            console.log('New project response:', response.data);
            console.log('New project response data:', response.data.data);
            console.log('New project response links:', response.data.data.links);

            // add new project to the state
            const newProject: ProjectWithLinks = {
                project: {
                    ProjectID: response.data.data.ProjectID, 
                    ProjectName: response.data.data.ProjectName,
                    CreationDate: response.data.data.CreationDate,
                    OwningUserID: props.tokenID, 
                },
                links: response.data.data.links, 
            };
            console.log(newProject)
            setProjects((prevProjects) => [...prevProjects, newProject]);
            setNewProjectName('');
            setError(null);
            // await fetchProjects(`${projects_endpoint}?limit=25&offset=0`);
        } catch (err) {
            console.error('Error adding project:', err);
            setError("Error adding project.");
        }
    };



    useEffect(() => {
        fetchProjects(`${projects_endpoint}?limit=25&offset=0`);
    }, [props.tokenID]);


    const handleNavigation = (url: string) => {
        if (url) fetchProjects(url);
    };


    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Projects</h1>

            {/* add project */}
            <div className="mb-4">
                <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => {
                        setNewProjectName(e.target.value);
                        setError(null); 
                    }}
                    placeholder="Enter new project name"
                    className="px-4 py-2 border rounded-lg mr-2"
                />
                <button
                    onClick={handleAddProject}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Add Project
                </button>
            </div>

            {/* errors and loading*/}
            {loading && <p className="text-gray-600">Loading projects...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {/* the project list */}
            {!loading && !error && (
                <div>
                    <ul className="space-y-4">
                        {projects.map((project) => (
                            <ProjectItem
                                key={project.project.ProjectID}
                                project={project}
                                states={props.states}
                                tokenID={props.tokenID}
                                onDelete={handleDeleteProject} // passing down delete handler
                            />
                        ))}
                    </ul>

                    {/* pagination */}
                    <div className="mt-6 flex justify-center">
                        {paginationLinks && (
                            <Pagination
                                paginationLinks={paginationLinks}
                                handleNavigation={handleNavigation}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
