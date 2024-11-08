import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Login from './Login';
import Projects from './Projects';
import ProjectFiles from './ProjectFiles'; 
import { TransitionStates } from './models'
import logo from './logo.svg';
import './App.css';

function App() {
  const [firstRender, setFirstRender] = useState(true);
  const [currentPage, setCurrentPage] = useState<JSX.Element | null>(null);

  const states:TransitionStates = {
    login: () => setCurrentPage(<Login states={states} />),
    projects: () => setCurrentPage(<Projects tokenID={Number(Cookies.get("tokenid"))} states={states} />),
    project_files: (project_id: number) => setCurrentPage(<ProjectFiles tokenID={Number(Cookies.get("tokenid"))} project_id={project_id} states={states} />),
  };
  // Initial page load effect to display the login page by default
  useEffect(() => {
    states.login();
    setFirstRender(false);
  }, [firstRender])

  return (
    <div className="App">
      {currentPage}
    </div>
  );
}

export default App;
