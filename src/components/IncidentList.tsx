import React, {useState, useEffect, useRef, useContext} from 'react';
import DisasterCard from './DisasterCard';
import '../styles/IncidentList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faChevronUp, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from './AuthContext';
import fetchEvents from '../api/fetchEvents';

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

const TIME_FILTERS = [
  { label: "All Time", value: "all" },
  { label: "Last 24 Hours", value: "day" },
  { label: "Last Week", value: "week" },
  { label: "Last Month", value: "month" },
  { label: "Last Year", value: "year" }
];

// const disasterData: DisasterEvent[] = [
//   {
//     unique_id: "WF-2024-542",
//     name: "Altadena Fire",
//     description: "Major Wildfire Affecting the Altadena region",
//     category: "Wildfire",
//     date_of_occurrence: "2024-06-15T14:30:00Z",
//     location: "CA-2 Palmdale, CA 93550",
//     coordinates: {
//       latitude: 32.587010,
//       longitude: -118.127794
//     },
//     source: "California Department of Forestry and Fire Protection",
//     event_metadata: {acres_burned: 14117, containment: "70%"},
//     weather_metadata: {temperature: 98, humidity: "15%", wind: "25mph"},
//     insights: {risk_level: "high", evacuation_zones: ["Zone A", "Zone B"]},
//     ewm_number: 0,
//     status: "ONGOING",
//     image: "/AltadenaFire.jpeg"
//   },
//   {
//     unique_id: "EQ-2024-539",
//     name: "Chatsworth Earthquake",
//     description: "5.2 magnitude earthquake centered in Chatsworth that happened last month hypothetically",
//     category: "Earthquake",
//     date_of_occurrence: "2025-02-20T08:15:00Z",
//     location: "Chatsworth, CA 91311",
//     coordinates: {
//       latitude: 34.254070,
//       longitude: -118.594093
//     },
//     source: "USGS",
//     event_metadata: {magnitude: 5.2, depth: "8km"},
//     weather_metadata: {},
//     insights: {aftershock_probability: "60%", damage_assessment: "moderate"},
//     ewm_number: 2,
//     status: "RESOLVED",
//     image: "/ChatsworthEarthquake.jpeg"
//   },
//   {
//     unique_id: "WF-2024-541",
//     name: "San Gabriel Fire",
//     description: "Major Wildfire affecting the IRWINDALE Area",
//     category: "Wildfire",
//     date_of_occurrence: "2016-06-20T00:00:00Z",
//     location: "Irwindale, CA 91702",
//     coordinates: {
//       latitude: 30.168,
//       longitude: -115.9
//     },
//     source: "National Weather Service",
//     event_metadata: { acres_burned: 5399, containment: "100%" },
//     weather_metadata: {temperature: 98, humidity: "15%", wind: "23mph"},
//     insights: {risk_level: "high", evacuation_zones: ["Zone A", "Zone B"]},
//     ewm_number: 0,
//     status: "RESOLVED",
//     image: "/SanGabrielFire.jpeg"
//   },
//   {
//     unique_id: "WF-2024-540",
//     name: "Topanga Fire",
//     description: "Major Wildfire affecting the Topanga Area",
//     category: "Wildfire",
//     date_of_occurrence: "2024-06-06T00:00:00Z",
//     location: "20828 Entrada Rd, Topanga, CA 90290",
//     coordinates: {
//       latitude: 34.099800,
//       longitude: -118.595848
//     },
//     source: "National Weather Service",
//     event_metadata: { acres_burned: 16532, containment: "100%" },
//     weather_metadata: {temperature: 102, humidity: "22%", wind: "23mph"},
//     insights: {risk_level: "high", evacuation_zones: ["Zone A", "Zone B"]},
//     ewm_number: 0,
//     status: "RESOLVED",
//     image: "/TopangaFire.jpeg"
//   },
//   {
//     unique_id: "WF-2024-543",
//     name: "Long Beach Tsunami",
//     description: "Hypothetical Tsunami in the Long Beach Area",
//     category: "Tsunami",
//     date_of_occurrence: "2025-03-10T00:00:00Z",
//     location: "5415 East Ocean Blvd. Long Beach, CA 90803",
//     coordinates: {
//       latitude: 33.7701,
//       longitude: -118.1937
//     },
//     source: "National Weather Service",
//     event_metadata: { Magnitude: 7.2, wave_height: "127.52ft" },
//     weather_metadata: {temperature: 69, humidity: "20%", wind: "36mph"},
//     insights: {risk_level: "high", evacuation_zones: ["Zone C", "Zone D"]},
//     ewm_number: 4,
//     status: "ONGOING",
//     image: "/LongBeachTsunami.jpeg"
//   }
// ]

