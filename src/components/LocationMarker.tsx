import React, { useState } from "react";
// import earthquakePin from '/src/assets/EarthquakePin.png';
// import wildfirePin from '/src/assets/WildfirePin.png';

interface LocationMarkerProps {
  lat: number;
  lng: number;
  onClick: () => void;
  disasterType?: number | string;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ onClick, disasterType = '' }) => {

  const [imageLoaded, setImageLoaded] = useState(false);
  // const [imageError, setImageError] = useState(false);

  const getMarkerImage = () => {
    // Handle both string and number types for backward compatibility
    if (typeof disasterType === 'number') {
      // EWM number-based icons
      switch (disasterType) {
        case 0: // Wildfires
          return "/WildfirePin.png";
        case 1: // Hurricanes
          return "/hurricane.png";
        case 2: // Earthquakes
          return "/earthquake.png";
        case 3: // Tornadoes
          return "/tornado.png";
        case 4: // Tsunamis
          return "/tsunami.png";
        case 5: // Extreme Lightning/Thunderstorms
          return "/lightning.png";
        case 6: // Avalanches
          return "/avalanche.png";
        case 7: // Landslides
          return "/landslide.png";
        case 8: // Droughts
          return "/drought.png";
        case 9: // Volcanic Eruptions
          return "/volcano.png";
        case 10: // Oil Spills
          return "/oilspill.png";
        case 11: // Flood (Long Term)
          return "/flood.png";
        case 12: // Flash Floods (Short Term)
          return "/flashflood.png";
        case 13: // Glacier Melting
          return "/glacier.png";
        case 14: // Ice Jams/Frozen Regions
          return "/icejam.png";
        case 15: // Air Quality & Pollution
          return "/pollution.png";
        case 16: // Chemical Spills/Radiation Leaks
          return "/chemical.png";
        case 17: // Geomagnetic Storms/Solar Flares
          return "/solarflares.png";
        case 18: // Extreme Heat Events
          return "/heat.png";
        case 19: // Extreme Cold Events
          return "/cold.png";
        case 20: // Severe Weather Events
          return "/extremeweather.png";
        case 21: // Marine Events
          return "/marine.png";
        case 22: // Long Term Events
          return "/longterm.png";
        default:
          return "/DefaultPin.png";
      }
    } else {
      // Legacy string-based logic
      if (disasterType.toLowerCase().includes("quake")) {
        return "/EarthquakePin.png";
      } else if (disasterType.toLowerCase().includes("fire")) {
        return "/WildfirePin.png";
      } else if (disasterType.toLowerCase().includes("flood")) {
        return "/FloodPin.png";
      } else if (disasterType.toLowerCase().includes("hurricane")) {
        return "/HurricanePin.png";
      } else if (disasterType.toLowerCase().includes("tornado")) {
        return "/TornadoPin.png";
      } else {
        return "/DefaultPin.png";
      }
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
        alt={`Disaster Icon`}
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
          // Use default icon if the specific one fails to load
          const imgElement = e.target as HTMLImageElement;
          if (!imgElement.src.includes("DefaultPin.png")) {
            imgElement.src = "/DefaultPin.png";
          }
        }}
      />
    </div>
  );
};

export default LocationMarker;