import {
    faBars,
    faBell,
    faEnvelope,
    faExclamationTriangle,
    faFire,
    faMapMarkedAlt,
    faMapMarkerAlt,
    faSignOutAlt,
    faTachometerAlt,
    faTruck,
    faUserShield
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import "../styles/Sidebar.css";
import { AuthContext } from "./AuthContext"; // Import Auth Context
import SidebarItem from "./SidebarItem";

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const auth = useContext(AuthContext); // Get user role

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
            <div className="logo-container-sidebar">
                {!isCollapsed && !isMobile && (
                    <img src="/interlinkedlogo.jpg" alt="Interlinked Logo" className="sidebar-logo" />
                )}
                <button
                    className="logo-toggle"
                    onClick={() => !isMobile && setIsCollapsed(!isCollapsed)}
                    aria-label="Toggle sidebar"
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>

            <ul className="sidenav-nav">
                {/* Dashboard */}
                <SidebarItem
                    icon={faTachometerAlt}
                    text="Dashboard"
                    isCollapsed={isCollapsed}
                    link={"/dashboard"}
                />

                {/* District Specific Events: Only visible to Fire Agency */}
                {auth?.role === "fire-agency" && (
                    <SidebarItem
                    icon={faFire}
                    text="District Incidents"
                    isCollapsed={isCollapsed}
                    subItems={!isMobile ? [
                        {icon: faMapMarkerAlt, text: "Locate Ongoing Incidents"},
                        {icon: faExclamationTriangle, text: "Create Active Incident"},
                        {icon: faMapMarkedAlt, text: "District Map"}
                    ] : undefined}
                    />
                )}

                <SidebarItem icon={faTruck} text="Active Duty & Engines Deployed" isCollapsed={isCollapsed} />

                <SidebarItem icon={faMapMarkedAlt} text="Ongoing Disaster Map" isCollapsed={isCollapsed} link="/map" />
                <SidebarItem icon={faUserShield} text="Risk of Ignition" isCollapsed={isCollapsed} />

                <SidebarItem icon={faBell} text="Announcements" isCollapsed={isCollapsed} />
                <SidebarItem icon={faEnvelope} text="Messages" isCollapsed={isCollapsed} />

                <SidebarItem icon={faExclamationTriangle} text="Report a Bug" isCollapsed={isCollapsed} />

                {/* Admin Dashboard: Only visible to Admins */}
                {auth?.role === "admin" && (
                    <SidebarItem icon={faMapMarkedAlt} text="Admin Settings" isCollapsed={isCollapsed} link="/admin-dashboard" />
                )}

                {/* Logout Button as SidebarItem */}
                {auth?.isAuthenticated && (
                    <li className="sidenav-nav-item">
                        <button onClick={auth.logout} className="logout-button">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
