import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import LocationMarker from "./LocationMarker"; // Import the custom marker component
import LocationInfoBox from "./LocationInfoBox"; // Import the info box component
import "../styles/FireMap.css"; // Import CSS file for styling

// Define TypeScript interface for fire event data
interface FireEvent {
  id: string;
  title: string;
  lat: number;
  lng: number;
  date: string;
}

// Map container styles
const containerStyle = {
  width: "100%",
  height: "600px",
};

// **Set the map center to Los Angeles**
const center = {
  lat: 34.0522,
  lng: -118.2437,
};

// Define a boundary for Los Angeles (Latitude & Longitude range)
const LOS_ANGELES_BOUNDS = {
  latMin: 33.5, // Southern boundary
  latMax: 34.8, // Northern boundary
  lngMin: -119.0, // Western boundary
  lngMax: -117.5, // Eastern boundary
};

const FireMap: React.FC = () => {
  const [fireLocations, setFireLocations] = useState<FireEvent[]>([]);
  const [selectedFire, setSelectedFire] = useState<FireEvent | null>(null);

  useEffect(() => {
    fetchFireData();
  }, []);

  const fetchFireData = async () => {
    try {
      const response = await fetch("https://eonet.gsfc.nasa.gov/api/v2.1/events");
      const data = await response.json();

      // Define types for API response structure
      interface Geometry {
        coordinates: [number, number]; // [lng, lat]
        date: string;
      }

      interface Event {
        id: string;
        title: string;
        categories: { title: string }[];
        geometries: Geometry[];
      }

      // Filter only wildfire events
      const wildfires: Event[] = data.events.filter((event: Event) =>
        event.categories.some((category) => category.title === "Wildfires")
      );

      // Extract & filter fires within Los Angeles bounds
      const firePoints: FireEvent[] = wildfires.flatMap((event: Event) =>
        event.geometries
          .map((geometry: Geometry) => ({
            id: event.id,
            title: event.title,
            lat: geometry.coordinates[1], // Swap coordinates [lng, lat] → [lat, lng]
            lng: geometry.coordinates[0],
            date: geometry.date,
          }))
          .filter(
            (fire) =>
              fire.lat >= LOS_ANGELES_BOUNDS.latMin &&
              fire.lat <= LOS_ANGELES_BOUNDS.latMax &&
              fire.lng >= LOS_ANGELES_BOUNDS.lngMin &&
              fire.lng <= LOS_ANGELES_BOUNDS.lngMax
          )
      );

      setFireLocations(firePoints);
    } catch (error) {
      console.error("Error fetching fire data:", error);
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9}>
        {/* Overlaying custom fire markers */}
        {fireLocations.map((fire) => (
          <OverlayView
            key={fire.id}
            position={{ lat: fire.lat, lng: fire.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} // Ensures it is clickable
          >
            <LocationMarker
              lat={fire.lat}
              lng={fire.lng}
              onClick={() => setSelectedFire(fire)}
            />
          </OverlayView>
        ))}

        {/* Displaying fire event information using LocationInfoBox */}
        {selectedFire && (
          <div className="fire-info-container">
            <LocationInfoBox info={{ id: selectedFire.id, title: selectedFire.title }} />
            <button className="close-button" onClick={() => setSelectedFire(null)}>
              Close
            </button>
          </div>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default FireMap;
