import React from 'react';
import '../styles/DisasterCard.css';

/* Modified here because of the database format
 * can change back in the future
 */
// interface DisasterCardProps {
//   id: number;
//   name: string;
//   status: string;
//   resolvedDate?: string;
//   location: string;
//   acres: number;
//   image: string;
// }

interface DisasterCardProps {
  id: string;
  title: string; 
  status: string;
  date: string; 
  location: string;
  magnitude?: string; 
}

/* To make sure the disaster now can fit the files in database, I changed the format of the diaster card
 * Can be changed in the future to add more details (such as description and image)
 */


const DisasterCard: React.FC<DisasterCardProps> = ({ id, title, status, date, location, magnitude }) => {
  return (
    <div className="disaster-card">
      <div className="disaster-info">
        <h2>{title}</h2>
        <p className={status === "ongoing" ? "status ongoing" : "status resolved"}>
          Status: {status}
        </p>
        <p><strong>Magnitude:</strong> {magnitude || "N/A"}</p>
        <p><strong>Date:</strong> {date.substring(0, 10)}</p> 
        <p><strong>Location:</strong> {location}</p>
        <button className="view-details">VIEW DETAILS</button>
      </div>
    </div>
  );
};
export default DisasterCard;
