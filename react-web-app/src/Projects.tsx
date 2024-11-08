import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        fetchProjects(`${projects_endpoint}?limit=25&offset=0`);
    }, [props.tokenID]);

    const handleNavigation = (url: string) => {
        if (url) fetchProjects(url);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Projects</h1>

            {loading && <p className="text-gray-600">Loading projects...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <div>
                    <ul className="space-y-4">
                        {projects.map((project) => (
                            <ProjectItem key={project.project.ProjectID} project={project} states={props.states} />
                        ))}
                    </ul>

                    <div className="mt-6 flex justify-center">
                        {paginationLinks && (
                            <Pagination paginationLinks={paginationLinks} handleNavigation={handleNavigation} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
