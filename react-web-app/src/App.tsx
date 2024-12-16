import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Login from "./Login";
import Projects from "./Projects";
import ProjectFiles from "./ProjectFiles";
import { TransitionStates } from "./models";

function App() {
    const [currentPage, setCurrentPage] = useState<JSX.Element | null>(null);

    const states: TransitionStates = {
        login: () => setCurrentPage(<Login states={states} />),
        projects: () =>
            setCurrentPage(
                <Projects
                    tokenID={Number(Cookies.get("tokenid"))}
                    states={states}
                />
            ),
        project_files: (project_id: number) =>
            setCurrentPage(
                <ProjectFiles
                    tokenID={Number(Cookies.get("tokenid"))}
                    project_id={project_id}
                    states={states}
                />
            ),
    };

    // redirect to login if token does not exist
    useEffect(() => {
        const tokenID = Cookies.get("tokenid");
        if (tokenID) {
            states.projects(); 
        } else {
            states.login(); 
        }
    }, []);

    return <div className="App">{currentPage}</div>;
}

export default App;
