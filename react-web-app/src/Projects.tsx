import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Project, PaginationLinks, ProjectWithLinks } from './models';
import ProjectItem from './ProjectItem';
import Pagination from './Pagination';

export interface ProjectsProps {
    tokenID: number;
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
        <div>
            <h1>Projects</h1>

            {loading && <p>Loading projects...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div>
                    <ul>
                        {projects.map((project) => (
                            <ProjectItem key={project.project.ProjectID} project={project} />
                        ))}
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
