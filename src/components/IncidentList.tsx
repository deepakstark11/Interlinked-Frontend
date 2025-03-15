import React, { useEffect, useState } from "react";
import DisasterCard from "./DisasterCard";
import fetchEvents from "../api/fetchEvents";
import "../styles/IncidentList.css";

interface Event {
  id: string;
  title: string;
  status: string;
  date: string; // YYYY-MM-DD format
  location: string;
  magnitude?: string;
}

const IncidentList: React.FC = () => {
  const [disasters, setDisasters] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const allEvents = await fetchEvents();
        setDisasters(allEvents);
      } catch (err) {
        setError("Failed to fetch events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  return (
    <div className="incident-list">
      <h2>Recent Earthquake Incidents</h2>

      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {disasters.length === 0 && !loading ? (
        <p>No recent earthquake events in the past 7 days.</p>
      ) : (
        disasters.map((disaster) => (
          <DisasterCard key={disaster.id} {...disaster} />
        ))
      )}
    </div>
  );
};

export default IncidentList;