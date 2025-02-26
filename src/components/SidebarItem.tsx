import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "../styles/SidebarItem.css";

interface SidebarItemProps {
    icon: IconDefinition;
    text: string;
    isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isCollapsed }) => {
    return (
        <li className="sidenav-nav-item">
            <a href="#" className="sidenav-nav-link">
                <FontAwesomeIcon icon={icon} className="sidenav-link-icon" />
                {!isCollapsed && <span className="sidenav-link-text">{text}</span>}
            </a>
        </li>
    );
};

export default SidebarItem;
