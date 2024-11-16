import { useNavigate } from "react-router-dom";
import "../Style/city.css";
import data from "../assets/cities.json"; 

function City() {
    const navigate = useNavigate();

    const handleReadMore = (cityName) => {
        navigate(`/city/${cityName}`);
    };

    return (
        <div className="cities-container">
            {data.map((city, index) => (
                <div key={index} className={`city-info ${index % 2 === 0 ? 'photo-left' : 'photo-right'}`}>
                    <div className="city-photo">
                        <div className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <img src={city.imagePath} alt={`City of ${city.name}`} />
                                </div>
                                <div className="flip-card-back">
                                    <h1>{city.name}</h1>
                                    <p>{city.weather.icon} {city.weather.temperature} - {city.weather.condition}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="general-info">
                        <div className="summary">
                            <p>{city.summary}</p>
                        </div>
                        <div className="read-more-button" onClick={() => handleReadMore(city.id)}>
                            Read More
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default City;
