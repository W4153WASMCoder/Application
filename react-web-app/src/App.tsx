import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Login from "./Login";
import Projects from "./Projects";
import ProjectFiles from "./ProjectFiles";
import { TransitionStates } from "./models";
import "./App.css";

function App() {
  const [firstRender, setFirstRender] = useState(true); // 초기 렌더링 상태 유지
  const [currentPage, setCurrentPage] = useState<JSX.Element | null>(null);

  const states: TransitionStates = {
    login: () => setCurrentPage(<Login states={states} />),
    projects: () =>
      setCurrentPage(<Projects tokenID={Number(Cookies.get("tokenid"))} states={states} />),
    project_files: (project_id: number) =>
      setCurrentPage(
        <ProjectFiles
          tokenID={Number(Cookies.get("tokenid"))}
          project_id={project_id}
          states={states}
        />
      ),
  };


  useEffect(() => {
    if (firstRender) {
      states.login();
      setFirstRender(false);
    }
  }, [firstRender]);

  return (
    <div className="App p-4">
      {currentPage}
    </div>
  );
}

export default App;
