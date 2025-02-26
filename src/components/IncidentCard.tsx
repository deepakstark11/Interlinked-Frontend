import React from "react";
import "../styles/IncidentCard.css";

interface IncidentProps {
    id: number;
    name: string;
    status: string;
    location: string;
    acres: string;
    image: string;
    date?: string; // Optional for resolved incidents
}

const IncidentCard: React.FC<IncidentProps> = ({ id, name, status, location, acres, image, date }) => {
    return (
        <div className={`incident-card ${status.toLowerCase()}`}>
            <h2>Disaster #{id} - {name}</h2>
            <p>Status: <span className={status.toLowerCase()}>{status}</span></p>
            {status === "RESOLVED" && <p>Resolved On: {date}</p>}
            <p>Reinforcements Deployed</p>
            <p>{location}</p>
            <img src={image} alt={name} />
            <p><strong>{acres}~ Acres</strong></p>
            <button>VIEW DETAILS</button>
        </div>
    );
};

export default IncidentCard;
