import React, { useEffect, useState } from "react";
import "../styles/LocationInfoBox.css"; // Import the CSS file

interface LocationInfoProps {
  info: {
    id: string;
    title: string;
  };
}

const LocationInfoBox: React.FC<LocationInfoProps> = ({ info }) => {
  const [animate, setAnimate] = useState(false);

  // Trigger animation when info changes
  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 300); // Reset animation after 300ms
    return () => clearTimeout(timeout);
  }, [info]);

  return (
    <div className={`info-box ${animate ? "animate" : ""}`}>
      <h2>🔥 Wildfire Information</h2>
      <ul>
        <li>
          <strong>ID:</strong> {info.id}
        </li>
        <li>
          <strong>Title:</strong> {info.title}
        </li>
      </ul>
    </div>
  );
};

export default LocationInfoBox;
