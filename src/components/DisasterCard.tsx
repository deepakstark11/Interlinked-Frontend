import React from 'react';
import '../styles/DisasterCard.css';

interface DisasterCardProps {
  unique_id: string;
  name: string;
  description: string;
  category: string;
  start_date: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }
  source: string;
  resolvedDate?: string;
  event_metadata: Record<string, any>;
  weather_metadata: Record<string, any>;
  insights: Record<string, any>;
  // ewm_number: number;
  status: string;
  image: string;
}

const DisasterCard: React.FC<DisasterCardProps> = ({ 
  unique_id, 
  name, 
  status, 
  resolvedDate, 
  description,
  location, 
  image,
  category,
  // ewm_number,
  start_date,
  coordinates 
}) => {

  //start_date formatting:
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return (
    <div className="disaster-card">
      <div className="disaster-info">
        <div className="disaster-header">
          <span className="event-id">{unique_id}</span>
          <span className={status == 'ONGOING' ? 'status ongoing' : 'status resolved'}>
            {status}
          </span>
        </div>
        <h2>{name}</h2>
        <p className='disaster-description'>
          {description}
        </p>
        <div className='disaster-details'>
          <div className='detail-item'>
            <span className='detail-label'>Category:</span>
            <span className='detail-value'>{category}:</span>
          </div>
          <div className='detail-item'>
            <span className='detail-label'>Start Date:</span>
            <span className='detail-value'>{formatDate(start_date)}:</span>
          </div>
          <div className='detail-item'>
            <span className='detail-label'>Location:</span>
            <span className='detail-value'>{location}:</span>
          </div>
          <div className='detail-item'>
            <span className='detail-label'>Coordinates:</span>
            <span className='detail-value'>{coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}</span>
          </div>
          {status == 'RESOLVED' && resolvedDate && (
            <div className='detail-item'>
              <span className='detail-label'>Resolved On:</span>
              <span className='detail-value'>{resolvedDate}</span>
            </div>
          )}
        </div>
        <button className='view-details'>VIEW DETAILS</button>
      </div>
      <img src={image} alt={`${name}`} className="disaster-image" />
    </div>
  );
};

export default DisasterCard;
