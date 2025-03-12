import React, { useEffect, useState } from "react";
import "../styles/LocationInfoBox.css"; // Import the CSS file

interface LocationInfoProps {
  info: {
    id: string;
    title: string;
    lat?: number;
    lng?: number;
    date?: string;
  };
  onClose: () => void;
}

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

  return (
    <div className={`info-box ${animate ? "animate" : ""}`}>
      <div className="info-box-header">
        <h2>Fire Event Details</h2>
      </div>
      
      <div className="info-box-content">
        <h3>{info.title}</h3>
        
        <div className="detail-item">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{info.id}</span>
        </div>
        
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
        
        <div className="actions">
          <button className="action-button primary">View Full Report</button>
          <button className="action-button secondary">Alert Authorities</button>
          <button className="action-button tertiary" onClick={onClose}>
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationInfoBox;
