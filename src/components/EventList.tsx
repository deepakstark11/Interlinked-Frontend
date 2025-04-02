import React, { useState, useEffect } from 'react';
import fetchEvents from '../api/fetchEvents';
import '../styles/EventList.css';

// Define the disaster type mapping
const DISASTER_TYPES: { [key: number]: string } = {
  0: "Wildfire",
  1: "Hurricane",
  2: "Earthquake",
  3: "Tornado",
  4: "Tsunami",
  5: "Extreme Lightning/Thunderstorm",
  6: "Avalanche",
  7: "Landslide",
  8: "Drought",
  9: "Volcanic Eruption",
  10: "Oil Spill",
  11: "Flood",
  12: "Flash Flood",
  13: "Glacier Melting",
  14: "Ice Jam/Frozen Region",
  15: "Air Quality & Pollution",
  16: "Chemical Spill/Radiation Leak",
  17: "Geomagnetic Storm/Solar Flare",
  18: "Extreme Heat Event",
  19: "Extreme Cold Event",
  20: "Severe Weather Event",
  21: "Marine Event",
  22: "Long Term Event"
};

const EventList: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        // Fetch all events with no date filter
        const allEvents = await fetchEvents();
        console.log('All events:', allEvents);
        setEvents(allEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load disaster events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Filter events by selected type
  const filteredEvents = selectedType !== null
    ? events.filter(event => event.ewm_number === selectedType)
    : events;

  // Count events by type
  const eventCounts: Record<number, number> = {};
  events.forEach(event => {
    const type = event.ewm_number;
    eventCounts[type] = (eventCounts[type] || 0) + 1;
  });

  return (
    <div className="event-list-container">
      <h1>All Disaster Events</h1>
      
      {loading ? (
        <div className="loading">Loading events...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="event-stats">
            <p>Total events: {events.length}</p>
            <div className="event-type-counts">
              <h3>Events by type:</h3>
              <ul>
                {Object.entries(eventCounts).map(([type, count]) => (
                  <li key={type}>
                    {DISASTER_TYPES[parseInt(type)] || `Type ${type}`}: {count} events
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="filter-controls">
            <label>
              Filter by type:
              <select 
                value={selectedType === null ? '' : selectedType} 
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedType(value === '' ? null : parseInt(value));
                }}
              >
                <option value="">All Types</option>
                {Object.entries(DISASTER_TYPES).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="event-list">
            <h2>Showing {filteredEvents.length} events</h2>
            {filteredEvents.map((event, index) => (
              <div 
                key={event.unique_id || index} 
                className="event-card"
                data-type={event.ewm_number}
              >
                <h3>{event.name}</h3>
                <div className="event-info">
                  <p><strong>ID:</strong> {event.unique_id}</p>
                  <p><strong>Type:</strong> {DISASTER_TYPES[event.ewm_number] || 'Unknown'} (Code: {event.ewm_number})</p>
                  <p><strong>Category:</strong> {event.category}</p>
                  <p><strong>Date:</strong> {event.date_of_occurrence}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Coordinates:</strong> {event.coordinates?.latitude.toFixed(4)}, {event.coordinates?.longitude.toFixed(4)}</p>
                  <div className="event-description">
                    <p><strong>Description:</strong></p>
                    <p>{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventList; 