import React, {useState, useRef, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/DisasterDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faWind, faDroplet, faTriangleExclamation, faFireExtinguisher, faGauge, faChevronDown, faChevronUp, faTemperatureHigh, faFire } from '@fortawesome/free-solid-svg-icons';
import { GoogleMap, OverlayView, Marker } from "@react-google-maps/api";
import { PulseLoader } from "react-spinners";
import fetchDisasterById from '../api/fetchDisasterById';

interface DisasterDetailsProps {
  disaster: {
    image: string;
    unique_id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    weather_metadata: {
      temperature: number;
      humidity: string;
      wind: string;
    };
    event_metadata: {
      acres_burned?: number;
      containment?: string;
    };
    insights: {
      risk_level: string;
    };
  };
}

const DisasterDetails: React.FC<DisasterDetailsProps> = () => {
  //state and ref vars for scrolling
  const [showScrollTop, setShowScrollTop] = useState(false);
  const detailContainerRef = useRef<HTMLDivElement>(null);

  //states for map
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  // Get disaster ID from URL params
  const {id} = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for disaster data
  const [loading, setLoading] = useState<boolean>(true);
  const [disasterData, setDisasterData] = useState<DisasterDetailsProps['disaster'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  //fetch disaster data by the ID...mainly the location 
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No disaster ID specified");
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Fetch disaster data using the ID
        const data = await fetchDisasterById(id);
        
        // Check if data was found
        if (data) {
          setDisasterData(data);
        } else {
          setError("Disaster data not found. Please return to the incident list.");
        }
      } catch (err) {
        console.error("Error fetching disaster details:", err);
        setError("Failed to load disaster details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  //fetch the disaster Type for the type of Pin on the map
  const getDisasterType = () => {
    if (!disasterData) return "wildfire"; // Default
    
    // If disasterType is explicitly defined in your data
    if (disasterData.category) {
      const category = disasterData.category.toLowerCase();
      // console.log("getDisasterType - Checking category:", category);
      if (category.includes("earthquake")) {
        // console.log("getDisasterType - Category indicates earthquake");
        return "earthquake";
      } else if (category.includes("fire") || category.includes("wildfire")) {
        // console.log("getDisasterType - Category indicates wildfire");
        return "wildfire";
      } 
    }

    // Check disaster name or description for keywords
    const nameAndDescription = `${disasterData.name} ${disasterData.description || ""}`.toLowerCase();
    
    if (nameAndDescription.includes("earthquake") || nameAndDescription.includes("quake") || nameAndDescription.includes("seismic")) {
      // console.log("getDisasterType - Identified as earthquake");
      return "earthquake";
    } else if (nameAndDescription.includes("fire") || nameAndDescription.includes("wildfire") || nameAndDescription.includes("blaze") || nameAndDescription.includes("burning")) {  
      // console.log("getDisasterType - Identified as wildfire");
      return "wildfire";
    }
    
    return "wildfire"; // Default to wildfire
  };

  const getMarkerIcon = () => {
    const disasterType = getDisasterType();
    console.log("getMarkerIcon - Function called");

    console.log("getMarkerIcon - Disaster type determined as:", disasterType);

    let iconPath;
    if (disasterType.includes("earthquake")) {
      iconPath = "/EarthquakePin.png";
      console.log("getMarkerIcon - Using earthquake icon:", iconPath);
    } else {
      iconPath = "/WildfirePin.png";
      console.log("getMarkerIcon - Using wildfire icon:", iconPath);
    }

    // Test if the icon file exists
    const img = new Image();
    img.onload = () => console.log(`getMarkerIcon - Icon successfully loaded: ${iconPath}`);
    img.onerror = () => console.error(`getMarkerIcon - Icon failed to load: ${iconPath}`);
    img.src = iconPath;
    
    return iconPath;
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  const handleScroll = () => {
    if (detailContainerRef.current) {
      setShowScrollTop(detailContainerRef.current.scrollTop > 200);
    }
  };

  const scrollToTop = () => {
    if (detailContainerRef.current) {
      detailContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  //Map Config
  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    overflow: "hidden"
  };

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
                  "lightness": 50
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
  }

  //format the coordinates for display
  const formatCoordinates = (lat:number, long:number) => {
    return `${lat.toFixed(10)}, ${long.toFixed(10)}`;
  }

  //handle marker click
  const handleMarkerClick = () => {
    /*
      Could expand this to show more details or trigger an action
      For now just console logging this
    */
    console.log("Marker Clicked");
  }

  //handle loading scenario on disaster details page
  if (loading) {
    return (
      <div className="disaster-details-loading">
        <PulseLoader color="#ff5733" size={15} />
        <p>Loading disaster information...</p>
      </div>
    );
  }

  //uh oh, error happened
  if (error || !disasterData) {
    return (
      <div className="disaster-details-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleBack} className="back-button">
          Return to Incident List
        </button>
      </div>
    );
  }

  return (
    <div className="disaster-details-container"
        ref={detailContainerRef}
        onScroll={handleScroll}
    >
      <button onClick={handleBack} className="back-button">
        ← Back to Incident List
      </button>
      <header className="details-header">
        <div className="logo-container">
          <img src="/interlinked_logo_white.png" alt="Interlinked Logo" className="logo" />
        </div>
        <div className="header-content">
          <h1>Viewing</h1>
          <h2 className="disaster-name">{disasterData.name}</h2>
          <div className="location-time">
            <h3>{disasterData.location}</h3>
            <p>Time (PST): {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        <img 
          src={disasterData.image || "/AltadenaFire.jpeg"} 
          alt={disasterData.name} 
          className="disaster-thumbnail"
        />
      </header>

      <section className="climate-conditions">
        <h2>Current Climate Conditions:</h2>
        <div className="conditions-grid">
          <div className="condition-card">
            <FontAwesomeIcon icon={faSun} className="condition-icon" />
            <h3>Sunny</h3>
            <p>Temperature: {disasterData.weather_metadata.temperature}°</p>
            <p>H: 90° L: 64°</p>
          </div>
          <div className="condition-card">
            <FontAwesomeIcon icon={faWind} className="condition-icon" />
            <h3>{disasterData.weather_metadata.wind}</h3>
            <p>100 MPH Gusts</p>
          </div>
          <div className="condition-card">
            <FontAwesomeIcon icon={faDroplet} className="condition-icon" />
            <h3>{disasterData.weather_metadata.humidity}</h3>
            <p>23% Humidity</p>
          </div>
          <div className="condition-card warning">
            <FontAwesomeIcon icon={faTriangleExclamation} className="condition-icon" />
            <h3>High Risk of Fire</h3>
          </div>
        </div>
      </section>

      <section className="insights-section">
        <div className="insights-container">
          <h2>Interlinked Insights</h2>
          <div className="insights-content">
            <div className="text-insights">
              <p>This wildfire shows concerning growth patterns based on current wind conditions and low humidity. Recommend evacuation preparations for residential areas within 5 miles of the perimeter.</p>
              <p>Containment efforts should focus on the northern edge where wind patterns are driving expansion.</p>
              <p>Historical data indicates similar fires in this region have required 10-14 days for full containment when weather conditions remain stable.</p>
            </div>
            <div className="metrics-container">
              <div className="metric">
                <FontAwesomeIcon icon={faFireExtinguisher} className="metric-icon" />
                <h4>Containment Status</h4>
                <p>{disasterData.event_metadata.containment || "N/A"}</p>
              </div>
              <div className="metric">
                <FontAwesomeIcon icon={faGauge} className="metric-icon" />
                <h4>Fire Severity 1-10</h4>
                <p className="severity">8</p>
              </div>
            </div>
          </div>
        </div>
        <div className="action-container">
          <div className="metadata-dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              Additional Disaster Details
              <FontAwesomeIcon icon={isDropdownOpen ? faChevronUp : faChevronDown} className="dropdown-icon" />
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faTemperatureHigh} className="dropdown-icon" />
                  <h4>Temperature</h4>
                  <p>{disasterData.weather_metadata.temperature}° (High: 90° Low: 64°)</p>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faWind} className="dropdown-icon" />
                  <h4>Wind Speed</h4>
                  <p>{disasterData.weather_metadata.wind} with 100 MPH Gusts</p>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faDroplet} className="dropdown-icon" />
                  <h4>Humidity</h4>
                  <p>{disasterData.weather_metadata.humidity} (23%)</p>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faFire} className="dropdown-icon" />
                  <h4>Fire Danger Rating</h4>
                  <p>Extreme - High risk of rapid spread</p>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faFireExtinguisher} className="dropdown-icon" />
                  <h4>Containment Status</h4>
                  <p>{disasterData.event_metadata.containment || "N/A"}</p>
                </div>
                <div className="dropdown-item">
                  <FontAwesomeIcon icon={faGauge} className="dropdown-icon" />
                  <h4>Fire Severity</h4>
                  <p>8/10 - Severe with potential for escalation</p>
                </div>
                {disasterData.event_metadata.acres_burned && (
                  <div className="dropdown-item">
                    <FontAwesomeIcon icon={faFire} className="dropdown-icon" />
                    <h4>Acres Burned</h4>
                    <p>{disasterData.event_metadata.acres_burned.toLocaleString()} acres</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="message-chief">Message Chief Fields</button>
        </div>
      </section>

      <section className="map-section">
        <h2>Incident Location</h2>
        <div className="map-info">
          <p>Coordinates: {formatCoordinates(disasterData.coordinates.latitude, disasterData.coordinates.longitude)}</p>
          <p>{disasterData.location}</p>
        </div>
        <div className='map-container'>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: disasterData.coordinates.latitude,
              lng: disasterData.coordinates.longitude
            }}
            zoom={10}
            options={mapOptions}
            onLoad={(map) => {
              console.log("Map loaded successfully!");
              setMapRef(map);
              setMapLoaded(true);
            }}
          >
            {mapLoaded && (
              <OverlayView
                position={{
                  lat: disasterData.coordinates.latitude,
                  lng: disasterData.coordinates.longitude
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                  <Marker
                        position={{
                        lat: disasterData.coordinates.latitude,
                        lng: disasterData.coordinates.longitude
                    }}
                    onClick={handleMarkerClick}
                    icon={{
                      url: getMarkerIcon(),
                      scaledSize: new window.google.maps.Size(60, 50), // Adjust size as needed
                      origin: new window.google.maps.Point(0, 0),
                      anchor: new window.google.maps.Point(30, 50) // Center point of the image (half of size)
                    }}
                  />
                  {/*Make the location Marker work if you want else stick to the Marker implemented above*/}
                  {/* <LocationMarker
                    lat={disasterData.coordinates.latitude}
                    lng={disasterData.coordinates.longitude}
                    onClick={handleMarkerClick}
                    disasterType={getDisasterType()}
                  /> */}
              </OverlayView>
            )}
          </GoogleMap>
        </div>
      </section>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      )}
    </div>
  );
};

export default DisasterDetails; 
