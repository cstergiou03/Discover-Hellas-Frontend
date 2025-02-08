import React from "react";
import Footer from "./Footer.jsx";
import PageTop from "./PageTop.jsx";
import StatSection from "./StatSection.jsx";
import MainInfo from "./MainInfo.jsx";
import WeatherWidget from "./Weather.jsx";
import "../Style/mainPanel.css";
import PopularDestination from "./PopularDestination.jsx";
import DestinationCards from "./DestinationCards.jsx";
import ActivityCards from "./ActivityCards.jsx";

function MainPanel() {
    
    const loggedIn = sessionStorage.getItem("loggedIn") === "true";

    return (
        <div className="main-container">
            <PageTop />
            <div className="mid-container">
                <div className="stat-section"><StatSection /></div>
                <div className="inside-mid-container">
                    <div className="weather"><WeatherWidget/></div>
                    <div className="visit-info"><MainInfo /></div>
                </div>
                <div className="popular-amenity"><PopularDestination /></div>
                {loggedIn && (
                    <>
                        <DestinationCards />
                        <ActivityCards />
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default MainPanel;
