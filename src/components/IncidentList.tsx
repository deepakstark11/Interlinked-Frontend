import React from 'react';
import DisasterCard from './DisasterCard';
import '../styles/IncidentList.css';

const disasterData = [
  {
    id: 542,
    name: "Altadena Fire",
    status: "ONGOING",
    location: "CA-2 Palmdale, CA 93550",
    acres: 13543,
    image: "/AltadenaFire.jpeg"
  },
  {
    id: 541,
    name: "San Gabriel Fire",
    status: "ONGOING",
    location: "Irwindale, CA 91702",
    acres: 21324,
    image: "/SanGabrielFire.jpeg"
  },
  {
    id: 540,
    name: "Topanga Fire",
    status: "RESOLVED",
    resolvedDate: "June 6th, 2024",
    location: "20828 Entrada Rd, Topanga, CA 90290",
    acres: 16532,
    image: "/TopangaFire.jpeg"
  }
];

const IncidentList: React.FC = () => {
  return (
    <div className="incident-list">
      {disasterData.map((disaster) => (
        <DisasterCard key={disaster.id} {...disaster} />
      ))}
    </div>
  );
};

export default IncidentList;
