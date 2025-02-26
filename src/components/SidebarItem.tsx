import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "../styles/SidebarItem.css";

interface SidebarItemProps {
    icon: IconDefinition;
    text: string;
    isCollapsed: boolean;
    subItems?: { icon: IconDefinition; text: string }[]; // Array of sub-items
    isMobile?: boolean; // Added to check if it's mobile view
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isCollapsed, subItems, isMobile }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Function to toggle expansion (disabled in mobile view)
    const toggleExpansion = () => {
        if (!isMobile && subItems) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <li className={`sidenav-nav-item ${isExpanded ? "expanded" : ""}`} title={isCollapsed ? text : ""}>
            {/* Main Sidebar Item */}
            <a href="#" className="sidenav-nav-link" onClick={toggleExpansion}>
                <FontAwesomeIcon icon={icon} className="sidenav-link-icon" />
                {!isCollapsed && <span className="sidenav-link-text">{text}</span>}
            </a>

            {/* Sublist (Only if subItems exist & not in mobile view) */}
            {!isCollapsed && !isMobile && isExpanded && subItems && (
                <ul className="sidenav-sublist">
                    {subItems.map((subItem, index) => (
                        <li key={index} className="sidenav-subitem">
                            <FontAwesomeIcon icon={subItem.icon} className="sidenav-subitem-icon" />
                            <span className="sidenav-subitem-text">{subItem.text}</span>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default SidebarItem;
