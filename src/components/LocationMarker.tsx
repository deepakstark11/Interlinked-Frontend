import { Icon } from "@iconify/react";
import locationIcon from "@iconify/icons-mdi/fire-alert";

interface LocationMarkerProps {
  lat: number;
  lng: number;
  onClick: () => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ onClick }) => {
  return (
    <div
      className="location-marker"
      onClick={onClick}
      style={{
        transform: "translate(-50%, -50%)",
        position: "absolute",
        cursor: "pointer",
      }}
    >
      <Icon icon={locationIcon} className="location-icon" width={30} height={30} />
    </div>
  );
};

export default LocationMarker;
