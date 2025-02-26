import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTachometerAlt,
    faFire,
    faMapMarkedAlt,
    faUserShield,
    faBell,
    faEnvelope,
    faTruck,
    faExclamationTriangle,
    faBars
} from "@fortawesome/free-solid-svg-icons";
import SidebarItem from "./SidebarItem";  // Import the new component
import "../styles/Sidebar.css";

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);

    // Function to handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`sidenav ${isCollapsed ? "sidenav-collapsed" : ""}`}>
            <div className="logo-container">
                <button className="logo" onClick={() => setIsCollapsed(!isCollapsed)}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                {!isCollapsed && <span className="logo-text">interlinked.</span>}
            </div>

            <ul className="sidenav-nav">
                <SidebarItem icon={faTachometerAlt} text="Dashboard" isCollapsed={isCollapsed} />
                <SidebarItem icon={faFire} text="Recent Incidents" isCollapsed={isCollapsed} />
                <SidebarItem icon={faUserShield} text="Active Duty Deployed" isCollapsed={isCollapsed} />
                <SidebarItem icon={faMapMarkedAlt} text="District Map" isCollapsed={isCollapsed} />
                <SidebarItem icon={faExclamationTriangle} text="Probability & Risk" isCollapsed={isCollapsed} />
                <SidebarItem icon={faBell} text="Announcements" isCollapsed={isCollapsed} />
                <SidebarItem icon={faEnvelope} text="Messages" isCollapsed={isCollapsed} />
                <SidebarItem icon={faTruck} text="Active Engines" isCollapsed={isCollapsed} />
                <SidebarItem icon={faExclamationTriangle} text="Report Bug" isCollapsed={isCollapsed} />
            </ul>
        </div>
    );
};

export default Sidebar;
