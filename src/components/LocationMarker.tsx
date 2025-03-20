import React from "react";

interface LocationMarkerProps {
  lat: number;
  lng: number;
  onClick: () => void;
  disasterType?: string;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ onClick, disasterType = 'wildfire' }) => {

  const getPinImage = () => {
    switch (disasterType.toLowerCase()) {
      case "earthquake":
        return "EarthquakePin.png"
      case "wildfire":
        return "WildfirePin.png"
      default:
        return "Wildfirepin.png"
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        cursor: "pointer",
        width: "35px",
        height: "35px",
        transform: "translate(-50%, -50%)"
      }}
    >
      {/* Custom fire icon with animation */}
      <img
        src={getPinImage()}
        alt={`${disasterType} Icon`}
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
