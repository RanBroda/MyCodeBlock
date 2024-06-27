
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LobbyPage from "./LobbyPage";
import CodeBlockPage from "./components/CodeBlockPage";

function App() {
  return (
      <Router>
        <Routes>
          <Route exact path="/" element={<LobbyPage />} />
            <Route path={"/code-block/:id"} element={<CodeBlockPage />} />
        </Routes>
      </Router>
  );
}

export default App;
