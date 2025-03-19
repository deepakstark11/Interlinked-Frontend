import React, {useState, useRef, useEffect} from 'react';
import '../styles/DisasterDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faWind, faDroplet, faTriangleExclamation, faFireExtinguisher, faGauge, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { GoogleMap, OverlayView } from "@react-google-maps/api";
import { PulseLoader } from "react-spinners";

interface DisasterDetailsProps {
  disaster: {
    image: string;
    unique_id: string;
    name: string;
    description: string;
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

const LocationMarker = ({lat, long, onClick}: {lat: number, long: number, onClick: () => void}) => {
  return (
    <div className='location-marker' onClick={onClick}>
      <div className='pin-icon'>
        <div className='pin-head'></div>
        <div className='pin-tail'></div>
      </div>
      <div className='pulse'></div>
    </div>
  );
};

const DisasterDetails: React.FC<DisasterDetailsProps> = ({ disaster }) => {
  //state and ref vars for scrolling
  const [showScrollTop, setShowScrollTop] = useState(false);
  const detailContainerRef = useRef<HTMLDivElement>(null);

  //states for map
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  
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
    mapTypeCtrl: false,
    streetViewCtrl: false,
    zoomCtrl: false,
    fullscreenCtrl: false,
    rotateCtrl: false,
    scaleCtrl: false,
    styles: [
      {
        "featureType": "administrative",
        "elementType": "lables.text.fill",
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
  }

  //load map
  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    setMapLoaded(true);
  }

  //format the coordinates for display
  const formatCoordinates = (lat:number, long:number) => {
    return `${lat.toFixed(4)}, ${long.toFixed(4)}`;
  }

  //handle marker click
  const handleMarkerClick = () => {
    /*
      Could expand this to show more details or trigger an action
      For now just console logging this
    */
    console.log("Marker Clicked");
  }

  return (
    <div className="disaster-details-container"
        ref={detailContainerRef}
        onScroll={handleScroll}
    >
      <header className="details-header">
        <div className="logo-container">
          <img src="/interlinkedlogo.jpg" alt="Interlinked Logo" className="logo" />
        </div>
        <div className="header-content">
          <h1>Viewing</h1>
          <h2 className="disaster-name">{disaster.name}</h2>
          <div className="location-time">
            <h3>{disaster.location}</h3>
            <p>Time (PST): {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        <img 
          src={disaster.image || "/default-disaster-image.jpg"} 
          alt={disaster.name} 
          className="disaster-thumbnail"
        />
      </header>

      <section className="climate-conditions">
        <h2>Current Climate Conditions:</h2>
        <div className="conditions-grid">
          <div className="condition-card">
            <FontAwesomeIcon icon={faSun} className="condition-icon" />
            <h3>Sunny</h3>
            <p>Temperature: {disaster.weather_metadata.temperature}°</p>
            <p>H: 90° L: 64°</p>
          </div>
          <div className="condition-card">
            <FontAwesomeIcon icon={faWind} className="condition-icon" />
            <h3>{disaster.weather_metadata.wind}</h3>
            <p>100 MPH Gusts</p>
          </div>
          <div className="condition-card">
            <FontAwesomeIcon icon={faDroplet} className="condition-icon" />
            <h3>{disaster.weather_metadata.humidity}</h3>
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
              {/* Add your AI-generated insights here */}
              <p>Analysis and recommendations would go here...</p>
            </div>
            <div className="metrics-container">
              <div className="metric">
                <FontAwesomeIcon icon={faFireExtinguisher} className="metric-icon" />
                <h4>Containment Status</h4>
                <p>{disaster.event_metadata.containment || "N/A"}</p>
              </div>
              <div className="metric">
                <FontAwesomeIcon icon={faGauge} className="metric-icon" />
                <h4>Fire Severity 1-10</h4>
                <p className="severity">8</p>
              </div>
            </div>
          </div>
        </div>
        <button className="message-chief">Message Chief Fields</button>
      </section>

      <section className="map-section">
        <h2>Incident Location</h2>
        <div className="map-info">
          <p>Coordinates: {formatCoordinates(disaster.coordinates.latitude, disaster.coordinates.longitude)}</p>
          <p>{disaster.location}</p>
        </div>
        <div className='map-container'>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: disaster.coordinates.latitude,
              lng: disaster.coordinates.longitude
            }}
            zoom={12}
            options={mapOptions}
            onLoad={onMapLoad}
          >
            {mapLoaded && (
              <OverlayView
                position={{
                  lat: disaster.coordinates.latitude,
                  lng: disaster.coordinates.longitude
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div className='marker-animation-wrapper'>
                  <LocationMarker
                    lat={disaster.coordinates.latitude}
                    long={disaster.coordinates.longitude}
                    onClick={handleMarkerClick}
                  />
                </div>
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