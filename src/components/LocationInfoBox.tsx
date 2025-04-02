import React, { useEffect, useState } from "react";
import "../styles/LocationInfoBox.css"; // Import the CSS file

interface LocationInfoProps {
  info: {
    id: string;
    title: string;
    description?: string;
    lat?: number;
    lng?: number;
    date?: string;
    category?: string;
    location?: string;
    ewm_number?: number;
    source?: string;
    image?: string;
  };
  onClose: () => void;
}

// Map EWM number to event type name
const getEventTypeName = (ewmNumber?: number) => {
  const eventTypes = [
    "Wildfire", "Hurricane", "Earthquake", "Tornado", "Tsunami",
    "Extreme Lightning/Thunderstorm", "Avalanche", "Landslide", "Drought", "Volcanic Eruption",
    "Oil Spill", "Flood (Long Term)", "Flash Flood (Short Term)", "Glacier Melting", 
    "Ice Jam/Frozen Region", "Air Quality & Pollution", "Chemical Spill/Radiation Leak",
    "Geomagnetic Storm/Solar Flare", "Extreme Heat Event", "Extreme Cold Event",
    "Severe Weather Event", "Marine Event", "Long Term Event"
  ];
  
  if (ewmNumber === undefined || ewmNumber < 0 || ewmNumber >= eventTypes.length) {
    return "Unknown Event Type";
  }
  
  return eventTypes[ewmNumber];
};

const LocationInfoBox: React.FC<LocationInfoProps> = ({ info, onClose }) => {
  const [animate, setAnimate] = useState(false);

  // Trigger animation when info changes
  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 300); // Reset animation after 300ms
    return () => clearTimeout(timeout);
  }, [info]);

  // Format the date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const eventTypeName = getEventTypeName(info.ewm_number);

  return (
    <div className={`info-box ${animate ? "animate" : ""}`}>
      <div className="info-box-header">
        <h2>{eventTypeName} Event Details</h2>
      </div>
      
      <div className="info-box-content">
        <h3>{info.title}</h3>
        
        {/* {info.image && (
          <div className="event-image">
            <img src={info.image} alt={info.title} />
          </div>
        )} */}
        
        {info.description && (
          <div className="detail-item description">
            <p>{info.description}</p>
          </div>
        )}
        
        <div className="detail-item">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{info.id}</span>
        </div>
        
        {info.category && (
          <div className="detail-item">
            <span className="detail-label">Category:</span>
            <span className="detail-value">{info.category}</span>
          </div>
        )}
        
        {info.location && (
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{info.location}</span>
          </div>
        )}
        
        {info.date && (
          <div className="detail-item">
            <span className="detail-label">Date Detected:</span>
            <span className="detail-value">{formatDate(info.date)}</span>
          </div>
        )}
        
        {info.lat && info.lng && (
          <div className="detail-item">
            <span className="detail-label">Coordinates:</span>
            <span className="detail-value">
              {info.lat.toFixed(4)}, {info.lng.toFixed(4)}
            </span>
          </div>
        )}
        
        {info.source && (
          <div className="detail-item">
            <span className="detail-label">Source:</span>
            <span className="detail-value">{info.source}</span>
          </div>
        )}
        
        <div className="actions">
          <button className="action-button primary">View Full Report</button>
          <button className="action-button tertiary" onClick={onClose}>
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationInfoBox;
