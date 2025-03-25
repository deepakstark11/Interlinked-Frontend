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

const FireMap: React.FC = () => {
  const [fireLocations, setFireLocations] = useState<FireEvent[]>([]);
  const [visibleFireLocations, setVisibleFireLocations] = useState<FireEvent[]>([]);
  const [selectedFire, setSelectedFire] = useState<FireEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUpdatingMarkers, setIsUpdatingMarkers] = useState<boolean>(false);
  const boundsChangeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [skipMarkerUpdate, setSkipMarkerUpdate] = useState<boolean>(false);

  // Adjust container style based on whether a fire is selected
  const containerStyle = {
    width: "100%",
    height: "94vh",
  };

  const collapsedContainerStyle = {
    width: "100%",
    height: "94vh",
  };

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

        const disasters: Event[] = data.events;

        const disasterPoints: FireEvent[] = disasters.flatMap((event: Event) => {
          // Determine disaster type
          let disasterType = "wildfire"; // Default
          
          // Check if any category contains relevant keywords
          const hasWildfire = event.categories.some(cat => 
            cat.title.toLowerCase().includes("wildfire") || 
            cat.title.toLowerCase().includes("fire")
          );
          
          const hasEarthquake = event.categories.some(cat => 
            cat.title.toLowerCase().includes("earthquake") || 
            cat.title.toLowerCase().includes("seismic")
          );
          
          // Also check the event title for keywords
          const title = event.title.toLowerCase();
          
          if (hasEarthquake || title.includes("earthquake") || title.includes("quake")) {
            disasterType = "earthquake";
          } else if (hasWildfire || title.includes("fire") || title.includes("burn")) {
            disasterType = "wildfire";
          }

          return event.geometries.map((geometry: Geometry) => ({
            id: event.id,
            title: event.title,
            lat: geometry.coordinates[1],
            lng: geometry.coordinates[0],
            date: geometry.date,
            type: disasterType
          }));
        });

        setFireLocations(disasterPoints);
      } catch (error) {
        console.error("Error fetching fire data:", error);
      }
      setLoading(false);
    };

    fetchFireData();
  }, []);

  // Update visible fires when map bounds change
  useEffect(() => {
    // Skip updates when we're just selecting/deselecting a marker
    if (skipMarkerUpdate) {
      setSkipMarkerUpdate(false);
      return;
    }
    
    if (fireLocations.length > 0 && mapBounds) {
      setIsUpdatingMarkers(true);
      
      // Calculate new visible fires
      const newVisibleFires = fireLocations.filter((fire) => {
        const fireLatLng = new google.maps.LatLng(fire.lat, fire.lng);
        return mapBounds.contains(fireLatLng);
      });
      
      // First show loading spinner for a consistent time
      setTimeout(() => {
        // Hide spinner
        setIsUpdatingMarkers(false);
        
        // Clear existing markers first to ensure animation works on re-entry
        setVisibleFireLocations([]);
        
        // Add a small delay before showing new markers to create transition effect
        setTimeout(() => {
          setVisibleFireLocations(newVisibleFires);
        }, 100);
      }, 400);
    } else if (fireLocations.length > 0 && userLocation && !mapBounds) {
      // Fallback to user location if map bounds not yet available
      setIsUpdatingMarkers(true);
      
      const newVisibleFires = fireLocations.filter(
        (fire) =>
          Math.abs(fire.lat - userLocation.lat) <= 1.0 &&
          Math.abs(fire.lng - userLocation.lng) <= 1.0
      );
      
      setTimeout(() => {
        setIsUpdatingMarkers(false);
        setVisibleFireLocations([]);
        
        setTimeout(() => {
          setVisibleFireLocations(newVisibleFires);
        }, 100);
      }, 400);
    }
  }, [fireLocations, mapBounds, userLocation, skipMarkerUpdate]);

  // Debounced bounds change handler
  const handleBoundsChanged = React.useCallback(() => {
    if (!mapRef) return;
    
    // Clear any existing timeout
    if (boundsChangeTimeoutRef.current) {
      clearTimeout(boundsChangeTimeoutRef.current);
    }
    
    // Set a new timeout to update bounds after dragging stops
    boundsChangeTimeoutRef.current = setTimeout(() => {
      if (mapRef) {
        setMapBounds(mapRef.getBounds()!);
      }
    }, 300); // 300ms delay
  }, [mapRef]);

  // Handle map events
  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    
    // Add event listeners directly to the map
    map.addListener('idle', () => {
      setMapBounds(map.getBounds()!);
      setIsDragging(false);
    });
    
    map.addListener('dragstart', () => {
      setIsDragging(true);
      setIsUpdatingMarkers(true);
    });
    
    // Initial bounds setting
    if (map.getBounds()) {
      setMapBounds(map.getBounds()!);
    }
  };

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      if (boundsChangeTimeoutRef.current) {
        clearTimeout(boundsChangeTimeoutRef.current);
      }
    };
  }, []);

  // Optimize marker rendering with a custom click handler
  const handleMarkerClick = (fire: FireEvent) => {
    // Set flag to skip marker update
    setSkipMarkerUpdate(true);
    // Set selected fire
    setSelectedFire(fire);
  };

  // Handle closing the details panel without re-rendering markers
  const handleCloseDetails = () => {
    // Set flag to skip marker update
    setSkipMarkerUpdate(true);
    // Clear selected fire
    setSelectedFire(null);
  };

  // Optimize marker rendering
  const markerElements = useMemo(
    () => {
      return visibleFireLocations.map((fire, index) => (
        <OverlayView
          key={`${fire.id}-${fire.lat}-${fire.lng}-${index}`}
          position={{ lat: fire.lat, lng: fire.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className="marker-animation-wrapper">
            <LocationMarker 
              lat={fire.lat} 
              lng={fire.lng} 
              onClick={() => handleMarkerClick(fire)} 
              // disasterType={fetchFireData()}
            />
          </div>
        </OverlayView>
      ));
    },
    [visibleFireLocations]
  );

  const mapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    fullscreenControl: false,
    rotateControl: false,
    scaleControl: false,
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

  // Format the date for display
  const formatDate = (dateString: string) => {
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
    <div className={`fire-map-container ${selectedFire ? 'with-details' : ''}`}>
      <div className="map-wrapper">
        {!loading && userLocation ? (
          <>
            <GoogleMap 
              mapContainerStyle={selectedFire ? collapsedContainerStyle : containerStyle} 
              center={userLocation} 
              zoom={9}  
              options={mapOptions}
              onLoad={onMapLoad}
            >
              {markerElements}
            </GoogleMap>
            
            {/* Overlay spinner when updating markers */}
            {isUpdatingMarkers && (
              <div className="map-updating-overlay">
                <PulseLoader color="#ff5733" size={15} />
                <p>Updating fire data...</p>
              </div>
            )}
          </>
        ) : (
          <div className="spinner-container">
            <PulseLoader color="#ff5733" />
            <p>Loading Fire Data...</p>
          </div>
        )}
      </div>

      {selectedFire && (
        <div className="fire-details-panel">
          <LocationInfoBox 
            info={selectedFire} 
            onClose={handleCloseDetails} 
          />
        </div>
      )}
    </div>
  );
};

export default FireMap;
