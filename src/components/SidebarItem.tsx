import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"; // Down arrow icon
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "../styles/SidebarItem.css";

interface SidebarItemProps {
    icon: IconDefinition;
    text: string;
    isCollapsed: boolean;
    subItems?: { icon: IconDefinition; text: string }[];
    isMobile?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isCollapsed, subItems, isMobile }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Force reapply styles when component updates
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
            <a href="#" className="sidenav-nav-link" onClick={toggleExpansion}>
                <FontAwesomeIcon icon={icon} className="sidenav-link-icon" />
                {!isCollapsed && <span className="sidenav-link-text">{text}</span>}
                
                {/* Down Arrow */}
                {!isCollapsed && subItems && (
                    <FontAwesomeIcon 
                        icon={faChevronDown} 
                        className={`sidenav-arrow ${isExpanded ? "rotated" : ""}`} 
                    />
                )}
            </a>

            {/* Sublist */}
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
