import React from "react";
import IncidentCard from "./IncidentCard";
import "../styles/IncidentList.css";

const incidents = [
    {
        id: 542,
        name: "Altadena Fire",
        status: "ONGOING",
        location: "CA-2 Palmdale, CA 93550",
        acres: "13,543",
        image: "/altadena.png"
    },
    {
        id: 541,
        name: "San Gabriel Fire",
        status: "ONGOING",
        location: "Irwindale, CA 91702",
        acres: "21,324",
        image: "/sangabriel.png"
    },
    {
        id: 540,
        name: "Topanga Fire",
        status: "RESOLVED",
        date: "June 6th, 2024",
        location: "20828 Entrada Rd, Topanga, CA 90290",
        acres: "16,532",
        image: "/topanga.png"
    }
];

const IncidentList: React.FC = () => {
    return (
        <div className="incident-list">
            {incidents.map((incident) => (
                <IncidentCard key={incident.id} {...incident} />
            ))}
        </div>
    );
};

export default IncidentList;
