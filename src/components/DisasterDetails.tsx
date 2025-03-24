import React, { useState } from 'react';
import '../styles/DisasterDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faWind, faDroplet, faTriangleExclamation, faFireExtinguisher, faGauge, faChevronDown, faChevronUp, faTemperatureHigh, faFire } from '@fortawesome/free-solid-svg-icons';

interface DisasterDetailsProps {
  disaster: {
    image: string;
    unique_id: string;
    name: string;
    description: string;
    location: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    weather_metadata: {
      temperature: number;
      humidity: string;
      wind: string;
    };
    event_metadata: {
      acres_burned?: number;
      containment?: string;
    };
    insights: {
      risk_level: string;
    };
  };
}

const DisasterDetails: React.FC<DisasterDetailsProps> = ({ disaster }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="disaster-details-container">
      <header className="details-header">
        <div className="logo-container">
          <img src="/interlinked_logo_white.png" alt="Interlinked Logo" className="logo" />
        </div>
        <div className="header-content">
          <h1>Viewing</h1>
          <h2 className="disaster-name">{disaster.name}</h2>
          <div className="location-time">
            <h3>{disaster.location}</h3>
            <p>Time (PST): {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        <img 
          src={disaster.image || "/AltadenaFire.jpeg"} 
          alt={disaster.name} 
          className="disaster-thumbnail"
        />
      </header>

      <section className="climate-conditions">
        <h2>Current Climate Conditions:</h2>
        <div className="conditions-grid">
          <div className="condition-card">
            <FontAwesomeIcon icon={faSun} className="condition-icon" />
            <h3>Sunny</h3>
            <p>Temperature: {disaster.weather_metadata.temperature}°</p>
            <p>H: 90° L: 64°</p>
          </div>
          <div className="condition-card">
            <FontAwesomeIcon icon={faWind} className="condition-icon" />
            <h3>{disaster.weather_metadata.wind}</h3>
            <p>100 MPH Gusts</p>
          </div>
          <div className="condition-card">
            <FontAwesomeIcon icon={faDroplet} className="condition-icon" />
            <h3>{disaster.weather_metadata.humidity}</h3>
            <p>23% Humidity</p>
          </div>
          <div className="condition-card warning">
            <FontAwesomeIcon icon={faTriangleExclamation} className="condition-icon" />
            <h3>High Risk of Fire</h3>
          </div>
        </div>
      </section>

      <section className="insights-section">
        <div className="insights-container">
          <h2>Interlinked Insights</h2>
          <div className="insights-content">
            <div className="text-insights">
              <p>This wildfire shows concerning growth patterns based on current wind conditions and low humidity. Recommend evacuation preparations for residential areas within 5 miles of the perimeter.</p>
              <p>Containment efforts should focus on the northern edge where wind patterns are driving expansion.</p>
              <p>Historical data indicates similar fires in this region have required 10-14 days for full containment when weather conditions remain stable.</p>
            </div>
            <div className="metrics-container">
              <div className="metric">
                <FontAwesomeIcon icon={faFireExtinguisher} className="metric-icon" />
                <h4>Containment Status</h4>
                <p>{disaster.event_metadata.containment || "N/A"}</p>
              </div>
              <div className="metric">
                <FontAwesomeIcon icon={faGauge} className="metric-icon" />
                <h4>Fire Severity 1-10</h4>
                <p className="severity">8</p>
              </div>
            </div>
          </div>
        </div>
        <div className="action-container">
          <div className="metadata-dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              Additional Disaster Details
              <FontAwesomeIcon icon={isDropdownOpen ? faChevronUp : faChevronDown} className="dropdown-icon" />
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faTemperatureHigh} className="dropdown-icon" />
                  <h4>Temperature</h4>
                  <p>{disaster.weather_metadata.temperature}° (High: 90° Low: 64°)</p>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faWind} className="dropdown-icon" />
                  <h4>Wind Speed</h4>
                  <p>{disaster.weather_metadata.wind} with 100 MPH Gusts</p>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faDroplet} className="dropdown-icon" />
                  <h4>Humidity</h4>
                  <p>{disaster.weather_metadata.humidity} (23%)</p>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faFire} className="dropdown-icon" />
                  <h4>Fire Danger Rating</h4>
                  <p>Extreme - High risk of rapid spread</p>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faFireExtinguisher} className="dropdown-icon" />
                  <h4>Containment Status</h4>
                  <p>{disaster.event_metadata.containment || "N/A"}</p>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faGauge} className="dropdown-icon" />
                  <h4>Fire Severity</h4>
                  <p>8/10 - Severe with potential for escalation</p>
                </div>
                {disaster.event_metadata.acres_burned && (
                  <div className="dropdown-item">
                    <FontAwesomeIcon icon={faFire} className="dropdown-icon" />
                    <h4>Acres Burned</h4>
                    <p>{disaster.event_metadata.acres_burned.toLocaleString()} acres</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="message-chief">Message Chief Fields</button>
        </div>
      </section>

      <section className="map-section">
        {/* Integration with a map service like Google Maps would go here */}
        <div className="map-placeholder">
          <p>Map showing coordinates: {disaster.coordinates.latitude}, {disaster.coordinates.longitude}</p>
        </div>
      </section>
    </div>
  );
};

export default DisasterDetails; 