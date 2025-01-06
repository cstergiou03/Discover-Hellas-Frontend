import Footer from "./Footer.jsx";
import PageTop from "./PageTop.jsx";
import StatSection from "./StatSection.jsx";
import PieriaInfo from "./PieriaInfo";
import Weather from "./Weather.jsx";
import "../Style/mainPanel.css";
import PopularAmenity from "./PopularAmenity.jsx";

function MainPanel() {
    return (
        <div className="main-container">
            <PageTop />
            <div className="mid-container">
                <div className="stat-section"><StatSection /></div>
                <div className="pieria-info"><PieriaInfo /></div>
                <div className="weather"><Weather /></div>
                <div className="popular-amenity"><PopularAmenity /></div>
            </div>
            <Footer />
        </div>
    );
}

export default MainPanel;
