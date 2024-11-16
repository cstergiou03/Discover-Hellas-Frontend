import Navigation from "./Navigation.jsx";
import City from "./City.jsx";
import Footer from "./Footer.jsx";
import sounio from "../assets/sounio.jpg";
import "../Style/mainPanel.css";

function MainPanel() {
    return (
        <div className="main-container">
            <div className="top-container">
                <img src={sounio} className="greece-photo" />
                <Navigation className="navbar" />
                <div className="welcome-container">
                    <h1 className="blue">Welcome</h1><h1 className="white">To</h1><h1 className="blue">Greece</h1>
                </div>
            </div>
            <div className="mid-container">
                <h2>Cities of Greece</h2>
                <City />
            </div>
            <Footer />
        </div>
    );
}

export default MainPanel;
