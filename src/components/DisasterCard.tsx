import React from 'react';
import '../styles/DisasterCard.css';

interface DisasterCardProps {
  id: number;
  name: string;
  status: string;
  resolvedDate?: string;
  location: string;
  acres: number;
  image: string;
}

const DisasterCard: React.FC<DisasterCardProps> = ({ id, name, status, resolvedDate, location, image }) => {
  return (
    <div className="disaster-card">
      <div className="disaster-info">
        <h2>Disaster #{id} - {name}</h2>
        <p className={status === 'ONGOING' ? 'status ongoing' : 'status resolved'}>
          Status: {status} {status === 'RESOLVED' && ` - ${resolvedDate}`}
        </p>
        <p><strong>Reinforcements Deployed</strong></p>
        <p>{location}</p>
        <button className="view-details">VIEW DETAILS</button>
      </div>
      <img src={image} alt={`${name}`} className="disaster-image" />
    
    </div>
  );
};

export default DisasterCard;
