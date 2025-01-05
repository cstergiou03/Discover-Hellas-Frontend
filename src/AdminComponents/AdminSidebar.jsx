import React from "react";
import { useNavigate } from "react-router-dom";
import "../StyleAdmin/adminSidebar.css";

function AdminSidebar() {
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

    return (
        <div className="admin-sidebar">
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

export default AdminSidebar;
