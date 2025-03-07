// import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import IncidentList from "./components/IncidentList";
import FireMap from "./components/FireMap";
import "./App.css";

const App: React.FC = () => {
 
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<FireMap/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// Home component
const Home: React.FC = () => {
  return (
    <div>
      <h1>Location: Los Angeles</h1>
      <IncidentList />
    </div>
  );
};

export default App;
