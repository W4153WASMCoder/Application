import React, { useState } from 'react';
import Login from './Login'
import Projects from './Projects'
import logo from './logo.svg';
import './App.css';

function App() {
  const [tokenID, setTokenID] = useState(-1);
  const [state, setState] = useState()
  const page = tokenID == -1 ? <Login setToken={setTokenID} /> : (<Projects tokenID={tokenID} />);
  return (
    <div className="App">
      {page}
    </div>
  );
}

export default App;
