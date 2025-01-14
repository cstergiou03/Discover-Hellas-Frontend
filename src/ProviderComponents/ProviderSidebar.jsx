import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../StyleProvider/providerSidebar.css";
import logo from "../assets/logo2.png";
import { FaBars } from 'react-icons/fa';

function ProviderSidebar() {
    const [collapsed, setCollapsed] = useState(window.innerWidth < 950); // Αρχική κατάσταση ανάλογα με το πλάτος
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

    // Εναλλαγή του collapsed state
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    // Listener για το πλάτος της οθόνης
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 950) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        window.addEventListener("resize", handleResize);

        // Καθαρισμός του listener όταν το component αποσυνδέεται
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className={`provider-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="logo">
                <button className="logo-button" onClick={toggleSidebar}>
                    {collapsed ? <FaBars /> : <FaBars />} {/* Χρησιμοποιούμε τα icons από το Font Awesome */}
                </button>
            </div>
            <div className="menu">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className="menu-item"
                        onClick={() => handleNavigation(item.path)}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        {!collapsed && <span className="menu-text">{item.name}</span>}
                    </div>
                ))}
            </div>

            <div className="side-bar-footer">
                {!collapsed && <img src={logo} alt="Logo" />}
                <div className="logout" onClick={() => handleNavigation("/logout")}>
                    🚪
                </div>
            </div>
        </div>
    );
}

export default ProviderSidebar;
