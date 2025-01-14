import "../Style/popularAmenity.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function PopularAmenity() {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch destinations
                const destinationsResponse = await fetch(
                    "https://olympus-riviera.onrender.com/api/destination/get/all"
                );
                if (!destinationsResponse.ok) {
                    throw new Error("Failed to fetch destinations");
                }
                const destinationsData = await destinationsResponse.json();
                setDestinations(destinationsData);

                // Fetch statistics
                const statisticsResponse = await fetch(
                    "https://olympus-riviera.onrender.com/api/admin/statistics/get/all"
                );
                if (!statisticsResponse.ok) {
                    throw new Error("Failed to fetch statistics");
                }
                const statisticsData = await statisticsResponse.json();
                setStatistics(statisticsData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getTopDestinations = () => {
        const statsMap = statistics.reduce((map, stat) => {
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

    const getImageSrc = (photos) => {
        if (!photos) {
            return "";  // Επιστρέφουμε κενή τιμή αν δεν υπάρχουν φωτογραφίες
        }
    
        // Διαχωρίζουμε τις φωτογραφίες σε πίνακα από base64
        const photoArray = photos
            .split("data:image/jpeg;base64,")
            .filter((photo) => photo.trim() !== "")  // Φιλτράρουμε τις κενές φωτογραφίες
            .map((photo) => "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")); // Αφαιρούμε οποιοδήποτε κόμμα στο τέλος
    
        // Αν δεν υπάρχουν φωτογραφίες μετά τη φιλτραρίσματος, επιστρέφουμε κενή τιμή
        if (photoArray.length === 0) {
            return "";
        }
    
        // Επιστρέφουμε την πρώτη φωτογραφία
        return photoArray[0];
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
            <p>Οι πιο Δημοφιλείς προορισμοί της Πιερίας</p>
            <div className="popular-destinations-grid">
                {topDestinations.map((destination, index) => (
                    <div
                        key={destination.destination_id}
                        className={`destination-card ${index === 0 ? "destination-card-large" : ""
                            }`}
                        onClick={() => handleCardClick(destination.destination_id)}
                    >
                        <img
                            src={getImageSrc(destination.photos)}
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
