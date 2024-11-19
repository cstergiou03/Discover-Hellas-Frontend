import "../Style/popularAmenity.css";
import stats from "../assets/amenitiesStats.json";
import amenities from "../assets/amenities.json";

function PopularAmenity() {
    const getTopDestinations = () => {
        const statsMap = stats.reduce((map, stat) => {
            map[stat.destination_id] = stat;
            return map;
        }, {});

        const destinationsWithStats = amenities
            .filter((amenity) => amenity.type === "Destination" && statsMap[amenity.amenity_id])
            .map((amenity) => ({
                ...amenity,
                total_visits: statsMap[amenity.amenity_id].total_visits,
            }));

        const sortedDestinations = destinationsWithStats.sort((a, b) => b.total_visits - a.total_visits);

        return sortedDestinations.slice(0, 5);
    };

    const topDestinations = getTopDestinations();

    return (
        <div className="popular-destinations-container">
            <h2>Δημοφιλείς Προορισμοί</h2>
            <p>Θα εμφανίζονται οι πιο Δημοφιλείς προορισμοί της Πιερίας</p>
            <div className="popular-destinations-grid">
                {topDestinations.map((destination, index) => (
                    <div
                        key={destination.amenity_id}
                        className={`destination-card ${
                            index === 0 ? "destination-card-large" : ""
                        }`}
                    >
                        <img
                            src={destination.photos[0]}
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
