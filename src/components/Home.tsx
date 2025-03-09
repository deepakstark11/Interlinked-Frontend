import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css"; // Ensure styling is clean

const Home: React.FC = () => {
  const navigate = useNavigate(); // For navigation

  return (
    <div className="home-container">
      <h1>Welcome to Fire Incident Management</h1>
      <p>Track and manage fire incidents efficiently.</p>
      <button className="login-button" onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
};

export default Home;
