import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css"; // Ensure styling is clean

const Home: React.FC = () => {
  const navigate = useNavigate(); // For navigation
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-container">
      <div className="background-layer"></div>
      <div className={`hero-section ${loaded ? 'fade-in' : ''}`}>
        <div className="logo-container">
          <img src="/interlinked_logo_white.png" alt="Interlinked Logo" className="logo" />
        </div>
        <p className="tagline">Advanced Wildfire Monitoring & Response System</p>
        <button 
          className="primary-button" 
          onClick={() => navigate("/login")}
          aria-label="Sign in to your account"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Home;
