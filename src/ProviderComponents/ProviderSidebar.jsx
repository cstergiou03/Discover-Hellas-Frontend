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
        { name: "Καταχώρηση Παροχής", icon: "🍽️", path: "/provider/create-amenity" },
        { name: "Καταχώρηση Εκδήλωσης", icon: "🎭", path: "/provider/create-event" },
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

    const handleLogout = () => {
        // Αποσύνδεση χρήστη και καθαρισμός του session
        sessionStorage.removeItem('userToken');
        sessionStorage.setItem('loggedIn', 'false');
        navigate("/");  // Ανακατεύθυνση στην αρχική σελίδα
    };

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
                {!collapsed && <img src={logo} alt="Logo" />}  {/* Το λογότυπο θα εμφανίζεται μόνο αν η sidebar δεν είναι συμπιεσμένη */}

                <div className="menu">
                    {/* Εμφανίζουμε πάντα το Logout item */}
                    <div
                        className="menu-item"
                        onClick={handleLogout}  // Αντί για navigate, καλούμε το handleLogout για αποσύνδεση
                    >
                        <span className="menu-icon">🚪</span>
                        {!collapsed && <span className="menu-text">Αποσύνδεση</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderSidebar;
