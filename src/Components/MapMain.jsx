import "../Style/mapMain.css";
import Header from "./Header";
import FilterButton from "./FilterButton";
import GoogleMapReact from "google-map-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function MapMain() {
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [markers, setMarkers] = useState([]);
    const mapRef = useRef(null);
    const navigate = useNavigate();

    const handleCardClick = (destinationId) => {
        navigate(`/destination/${destinationId}`);
    };

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await fetch(
                    "https://olympus-riviera.onrender.com/api/destination/get/all"
                );
                const data = await response.json();
                setDestinations(data);
                setFilteredDestinations(data); // Αρχικά δεν υπάρχει φίλτρο
                setLoading(false);
            } catch (error) {
                console.error("Error fetching destinations:", error);
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    // Handle filter change and update selected categories
    const handleFilterChange = (categories) => {
        setSelectedCategories(categories);
        console.log("Updated Selected Categories in FilterButton:", categories);

        if (categories.length === 0) {
            setFilteredDestinations(destinations); // Χωρίς φίλτρο, εμφανίζονται όλα
        } else {
            const filtered = destinations.filter((destination) =>
                categories.includes(destination.category_id)
            );
            setFilteredDestinations(filtered); // Ενημερώνουμε τα φιλτραρισμένα destinations
        }
    };

    const openInfoWindowRef = useRef(null); // Αναφορά στο τρέχον ανοιχτό InfoWindow

    const handleApiLoaded = ({ map, maps }) => {
        mapRef.current = map;

        markers.forEach((marker) => marker.setMap(null));

        const newMarkers = filteredDestinations.map((destination) => {
            const position = {
                lat: parseFloat(destination.latitude),
                lng: parseFloat(destination.longitude),
            };

            const marker = new maps.Marker({
                position,
                map,
                title: destination.name,
            });

            const infoWindow = new maps.InfoWindow({
                content: `
                <div id="info-window-${destination.destination_id}" style="font-family: Arial, sans-serif; font-size: 14px; color: #333; background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border: 1px solid #ddd; max-width: 300px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #a4c991;">${destination.name}</h3>
                    <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #555;">${destination.description || "No description available."}</p>
                    <button id="info-button-${destination.destination_id}" style="background-color: #a4c991; color: #fff; border: none; padding: 10px 15px; border-radius: 5px; font-size: 14px; cursor: pointer; display: inline-block;">Περισσότερα...</button>
                </div>
            `,
            });

            marker.addListener("click", () => {
                // Κλείσιμο του προηγούμενου InfoWindow
                if (openInfoWindowRef.current) {
                    openInfoWindowRef.current.close();
                }

                // Άνοιγμα του νέου InfoWindow
                infoWindow.open(map, marker);

                // Ενημέρωση της αναφοράς
                openInfoWindowRef.current = infoWindow;
            });

            infoWindow.addListener("domready", () => {
                const button = document.getElementById(
                    `info-button-${destination.destination_id}`
                );
                if (button) {
                    button.addEventListener("click", () =>
                        handleCardClick(destination.destination_id)
                    );
                }
            });

            return marker;
        });

        setMarkers(newMarkers);
    };


    useEffect(() => {
        if (mapRef.current && window.google) {
            const maps = window.google.maps;
            handleApiLoaded({ map: mapRef.current, maps });
        }
    }, [filteredDestinations, selectedCategories]); // Παρακολουθούμε αλλαγές στα φίλτρα και στα destinations

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="map-main-container">
            <div className="map-header-container">
                <Header />
            </div>
            <div className="map-container">
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
                    }}
                    defaultZoom={10}
                    defaultCenter={{
                        lat: 40.0853,
                        lng: 22.3584,
                    }}
                    onGoogleApiLoaded={handleApiLoaded}
                    yesIWantToUseGoogleMapApiInternals
                ></GoogleMapReact>
            </div>
            <div className="map-filter-container">
                <FilterButton onFilterChange={handleFilterChange} />
            </div>
        </div>
    );
}

export default MapMain;
