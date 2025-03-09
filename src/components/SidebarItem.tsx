import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom"; // Import Link for routing
import "../styles/SidebarItem.css";

interface SidebarItemProps {
    icon: IconDefinition;
    text: string;
    isCollapsed: boolean;
    link?: string; // Added link support
    subItems?: { icon: IconDefinition; text: string; link?: string }[];
    isMobile?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isCollapsed, link, subItems, isMobile }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        console.log(`Sidebar ${text} expanded:`, isExpanded);
    }, [isExpanded]);

    const toggleExpansion = () => {
        if (!isMobile && subItems) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <li className={`sidenav-nav-item ${isExpanded ? "expanded" : ""}`} title={isCollapsed ? text : ""}>
            {/* Use Link if link exists, otherwise keep it as a regular toggleable button */}
            {link ? (
                <Link to={link} className="sidenav-nav-link">
                    <FontAwesomeIcon icon={icon} className="sidenav-link-icon" />
                    {!isCollapsed && <span className="sidenav-link-text">{text}</span>}
                </Link>
            ) : (
                <a href="#" className="sidenav-nav-link" onClick={toggleExpansion}>
                    <FontAwesomeIcon icon={icon} className="sidenav-link-icon" />
                    {!isCollapsed && <span className="sidenav-link-text">{text}</span>}

                    {/* Down Arrow for expandable items */}
                    {!isCollapsed && subItems && (
                        <FontAwesomeIcon 
                            icon={faChevronDown} 
                            className={`sidenav-arrow ${isExpanded ? "rotated" : ""}`} 
                        />
                    )}
                </a>
            )}

            {/* Sublist for dropdown items */}
            {!isCollapsed && !isMobile && isExpanded && subItems && (
                <ul className="sidenav-sublist">
                    {subItems.map((subItem, index) => (
                        <li key={index} className="sidenav-subitem">
                            {subItem.link ? (
                                <Link to={subItem.link} className="sidenav-subitem-link">
                                    <FontAwesomeIcon icon={subItem.icon} className="sidenav-subitem-icon" />
                                    <span className="sidenav-subitem-text">{subItem.text}</span>
                                </Link>
                            ) : (
                                <div className="sidenav-subitem">
                                    <FontAwesomeIcon icon={subItem.icon} className="sidenav-subitem-icon" />
                                    <span className="sidenav-subitem-text">{subItem.text}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default SidebarItem;