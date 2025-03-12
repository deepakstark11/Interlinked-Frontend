import React, { useState, useEffect, useMemo } from "react";
import { GoogleMap, OverlayView } from "@react-google-maps/api";
import LocationMarker from "./LocationMarker";
import LocationInfoBox from "./LocationInfoBox";
import "../styles/FireMap.css";
import { PulseLoader } from "react-spinners";

interface FireEvent {
  id: string;
  title: string;
  lat: number;
  lng: number;
  date: string;
}

const containerStyle = {
  width: "100%",
  height: "1010px",
};

const FireMap: React.FC = () => {
  const [fireLocations, setFireLocations] = useState<FireEvent[]>([]);
  const [visibleFireLocations, setVisibleFireLocations] = useState<FireEvent[]>([]);
  const [selectedFire, setSelectedFire] = useState<FireEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error fetching location:", error);
      }
    );
  }, []);

  useEffect(() => {
    const fetchFireData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://eonet.gsfc.nasa.gov/api/v2.1/events");
        const data = await response.json();

        interface Geometry {
          coordinates: [number, number];
          date: string;
        }

        interface Event {
          id: string;
          title: string;
          categories: { title: string }[];
          geometries: Geometry[];
        }

        const wildfires: Event[] = data.events.filter((event: Event) =>
          event.categories.some((category) => category.title === "Wildfires")
        );

        const firePoints: FireEvent[] = wildfires.flatMap((event: Event) =>
          event.geometries.map((geometry: Geometry) => ({
            id: event.id,
            title: event.title,
            lat: geometry.coordinates[1],
            lng: geometry.coordinates[0],
            date: geometry.date,
          }))
        );

        setFireLocations(firePoints);
      } catch (error) {
        console.error("Error fetching fire data:", error);
      }
      setLoading(false);
    };

    fetchFireData();
  }, []);

  useEffect(() => {
    if (fireLocations.length > 0 && userLocation) {
      const visibleFires = fireLocations.filter(
        (fire) =>
          Math.abs(fire.lat - userLocation.lat) <= 1.0 &&
          Math.abs(fire.lng - userLocation.lng) <= 1.0
      );
      setVisibleFireLocations(visibleFires);
    }
  }, [fireLocations, userLocation]);

  const markerElements = useMemo(
    () =>
      visibleFireLocations.map((fire, index) => (
        <OverlayView
          key={`${fire.id}-${fire.lat}-${fire.lng}-${index}`}
          position={{ lat: fire.lat, lng: fire.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <LocationMarker lat={fire.lat} lng={fire.lng} onClick={() => setSelectedFire(fire)} />
        </OverlayView>
      )),
    [visibleFireLocations]
  );

  const mapOptions = {
    mapTypeControl: false, // Removes Map/Satellite button
    streetViewControl: false, // Removes Street View button
    zoomControl: false, // Removes zoom buttons
    fullscreenControl: false, // Removes full-screen button
    rotateControl: false, // Removes rotation control
    scaleControl: false, // Hides the scale indicator
    styles: [
      {
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "color": "#444444"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#f2f2f2"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "lightness": 45
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "labels.icon",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#0465b0"
              },
              {
                  "visibility": "on"
              }
          ]
      }
  ]
      
  };

  return (
    <React.Fragment>
{!loading && userLocation ? (
        <GoogleMap mapContainerStyle={containerStyle} center={userLocation} zoom={9}  options={mapOptions} >
          {markerElements}

          {selectedFire && (
            <div className="fire-info-container">
              <LocationInfoBox info={{ id: selectedFire.id, title: selectedFire.title }} />
              <button className="close-button" onClick={() => setSelectedFire(null)}>
                Close
              </button>
            </div>
          )}
        </GoogleMap>
      ) : (
        <div className="spinner-container">
          <PulseLoader color="#ff5733" />
          <p>Loading Fire Data...</p>
        </div>
      )}
    </React.Fragment>
      
  );
};

export default FireMap;
