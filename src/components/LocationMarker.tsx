import React, { useState, useEffect } from "react";
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

  // Add effect to pre-load image
  // useEffect(() => {
  //   const img = new Image();
  //   img.onload = () => {
  //     console.log("Image preloaded successfully:", img.src);
  //     setImageLoaded(true);
  //   };
  //   img.onerror = () => {
  //     console.error("Image failed to preload:", img.src);
  //     setImageError(true);
  //   };
  //   img.src = getMarkerImage();
  // }, [disasterType]);

  // // Fallback marker if image fails to load
  // const renderFallbackMarker = () => (
  //   <div style={{
  //     width: "20px",
  //     height: "20px",
  //     backgroundColor: disasterType.toLowerCase().includes("earthquake") ? "#4B0082" : "#FF5733",
  //     borderRadius: "50%",
  //     border: "3px solid white",
  //     boxShadow: "0 0 8px rgba(0,0,0,0.7)",
  //     position: "absolute",
  //     top: "50%",
  //     left: "50%",
  //     transform: "translate(-50%, -50%)",
  //     zIndex: 10000
  //   }} />
  // );

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        console.log("Marker clicked!");
        onClick();
      }}
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
        height="60"
        style={{
          objectFit: "contain",
          filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.5))",
        }}
        onLoad={() => {
          console.log("✅ Image loaded successfully:", getMarkerImage());
          setImageLoaded(true);
        }}
        onError={(e) => {
          console.error("❌ Image failed to load:", getMarkerImage());
          // You could set a fallback source here if needed
          // e.g., (e.target as HTMLImageElement).src = "/fallback.png";
        }}
      />
      {/* Always render the fallback first for guaranteed visibility */}
      {/* {renderFallbackMarker()} */}
      
      {/* Then try to render the image on top */}
      {/* <img
        src={getMarkerImage()}
        alt={`${disasterType} Icon`}
        width="40"
        height="60"
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
          setImageError(true);
        }}
      /> */}
    </div>
  );
};

export default LocationMarker;