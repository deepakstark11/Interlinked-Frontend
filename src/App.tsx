// import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import FireMap from "./components/FireMap";
import "./App.css";
import { LoadScript } from "@react-google-maps/api";




const App: React.FC = () => {
 
  return (
 <LoadScript googleMapsApiKey={import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY}>
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<FireMap />} />
          </Routes>
        </div>
      </div>
    </Router>
  </LoadScript>
  );
};



export default App;
