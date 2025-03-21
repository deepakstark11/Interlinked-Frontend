import React, { useState } from "react";
// import earthquakePin from '/src/assets/EarthquakePin.png';
// import wildfirePin from '/src/assets/WildfirePin.png';

interface LocationMarkerProps {
  lat: number;
  lng: number;
  onClick: () => void;
  disasterType?: string;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ onClick, disasterType = '' }) => {

  const [imageLoaded, setImageLoaded] = useState(false);
  // const [imageError, setImageError] = useState(false);

  const getMarkerImage = () => {
    if (disasterType.toLowerCase().includes("quake")) {
      return "/EarthquakePin.png"; // Public folder path
    } else {
      return "/WildfirePin.png"; // Public folder path
    }
  };

  console.log("LocationMarker rendering with type:", disasterType);
  console.log("Image path:", getMarkerImage());

  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        transform: "translate(-50%, -100%)",
        cursor: "pointer",
        width: "70px",
        height: "54px",
        zIndex: 99999
      }}
    >
      <img
        src={getMarkerImage()}
        alt={`${disasterType} Icon`}
        width="40"
        height="40"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.8))",
          animation: "pulse 1.5s infinite",
          zIndex: 10001,
          // Hide image initially until it loads
          opacity: imageLoaded ? 1 : 0
        }}
        onLoad={(e) => {
          console.log("Image loaded in DOM:", (e.target as HTMLImageElement).src);
          setImageLoaded(true);
        }}
        onError={(e) => {
          console.error("Image failed to load in DOM:", (e.target as HTMLImageElement).src);
        }}
      />
    </div>
  );
};

export default LocationMarker;