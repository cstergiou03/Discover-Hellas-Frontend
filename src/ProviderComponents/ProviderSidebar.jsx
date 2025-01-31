import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../StyleProvider/providerSidebar.css";
import logo from "../assets/logo2.png";
import { FaBars } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

function ProviderSidebar() {
    const [collapsed, setCollapsed] = useState(window.innerWidth < 950); // Αρχική κατάσταση ανάλογα με το πλάτος
    const [userStatus, setUserStatus] = useState("");  // Αποθήκευση του status του χρήστη
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();

    const menuItems = [
        { name: "Home", icon: "🏠", path: "/provider" },
        { name: "Καταχώρηση Παροχής", icon: "🍽️", path: "/provider/create-amenity", disabled: false },
        { name: "Καταχώρηση Εκδήλωσης", icon: "🎭", path: "/provider/create-event", disabled: false },
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

    useEffect(() => {
        const token = sessionStorage.getItem("userToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.userId);

                const url = "https://olympus-riviera.onrender.com/api/user/" + `${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        setUserStatus(data.status);  // Αποθηκεύουμε το status του χρήστη
                    })
                    .catch((err) => {
                        console.error('Error fetching user data:', err.message);
                    });
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [userId]);

    // Ενημέρωση των menuItems αν το status είναι "PENDING"
    const updatedMenuItems = menuItems.map((item) => {
        if (
            (userStatus === "PENDING" || userStatus === "REJECTED") && 
            (item.name === "Καταχώρηση Παροχής" || item.name === "Καταχώρηση Εκδήλωσης")
        ) {
            return { ...item, disabled: true };  // Απενεργοποιούμε τα συγκεκριμένα items
        }
        return item;
    });    

    const handleLogout = () => {
        // Αποσύνδεση χρήστη και καθαρισμός του session
        sessionStorage.removeItem('userToken');
        sessionStorage.setItem('loggedIn', 'false');
        navigate("/");
    };

    return (
        <div className={`provider-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="logo">
                <button className="logo-button" onClick={toggleSidebar}>
                    {collapsed ? <FaBars /> : <FaBars />} {/* Χρησιμοποιούμε τα icons από το Font Awesome */}
                </button>
            </div>
            <div className="menu">
                {updatedMenuItems.map((item, index) => (
                    <div
                        key={index}
                        className="menu-item"
                        onClick={() => !item.disabled && handleNavigation(item.path)}  // Απενεργοποιούμε την κίνηση αν είναι disabled
                        style={item.disabled ? { cursor: 'not-allowed', opacity: 0.5 } : {}}  // Αν είναι disabled, το κάνουμε όχι clickable
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
