import { useParams } from "react-router-dom";
import data from "../assets/cities.json";
import Monuments from "./Monuments.jsx";
import Footer from "./Footer.jsx";
import Navigation from "./Navigation.jsx";
import "../Style/cityPanel.css";

function CityPanel() {
    const { id } = useParams();
    const city = data.find(city => city.id === id);

    if (!city) {
        return <div>City not found</div>; 
    }

    return (
        <div className="main-container">
            <img src={city.imagePath} alt={city.name} className="city-banner" />
            <div className="top-container">
                <Navigation className="navbar" />
            </div>
            <div className="mid-container">
                <h2>Monuments</h2>
                <Monuments monuments={city.monuments} />
            </div>
            <Footer />
        </div>
    );
}

export default CityPanel;
