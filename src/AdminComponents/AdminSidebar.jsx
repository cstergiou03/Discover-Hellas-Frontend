import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../StyleAdmin/adminSidebar.css";
import logo from "../assets/logo2 (1).png";
import { FaBars } from "react-icons/fa";

function AdminSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { name: "Home", icon: "🏠", path: "/admin" },
        { name: "Καταχώρηση Προορισμού", icon: "📍", path: "/admin/create-destination" },
        { name: "Καταχώρηση Δραστηριότητας", icon: "🎯", path: "/admin/create-activity" },
        { name: "Καταχώρηση Παροχής", icon: "🍽️", path: "/admin/create-amenity" },
        { name: "Δημιουργία Κατηγορίας", icon: "📑", path: "/admin/create-category" },
        { name: "Profile", icon: "👤", path: "/admin/profile" },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    // Εναλλαγή του collapsed state
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    // Παρακολούθηση του πλάτους της οθόνης για αυτόματο collapse
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 950) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        // Ελέγχουμε την αρχική κατάσταση
        handleResize();

        // Προσθήκη event listener
        window.addEventListener("resize", handleResize);

        // Καθαρισμός του event listener κατά την αποσύνδεση
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
        <div className={`provider-sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="logo">
                <button className="logo-button" onClick={toggleSidebar}>
                    <FaBars /> {/* Χρησιμοποιούμε τα icons από το Font Awesome */}
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
                {!collapsed && <img src={logo} alt="Logo" className="logo"/>}  {/* Το λογότυπο θα εμφανίζεται μόνο αν η sidebar δεν είναι συμπιεσμένη */}

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

export default AdminSidebar;
