// src/App.js
import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import MyComponent from './components/MyComponent';
import ProjectFilesList from './components/ProjectFilesList';
import './App.css';

function App() {
   return (
        <div className="app">
            <header className="header">
                <h1>My Website Title</h1>
            </header>
            <div className="main">
                <Navbar />
                <div className="content">
                    <Home />
                    <MyComponent />

                    <ProjectFilesList />
                </div>
            </div>
        </div>
    );
}

export default App;
