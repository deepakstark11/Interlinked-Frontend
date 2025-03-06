import React from "react";

interface LocationInfoProps {
  info: {
    id: string;
    title: string;
  };
}

const LocationInfoBox: React.FC<LocationInfoProps> = ({ info }) => {
    return (
      <div>
        <h2>Wildfire Info</h2>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
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
