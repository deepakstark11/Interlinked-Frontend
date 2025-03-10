import React, {useState, useEffect, useRef} from 'react';
import DisasterCard from './DisasterCard';
import '../styles/IncidentList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faChevronUp, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

//Structure for how and what the disaster cards would have 
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
  resolvedDate?: string;
  event_metadata: Record<string, any>;
  weather_metadata: Record<string, any>;
  insights: Record<string, any>;
  ewm_number: number;
  status?: string;
  image?: string;
}

const EWM_Categories: { [ key : number ]: string} = {
  0: "Wildfires",
  1: "Hurricanes",
  2: "Earthquakes",
  3: "Tornadoes",
  4: "Tsunamis",
  5: "Extreme Lightning/Thunderstorms",
  6: "Avalanches",
  7: "Landslides",
  8: "Droughts",
  9: "Volcanic Eruptions",
  10: "Oil Spills",
  11: "Flood (Long Term)",
  12: "Flash Floods (Short Term)",
  13: "Glacier Melting",
  14: "Ice Jams/Frozen Regions",
  15: "Air Quality & Pollution",
  16: "Chemical Spills/Radiation Leaks",
  17: "Geomagnetic Storms/Solar Flares",
  18: "Extreme Heat Events",
  19: "Extreme Cold Events",
  20: "Severe Weather Events",
  21: "Marine Events",
  22: "Long Term Events"
}

const disasterData: DisasterEvent[] = [
  {
    unique_id: "WF-2024-542",
    name: "Altadena Fire",
    description: "Major Wildfire Affecting the Altadena region",
    category: "Wildfire",
    date_of_occurrence: "2024-06-15T14:30:00Z",
    location: "CA-2 Palmdale, CA 93550",
    coordinates: {
      latitude: 32.587010,
      longitude: -118.127794
    },
    source: "California Department of Forestry and Fire Protection",
    event_metadata: {acres_burned: 14117, containment: "70%"},
    weather_metadata: {temperature: 98, humidity: "15%", wind: "25mph"},
    insights: {risk_level: "high", evacuation_zones: ["Zone A", "Zone B"]},
    ewm_number: 0,
    status: "ONGOING",
    image: "/AltadenaFire.jpeg"
  },
  {
    unique_id: "EQ-2024-539",
    name: "Chatsworth Earthquake",
    description: "5.2 magnitude earthquake centered in Chatsworth",
    category: "Earthquake",
    date_of_occurrence: "2024-06-18T08:15:00Z",
    location: "Chatsworth, CA 91311",
    coordinates: {
      latitude: 34.254070,
      longitude: -118.594093
    },
    source: "USGS",
    event_metadata: {magnitude: 5.2, depth: "8km"},
    weather_metadata: {},
    insights: {aftershock_probability: "60%", damage_assessment: "moderate"},
    ewm_number: 2,
    status: "RESOLVED",
    image: "/ChatsworthEarthquake.jpeg"
  },
  {
    unique_id: "WF-2024-541",
    name: "San Gabriel Fire",
    description: "Major Wildfire affecting the IRWINDALE Area",
    category: "Wildfire",
    date_of_occurrence: "2016-06-20T00:00:00Z",
    location: "Irwindale, CA 91702",
    coordinates: {
      latitude: 30.168,
      longitude: -115.9
    },
    source: "National Weather Service",
    event_metadata: { acres_burned: 5399, containment: "100%" },
    weather_metadata: {temperature: 98, humidity: "15%", wind: "23mph"},
    insights: {risk_level: "high", evacuation_zones: ["Zone A", "Zone B"]},
    ewm_number: 0,
    status: "RESOLVED",
    image: "/SanGabrielFire.jpeg"
  },
  {
    unique_id: "WF-2024-540",
    name: "Topanga Fire",
    description: "Major Wildfire affecting the Topanga Area",
    category: "Wildfire",
    date_of_occurrence: "2024-06-06T00:00:00Z",
    location: "20828 Entrada Rd, Topanga, CA 90290",
    coordinates: {
      latitude: 34.099800,
      longitude: -118.595848
    },
    source: "National Weather Service",
    event_metadata: { acres_burned: 16532, containment: "100%" },
    weather_metadata: {temperature: 102, humidity: "22%", wind: "23mph"},
    insights: {risk_level: "high", evacuation_zones: ["Zone A", "Zone B"]},
    ewm_number: 0,
    status: "RESOLVED",
    image: "/TopangaFire.jpeg"
  }
]

const IncidentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCoordinates, setSearchCoordinates] = useState<{ latitude: number | null, longitude: number | null }>({
    latitude: null,
    longitude: null
  });
  const [selectedEwmNumber, setSelectedEwmNumber] = useState<number | null>(null);
  const [filteredDisasters, setFilteredDisasters] = useState<DisasterEvent[]>(disasterData);
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Parse coordinates from search term if possible
  const parseCoordinates = (input: string) => {
    // Check for coordinate pattern like "34.1678,-118.1309"
    const coordinatePattern = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    const match = input.match(coordinatePattern);

    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[3])
      };
    }
    return { latitude: null, longitude: null };
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // If we're within 1 degree of latitude and longitude, consider it a match
    return Math.abs(lat1 - lat2) <= 2 && Math.abs(lon1 - lon2) <= 2;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    const coords = parseCoordinates(value);
    setSearchCoordinates(coords);
  };

  const handleCategorySelect = (ewmNumber: number | null) => {
    setSelectedEwmNumber(ewmNumber);
  };

  useEffect(() => {
    let results = disasterData;

    if (selectedEwmNumber !== null) {
      results = results.filter(disaster => disaster.ewm_number === selectedEwmNumber);
    }

    // Then filter by location or coordinates
    if (searchTerm) {
      if (searchCoordinates.latitude !== null && searchCoordinates.longitude !== null) {
        // Filter by coordinates
        results = results.filter(disaster => 
          calculateDistance(
            searchCoordinates.latitude!, 
            searchCoordinates.longitude!, 
            disaster.coordinates.latitude, 
            disaster.coordinates.longitude
          )
        );
      } else {
        // Filter by location name or title
        const searchTermLower = searchTerm.toLowerCase();
        results = results.filter(disaster => 
          disaster.location.toLowerCase().includes(searchTermLower) || 
          disaster.name.toLowerCase().includes(searchTermLower) ||
          disaster.description.toLowerCase().includes(searchTermLower)
        );
      }
    }

    setFilteredDisasters(results);
  }, [searchTerm, searchCoordinates, selectedEwmNumber]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowScrollTop(scrollContainerRef.current.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Get unique EWM categories present in our data for filtering options
  const availableCategories = Array.from(new Set(disasterData.map(disaster => disaster.ewm_number)));

  //Following diff code segments to take in the city name
  const [currentLocation, setCurrentLocation] = useState("LOS ANGELES");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const locationInputRef = useRef<HTMLInputElement>(null);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
  };

  const startEditingLocation = () => {
    setLocationInput(currentLocation);
    setIsEditingLocation(true);
    // Focus the input after it renders
    setTimeout(() => {
      if (locationInputRef.current) {
        locationInputRef.current.focus();
      }
    }, 10);
  };

  const confirmLocationChange = () => {
    if (locationInput.trim()) {
      setCurrentLocation(locationInput.trim().toUpperCase());
    }
    setIsEditingLocation(false);
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      confirmLocationChange();
    } else if (e.key === 'Escape') {
      setIsEditingLocation(false);
    }
  };

  return (
    <div className="incident-container">
      <div className="search-container">
        <div className="search-input-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by location, coordinates (e.g., 34.1678,-118.1309) or category of disaster"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
            name="Filter by disaster type"
          >
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>

        {showFilters && (
          <div className="category-filters">
            <button
              className={`category-button ${selectedEwmNumber === null ? 'active' : ''}`}
              onClick={() => handleCategorySelect(null)}
            >
              All Events
            </button>
            {availableCategories.map(ewmNumber => (
              <button
                key={ewmNumber}
                className={`category-button ${selectedEwmNumber === ewmNumber ? 'active' : ''}`}
                onClick={() => handleCategorySelect(ewmNumber)}
              >
                {EWM_Categories[ewmNumber as keyof typeof EWM_Categories]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div 
        className="incident-list-container" 
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {filteredDisasters.length > 0 ? (
          <div className="incident-list">
            {filteredDisasters.map((disaster) => (
              <DisasterCard 
                key={disaster.unique_id} 
                unique_id={disaster.unique_id}
                name={disaster.name}
                status={disaster.status || "UNKNOWN"}
                description={disaster.description}
                location={disaster.location}
                image={disaster.image || `/default-${(EWM_Categories[disaster.ewm_number] || "unknown").toLowerCase().replace(/\s+/g, '-')}.jpeg`}
                category={EWM_Categories[disaster.ewm_number] || `Unknown (${disaster.ewm_number})`}
                ewm_number = {disaster.ewm_number}
                start_date={disaster.date_of_occurrence}
                coordinates={disaster.coordinates}
                source={disaster.source}
                event_metadata={disaster.event_metadata}
                weather_metadata={disaster.weather_metadata}
                insights={disaster.insights}
                resolvedDate={disaster.status === "RESOLVED" ? "June 6th, 2024" : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="no-events-message">
            <h3>No new events</h3>
            <p>There are no events matching your search criteria.</p>
          </div>
        )}
      </div>
      
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

export default IncidentList;