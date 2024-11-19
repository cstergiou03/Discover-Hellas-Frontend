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
            <PageTop></PageTop>
            <div className="mid-container">
                <StatSection></StatSection>
                <PieriaInfo></PieriaInfo>
                <Weather></Weather>
                <PopularAmenity></PopularAmenity>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default MainPanel;