import React, { useState, useEffect, useMemo } from "react";
import { GoogleMap, OverlayView } from "@react-google-maps/api";
import LocationMarker from "./LocationMarker";
import LocationInfoBox from "./LocationInfoBox";
import "../styles/FireMap.css";
import { PulseLoader } from "react-spinners";
import fetchEvents from "../api/fetchEvents";

// Define event type mapping
const EVENT_TYPES = [
  { id: 0, name: "Wildfires" },
  { id: 1, name: "Hurricanes" },
  { id: 2, name: "Earthquakes" },
  { id: 3, name: "Tornadoes" },
  { id: 4, name: "Tsunamis" },
  { id: 5, name: "Extreme Lightning/Thunderstorms" },
  { id: 6, name: "Avalanches" },
  { id: 7, name: "Landslides" },
  { id: 8, name: "Droughts" },
  { id: 9, name: "Volcanic Eruptions" },
  { id: 10, name: "Oil Spills" },
  { id: 11, name: "Flood (Long Term)" },
  { id: 12, name: "Flash Floods (Short Term)" },
  { id: 13, name: "Glacier Melting" },
  { id: 14, name: "Ice Jams/Frozen Regions" },
  { id: 15, name: "Air Quality & Pollution" },
  { id: 16, name: "Chemical Spills/Radiation Leaks" },
  { id: 17, name: "Geomagnetic Storms/Solar Flares" },
  { id: 18, name: "Extreme Heat Events" },
  { id: 19, name: "Extreme Cold Events" },
  { id: 20, name: "Severe Weather Events" },
  { id: 21, name: "Marine Events" },
  { id: 22, name: "Long Term Events" },
];

interface DisasterEvent {
  unique_id: string;
  name: string;
  description: string;
  category: string;
  date_of_occurrence: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  source: string;
  event_metadata: any;
  weather_metadata: any;
  insights: any;
  ewm_number: number;
  status: string;
  image: string;
}

interface FireEvent {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  date: string;
  category: string;
  location: string;
  ewm_number: number;
  source: string;
  image: string;
}

