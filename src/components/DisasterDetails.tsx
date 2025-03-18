import React, {useState, useRef} from 'react';
import '../styles/DisasterDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faWind, faDroplet, faTriangleExclamation, faFireExtinguisher, faGauge, faChevronUp } from '@fortawesome/free-solid-svg-icons';

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
  //state var(s)
  const [showScrollTop, setShowScrollTop] = useState(false);

  //ref
  const detailContainerRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = () => {
    if (detailContainerRef.current) {
      setShowScrollTop(detailContainerRef.current.scrollTop > 200);
    }
  };

  const scrollToTop = () => {
    if (detailContainerRef.current) {
      detailContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="disaster-details-container"
        ref={detailContainerRef}
        onScroll={handleScroll}
    >
      <header className="details-header">
        <div className="logo-container">
          <img src="/interlinkedlogo.jpg" alt="Interlinked Logo" className="logo" />
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
          src={disaster.image || "/default-disaster-image.jpg"} 
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
              {/* Add your AI-generated insights here */}
              <p>Analysis and recommendations would go here...</p>
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
        <button className="message-chief">Message Chief Fields</button>
      </section>

      <section className="map-section">
        {/* Integration with a map service like Google Maps would go here */}
        <div className="map-placeholder">
          <p>Map showing coordinates: {disaster.coordinates.latitude}, {disaster.coordinates.longitude}</p>
          <div className="map-image-placeholder">
            <p>Interactive map would be displayed here</p>
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      )}
    </div>
  );
};

export default DisasterDetails; 