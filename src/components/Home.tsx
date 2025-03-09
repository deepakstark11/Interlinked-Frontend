import React, { useState, useEffect } from "react";
import IncidentList from "./IncidentList";
import "../styles/Home.css";

const Home: React.FC = () => {
  const [location, setLocation] = useState<string>("Fetching location...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation(data.address.city || data.address.town || "Unknown Location");
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation("Location unavailable");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Location access denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  return (

<div className="home-container">
    <h1 className="centered-heading">Location: {location}</h1>
    <IncidentList />
  </div>
 

    
  );
};

export default Home;
