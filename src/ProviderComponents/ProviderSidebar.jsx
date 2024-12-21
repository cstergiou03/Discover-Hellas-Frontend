import React from "react";
import { useNavigate } from "react-router-dom";
import "../StyleProvider/providerSidebar.css";

function ProviderSidebar() {
    const navigate = useNavigate();

    const menuItems = [
        { name: "Home", icon: "🏠", path: "/provider" },
        { name: "Καταχώρηση Παροχής", icon: "🍽️", path: "/provider/create-amenity"},
        { name: "Καταχώρηση Εκδήλωσης", icon: "🎭", path: "/provider/create-event"},
        { name: "Profile", icon: "👤", path: "/provider/profile" },
    ];
    

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="provider-sidebar">
            <div className="logo">
                <img src="../../src/assets/logo2.png"></img>
            </div>
            <div className="menu">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className="menu-item"
                        onClick={() => handleNavigation(item.path)}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-text">{item.name}</span>
                        {item.hasAction && <span className="menu-action">+</span>}
                    </div>
                ))}
            </div>

            <div className="side-bar-footer">
                <div className="logout" onClick={() => handleNavigation("/logout")}>
                    🚪 Log out
                </div>
            </div>
        </div>
    );
}

export default ProviderSidebar;
