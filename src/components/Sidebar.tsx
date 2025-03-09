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
    faBars,
    faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import { Route, Routes } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import FireMap from "./FireMap";
import "../styles/Sidebar.css";

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth <= 768) {
                setIsCollapsed(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`sidenav ${isCollapsed ? "sidenav-collapsed" : ""}`}>
            <div className="logo-container">
                {!isCollapsed && !isMobile && (
                    <img src="/interlinkedlogo.jpg" alt="Interlinked Logo" className="sidebar-logo" />
                )}
                <button
                    className="logo-toggle"
                    onClick={() => !isMobile && setIsCollapsed(!isCollapsed)}
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>

            <ul className="sidenav-nav">
                <SidebarItem icon={faTachometerAlt} text="Dashboard" isCollapsed={isCollapsed} link="/"/>
                <SidebarItem
                    icon={faFire}
                    text="Recent Incidents"
                    isCollapsed={isCollapsed}
                    subItems={!isMobile ? [{ icon: faMapMarkerAlt, text: "Locate most recent incident" }] : undefined}
                />
                <SidebarItem icon={faUserShield} text="Active Duty Deployed" isCollapsed={isCollapsed} />
                
                <SidebarItem icon={faMapMarkedAlt} text="District Map" isCollapsed={isCollapsed} link="/map" />
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
