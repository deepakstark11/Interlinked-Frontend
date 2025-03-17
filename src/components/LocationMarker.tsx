import React from "react";

interface LocationMarkerProps {
  lat: number;
  lng: number;
  onClick: () => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        cursor: "pointer",
      }}
    >
      {/* Custom fire icon with animation */}
      <img
        src="flames.png"
        alt="Fire Icon"
        width="35"
        height="35"
        style={{
          filter: "drop-shadow(0px 0px 6px rgba(255, 69, 0, 0.8))",
          animation: "pulse 1.5s infinite",
        }}
      />
    </div>
  );
};

export default LocationMarker;