// Mock function to get city name from coordinates
const getCityFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  // In a real app, this would call a geocoding API
  // For now, we'll simulate with a mock response
  console.log(`Getting city name for coordinates: ${lat}, ${lng}`);
  
  // Mock response based on coordinate ranges
  if (lat > 34 && lng < -118) return "LOS ANGELES";
  if (lat > 30 && lat < 33) return "SAN DIEGO";
  return "UNKNOWN LOCATION";
};

const IncidentList: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [currentLocation, setCurrentLocation] = useState("LOADING...");
  const [disasterData, setDisasterData] = useState<DisasterEvent[]>([]);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [userCoordinates, setUserCoordinates] = useState<{latitude: number | null, longitude: number | null}>({
    latitude: null,
    longitude: null
  });

  const [isLoading, setIsLoading] = useState(true);

  //Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCoordinates, setSearchCoordinates] = useState<{ latitude: number | null, longitude: number | null }>({
    latitude: null,
    longitude: null
  });
  const [isSearchingByCoordinates, setIsSearchingByCoordinates] = useState(false);
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");
  const [selectedEwmNumber, setSelectedEwmNumber] = useState<number | null>(null);
  const [filteredDisasters, setFilteredDisasters] = useState<DisasterEvent[]>(disasterData);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showTimeFilters, setShowTimeFilters] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  //Refs
  const locationInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get user's current location on initial load
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserCoordinates({ latitude, longitude });
            
            // Get city name from coordinates
            try {
              const cityName = await getCityFromCoordinates(latitude, longitude);
              setCurrentLocation(cityName);
              
              // Initial filter by user's location
              filterDisastersByLocation(latitude, longitude, disasterData);
            } catch (error) {
              console.error("Error getting location name:", error);
              setCurrentLocation("LOS ANGELES"); // Fallback
            }
          },
          (error) => {
            console.error("Error getting user location:", error);
            setCurrentLocation("LOS ANGELES"); // Fallback
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        setCurrentLocation("LOS ANGELES"); // Fallback
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // default: get all data (0 => no date cutoff)
        const events = await fetchEvents(0);
        setDisasterData(events);
        setFilteredDisasters(events);
        if (userCoordinates.latitude !== null && userCoordinates.longitude !== null) {
          filterDisastersByLocation(userCoordinates.latitude, userCoordinates.longitude, events);
        }

      } catch (error) {
        console.error("Error fetching disaster events:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [userCoordinates]);

  // Initial filter by user's location
  const filterDisastersByLocation = (
    latitude: number,
    longitude: number,
    dataSource: DisasterEvent[]
  ) => {
    const results = dataSource.filter(disaster =>
      calculateDistance(
        latitude,
        longitude,
        disaster.coordinates.latitude,
        disaster.coordinates.longitude
      )
    );
    setFilteredDisasters(results.length > 0 ? results : dataSource);
  };

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

  // Calculate if coordinates match
  const coordinatesMatch = (disaster: DisasterEvent, lat: string, lng: string) => {
    if (!lat && !lng) return true;

    const disasterLat = disaster.coordinates.latitude;
    const disasterLng = disaster.coordinates.longitude;

    // If only latitude is provided
    if (lat && !lng) {
      const userLat = parseFloat(lat);
      if (isNaN(userLat)) return true;
      return Math.abs(disasterLat - userLat) <= 2;
    }

    // If only longitude is provided
    if (!lat && lng) {
      const userLng = parseFloat(lng);
      if (isNaN(userLng)) return true;
      return Math.abs(disasterLng - userLng) <= 2;
    }

    // If both are provided
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    if (isNaN(userLat) || isNaN(userLng)) return true;
    
    return calculateDistance(disasterLat, disasterLng, userLat, userLng)
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

  const handleTimeFilterSelect = (timeFilter: string) => {
    setSelectedTimeFilter(timeFilter);
  };

  // Handle filter toggles
  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (!showFilters) setShowTimeFilters(false);
  };

  const toggleTimeFilters = () => {
    setShowTimeFilters(!showTimeFilters);
    if (!showTimeFilters) setShowFilters(false);
  };

  const toggleLocationSearch = (isCoordinates: boolean) => {
    setIsSearchingByCoordinates(isCoordinates);
    setShowLocationSearch(true);
    
    // Clear the appropriate inputs when switching
    if (isCoordinates) {
      setSearchTerm("");
    } else {
      setLatitudeInput("");
      setLongitudeInput("");
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setLatitudeInput("");
    setLongitudeInput("");
    setSearchCoordinates({ latitude: null, longitude: null });
    setSelectedTimeFilter("all");
    setSelectedEwmNumber(null);
    setShowLocationSearch(false);
    setIsSearchingByCoordinates(false);
  };


  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowScrollTop(scrollContainerRef.current.scrollTop > 300);
    }
  };

  // Get unique EWM categories present in our data for filtering options
  const availableCategories = Array.from(new Set(disasterData.map(disaster => disaster.ewm_number)));

  //Following diff code segments to take in the city name
  // const [currentLocation, setCurrentLocation] = useState("LOS ANGELES");
  // const [isEditingLocation, setIsEditingLocation] = useState(false);
  // const [locationInput, setLocationInput] = useState("");

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

      //Update Search to filter by the new location
      setSearchTerm(locationInput.trim().toUpperCase());
      setSearchCoordinates({latitude: null, longitude: null})
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

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    const coords = parseCoordinates(value);
    setSearchCoordinates(coords);
  };
  
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatitudeInput(e.target.value);
  };
  
  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongitudeInput(e.target.value);
  };

  // Apply filters effect
  useEffect(() => {
    let results = disasterData;

    // Step 1: Filter by category (ewm_number) if selected
    if (selectedEwmNumber !== null) {
      results = results.filter(disaster => disaster.ewm_number === selectedEwmNumber);
    }

    // Step 2: Apply location/coordinate based on search choice
    if (showLocationSearch) {
      if (isSearchingByCoordinates) {
        // Filter by coordinates
        results = results.filter(disaster => 
          coordinatesMatch(
            disaster, 
            latitudeInput, 
            longitudeInput
          )
        );
        
        // Update location name if coordinates are valid
        if ((latitudeInput || longitudeInput) && results.length > 0) {
          const lat = parseFloat(latitudeInput);
          const long = parseFloat(longitudeInput);

          if (!isNaN(lat) || !isNaN(long)) {
            getCityFromCoordinates(isNaN(lat) ? 0 : lat, isNaN(long) ? 0 : long)
            .then(cityName => setCurrentLocation(cityName))
            .catch(err => console.error("Error getting city name:", err));
          }
        }
        
      } else if (searchTerm) {
        // Filter by location name or title
        const searchTermLower = searchTerm.toLowerCase();
        results = results.filter(disaster => 
          disaster.location.toLowerCase().includes(searchTermLower) || 
          disaster.name.toLowerCase().includes(searchTermLower) ||
          disaster.description.toLowerCase().includes(searchTermLower)
        );
        
        // If filtered by location text, update the location header
        if (results.length > 0) {
          const locationParts = results[0].location.split(',');
          if (locationParts.length > 0) {
            const cityOrArea = locationParts[0].includes("CA-") 
              ? locationParts[1]?.trim() || locationParts[0].trim()
              : locationParts[0].trim();
            setCurrentLocation(cityOrArea.toUpperCase());
          }
        }
      }
    }

    // Step 3: Apply time filter if selected
    if (selectedTimeFilter !== "all") {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch(selectedTimeFilter) {
        case "day":
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      results = results.filter(disaster => {
        const eventDate = new Date(disaster.date_of_occurrence);
        return eventDate >= cutoffDate;
      });
    }

    setFilteredDisasters(results);
  }, [searchTerm, latitudeInput, longitudeInput, isSearchingByCoordinates, showLocationSearch, selectedEwmNumber, selectedTimeFilter]);

  return (
    <div className="incident-container">
      {/* <div className="location-header">
          <h1>LOCATION: {currentLocation}</h1>
      </div> */}
      
      {/* Search and Filters */}
      <div className="search-container">
        {/* Main Search Bar */}
        <div className="main-search-container">
          <div className="search-input-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by location"
              value={searchTerm}
              onChange={handleSearchTermChange}
              disabled={isSearchingByCoordinates}
              className="search-input"
            />
            <div className="filter-icons">
              <button 
                className={`filter-icon-button ${showTimeFilters ? 'active' : ''}`}
                onClick={toggleTimeFilters}
                title="Filter by time"
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
              </button>
              <button 
                className={`filter-icon-button ${showFilters ? 'active' : ''}`}
                onClick={toggleFilters}
                title="Filter by category"
              >
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
            <div className="search-type-toggle">
              <button 
                className={`search-type-button ${!isSearchingByCoordinates && showLocationSearch ? 'active' : ''}`}
                onClick={() => toggleLocationSearch(false)}
                disabled={!isSearchingByCoordinates && showLocationSearch}
              >
                Location
              </button>
              <button 
                className={`search-type-button ${isSearchingByCoordinates ? 'active' : ''}`}
                onClick={() => toggleLocationSearch(true)}
                disabled={isSearchingByCoordinates}
              >
                Coordinates
              </button>
            </div>
          </div>

          {/* Coordinate Search Inputs */}
          {showLocationSearch && isSearchingByCoordinates && (
            <div className="coordinates-container">
              <div className="coordinate-input-group">
                <label>Latitude:</label>
                <input
                  type="text"
                  placeholder="e.g., 34.1678"
                  value={latitudeInput}
                  onChange={handleLatitudeChange}
                  className="coordinate-input"
                />
              </div>
              <div className="coordinate-input-group">
                <label>Longitude:</label>
                <input
                  type="text"
                  placeholder="e.g., -118.1309"
                  value={longitudeInput}
                  onChange={handleLongitudeChange}
                  className="coordinate-input"
                />
              </div>
            </div>
          )}
        </div>

        {/* Time Filter Dropdown */}
        {showTimeFilters && (
          <div className="time-filters">
            {TIME_FILTERS.map(filter => (
              <button 
                key={filter.value}
                className={`time-filter-button ${selectedTimeFilter === filter.value ? 'active' : ''}`}
                onClick={() => handleTimeFilterSelect(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Category Filters */}
        {showFilters && (
          <div className="category-filters">
            <button
              className={`category-button ${selectedEwmNumber === null ? 'active' : ''}`}
              onClick={() => handleCategorySelect(null)}
            >
              All Categories
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

        {/* Clear Filters button - shown if any filter is active */}
        {(selectedEwmNumber !== null || selectedTimeFilter !== "all" || searchTerm || latitudeInput || longitudeInput) && (
          <button className="clear-filters-button" onClick={clearFilters}>
            Clear All Filters
          </button>
        )}
      </div>

      {/* Incident List */}
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
                ewm_number={disaster.ewm_number}
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

export default IncidentList;