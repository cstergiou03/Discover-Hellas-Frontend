import "../Style/popularAmenity.css";
import stats from "../assets/destinationsStats.json";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function PopularAmenity() {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await fetch(
                    "https://olympus-riviera.onrender.com/api/admin/destination/get/all"
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch destinations");
                }
                const data = await response.json();
                setDestinations(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    const getTopDestinations = () => {
        const statsMap = stats.reduce((map, stat) => {
            map[stat.destination_id] = stat;
            return map;
        }, {});

        const destinationsWithStats = destinations
            .filter((destination) => statsMap[destination.destination_id])
            .map((destination) => ({
                ...destination,
                total_visits: statsMap[destination.destination_id].total_visits,
            }));

        const sortedDestinations = destinationsWithStats.sort((a, b) => b.total_visits - a.total_visits);

        return sortedDestinations.slice(0, 5);
    };

    const topDestinations = getTopDestinations();

    const handleCardClick = (destinationId) => {
        navigate(`/destination/${destinationId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="popular-destinations-container">
            <h2>Δημοφιλείς Προορισμοί</h2>
            <p>Θα εμφανίζονται οι πιο Δημοφιλείς προορισμοί της Πιερίας</p>
            <div className="popular-destinations-grid">
                {topDestinations.map((destination, index) => (
                    <div
                        key={destination.destination_id}
                        className={`destination-card ${
                            index === 0 ? "destination-card-large" : ""
                        }`}
                        onClick={() => handleCardClick(destination.destination_id)}
                    >
                        <img
                            src={destination.photos}
                            alt={destination.name}
                            className="destination-photo"
                        />
                        <div className="destination-info">
                            <h3>{`Προορισμός No${index + 1}`}</h3>
                            <p>{destination.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PopularAmenity;
