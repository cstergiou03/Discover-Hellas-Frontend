import Footer from "./Footer.jsx";
import PageTop from "./PageTop.jsx";
import StatSection from "./StatSection.jsx";
import PieriaInfo from "./PieriaInfo";
import WeatherWidget from "./Weather.jsx";
import "../Style/mainPanel.css";
import PopularDestination from "./PopularDestination.jsx";

function MainPanel() {
    return (
        <div className="main-container">
            <PageTop />
            <div className="mid-container">
                <div className="stat-section"><StatSection /></div>
                <div className="inside-mid-container">
                    <div className="weather"><WeatherWidget/></div>
                    <div className="pieria-info"><PieriaInfo /></div>
                </div>
                <div className="popular-amenity"><PopularDestination /></div>
            </div>
            <Footer />
        </div>
    );
}

export default MainPanel;