// Function to generate mock events for testing
const generateMockEvents = (userLocation: { lat: number, lng: number } | null): FireEvent[] => {
  if (!userLocation) return [];

  const mockEvents: FireEvent[] = [];
  
  // Helper function to get appropriate image for each event type
  const getEventTypeImage = (ewmNumber: number): string => {
    switch (ewmNumber) {
      case 0: // Wildfires
        return "/WildfireImage.jpg";
      case 1: // Hurricanes
        return "/HurricaneImage.jpg";
      case 2: // Earthquakes
        return "/ChatsworthEarthquake.jpeg";
      case 3: // Tornadoes
        return "/TornadoImage.jpg";
      case 4: // Tsunamis
        return "/TsunamiImage.jpg";
      case 5: // Extreme Lightning/Thunderstorms
        return "/LightningImage.jpg";
      case 6: // Avalanches
        return "/AvalancheImage.jpg";
      case 7: // Landslides
        return "/LandslideImage.jpg";
      case 8: // Droughts
        return "/DroughtImage.jpg";
      case 9: // Volcanic Eruptions
        return "/VolcanoImage.jpg";
      case 10: // Oil Spills
        return "/OilSpillImage.jpg";
      case 11: // Flood (Long Term)
        return "/FloodImage.jpg";
      case 12: // Flash Floods (Short Term)
        return "/FlashFloodImage.jpg";
      case 13: // Glacier Melting
        return "/GlacierImage.jpg";
      case 14: // Ice Jams/Frozen Regions
        return "/IceJamImage.jpg";
      case 15: // Air Quality & Pollution
        return "/PollutionImage.jpg";
      case 16: // Chemical Spills/Radiation Leaks
        return "/ChemicalSpillImage.jpg";
      case 17: // Geomagnetic Storms/Solar Flares
        return "/SolarFlareImage.jpg";
      case 18: // Extreme Heat Events
        return "/HeatWaveImage.jpg";
      case 19: // Extreme Cold Events
        return "/ColdSnapImage.jpg";
      case 20: // Severe Weather Events
        return "/SevereWeatherImage.jpg";
      case 21: // Marine Events
        return "/MarineEventImage.jpg";
      case 22: // Long Term Events
        return "/LongTermEventImage.jpg";
      default:
        return "/DefaultDisasterImage.jpg";
    }
  };
  
  // Create one event for each disaster type
  EVENT_TYPES.forEach((eventType, index) => {
    // Create a random location around the user's position (within 50km)
    const randomLatOffset = (Math.random() - 0.5) * 0.5; // ~50km latitude range
    const randomLngOffset = (Math.random() - 0.5) * 0.5; // ~50km longitude range
    
    const mockEvent: FireEvent = {
      id: `mock-${eventType.id}-${Date.now()}`,
      title: `${eventType.name} Sample Event`,
      description: `This is a sample ${eventType.name.toLowerCase()} event created for testing purposes. In a real scenario, this would contain actual event information.`,
      lat: userLocation.lat + randomLatOffset,
      lng: userLocation.lng + randomLngOffset,
      date: new Date().toISOString(),
      category: eventType.name,
      location: `Near Sample City, ${index % 2 === 0 ? 'North' : 'South'} Region`,
      ewm_number: eventType.id,
      source: "Sample Data Generator",
      image: getEventTypeImage(eventType.id),
    };
    
    mockEvents.push(mockEvent);
  });
  
  return mockEvents;
};

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
  const [selectedEventType, setSelectedEventType] = useState<number | null>(null);
  const [useMockData, setUseMockData] = useState<boolean>(false);

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
    const fetchDisasterData = async () => {
      setLoading(true);
      try {
        let disasterPoints: FireEvent[] = [];
        
        if (useMockData) {
          // Use mock data for testing
          disasterPoints = generateMockEvents(userLocation);
        } else {
          // Use real data from API - default to 7 days
          const events = await fetchEvents(7);
          
          // Map the disaster events to the FireEvent format
          disasterPoints = events.map((event: DisasterEvent) => ({
            id: event.unique_id,
            title: event.name,
            description: event.description,
            lat: event.coordinates.latitude,
            lng: event.coordinates.longitude,
            date: event.date_of_occurrence,
            category: event.category,
            location: event.location,
            ewm_number: event.ewm_number,
            source: event.source,
            image: event.image
          }));
        }

        setFireLocations(disasterPoints);
      } catch (error) {
        console.error("Error fetching disaster data:", error);
      }
      setLoading(false);
    };

    if (userLocation) {
      fetchDisasterData();
    }
  }, [userLocation, useMockData]);

  // Filter by selected event type when it changes
  useEffect(() => {
    if (selectedEventType !== null) {
      setIsUpdatingMarkers(true);
      
      // Filter the events by the selected type
      const filteredEvents = fireLocations.filter(
        event => event.ewm_number === selectedEventType
      );
      
      setTimeout(() => {
        setIsUpdatingMarkers(false);
        setVisibleFireLocations(filteredEvents);
      }, 400);
    } else if (fireLocations.length > 0 && mapBounds) {
      // If no event type is selected, filter by map bounds
      const newVisibleFires = fireLocations.filter((fire) => {
        const fireLatLng = new google.maps.LatLng(fire.lat, fire.lng);
        return mapBounds.contains(fireLatLng);
      });
      
      setVisibleFireLocations(newVisibleFires);
    }
  }, [selectedEventType, fireLocations, mapBounds]);

  // Update visible fires when map bounds change
  useEffect(() => {
    // Skip updates when we're just selecting/deselecting a marker
    if (skipMarkerUpdate) {
      setSkipMarkerUpdate(false);
      return;
    }
    
    // If an event type is selected, don't filter by bounds
    if (selectedEventType !== null) return;
    
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
  }, [fireLocations, mapBounds, userLocation, skipMarkerUpdate, selectedEventType]);

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

  // Handle event type selection
  const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      setSelectedEventType(null);
    } else {
      setSelectedEventType(parseInt(value));
    }
  };

  // Toggle between real and mock data
  const toggleDataSource = () => {
    setUseMockData(!useMockData);
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
              disasterType={fire.ewm_number}
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
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="event-type">Event Type:</label>
          <select 
            id="event-type" 
            value={selectedEventType === null ? "" : selectedEventType} 
            onChange={handleEventTypeChange}
          >
            <option value="">All Events</option>
            {EVENT_TYPES.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group data-toggle">
          <label>
            <input 
              type="checkbox" 
              checked={useMockData} 
              onChange={toggleDataSource} 
            />
            Use Sample Data
          </label>
          <div className="data-source-info">
            {useMockData ? 'Showing sample events (all categories)' : 'Showing real events from API'}
          </div>
        </div>
      </div>

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
                <p>Updating event data...</p>
              </div>
            )}
          </>
        ) : (
          <div className="spinner-container">
            <PulseLoader color="#ff5733" />
            <p>Loading Event Data...</p>
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
