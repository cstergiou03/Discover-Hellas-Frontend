import "../Style/mapMain.css";
import Header from "./Header";
import FilterButton from "./FilterButton";
import GoogleMapReact from "google-map-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function MapMain() {
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [filteredAmenities, setFilteredAmenities] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [markers, setMarkers] = useState([]);
    const mapRef = useRef(null);
    const navigate = useNavigate();

    const handleCardClick = (id, type) => {
        navigate(`/${type}/${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const destinationsResponse = await fetch(
                    "https://olympus-riviera.onrender.com/api/destination/get/all"
                );
                const destinationsData = await destinationsResponse.json();
                const normalizedDestinations = destinationsData.map((destination) => ({
                    ...destination,
                    id: destination.destination_id,
                }));
                setDestinations(normalizedDestinations);
                setFilteredDestinations(normalizedDestinations);

                const amenitiesResponse = await fetch(
                    "https://olympus-riviera.onrender.com/api/amenity/get/all"
                );
                const amenitiesData = await amenitiesResponse.json();
                const normalizedAmenities = amenitiesData.map((amenity) => ({
                    ...amenity,
                    id: amenity.amenity_id,
                }));
                setAmenities(normalizedAmenities);
                setFilteredAmenities(normalizedAmenities);


                const token = sessionStorage.getItem("userToken");
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.userId;
                    console.log(userId);

                    // Νέα κλήση API για τα plans με το userId
                    const plansResponse = await fetch(
                        `https://olympus-riviera.onrender.com/api/plan/user/${userId}/plans`
                    );
                    const plansData = await plansResponse.json();
                    setPlans(plansData); // Αποθήκευση των plans
                }

                setLoading(false);

            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleFilterChange = (categories) => {
        setSelectedCategories(categories);

        if (categories.length === 0) {
            setFilteredDestinations(destinations);
            setFilteredAmenities(amenities);
        } else {
            const filteredDest = destinations.filter((destination) =>
                categories.includes(destination.category_id)
            );
            const filteredAmen = amenities.filter((amenity) =>
                categories.includes(amenity.category_id)
            );
            setFilteredDestinations(filteredDest);
            setFilteredAmenities(filteredAmen);
        }
    };

    const openInfoWindowRef = useRef(null);

    const handleApiLoaded = ({ map, maps }) => {
        mapRef.current = map;

        markers.forEach((marker) => marker.setMap(null));

        const createMarker = (item, type) => {
            const position = {
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude),
            };

            const marker = new maps.Marker({
                position,
                map,
                title: item.name,
            });

            const mainInfoWindow = new maps.InfoWindow({
                content: `
                    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border: 1px solid #ddd; max-width: 300px;">
                        <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #a4c991;">${item.name}</h3>
                        <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #555;">${item.description || "No description available."}</p>
                        <button id="info-button-details-${type}-${item.id}" style="background-color: #a4c991; color: #fff; border: none; padding: 10px 15px; border-radius: 5px; font-size: 14px; cursor: pointer; display: inline-block;">Περισσότερα...</button>
                        <button id="info-button-plan-${type}-${item.id}" style="background-color: #a4c991; color: #fff; border: none; padding: 10px 15px; border-radius: 5px; font-size: 14px; cursor: pointer; display: inline-block;">Προσθήκη σε πλάνο</button>
                    </div>
                `,
            });

            const isLoggedIn = sessionStorage.getItem("loggedIn");
            let planOptions;

            if (isLoggedIn === "false" || isLoggedIn === null) {
                // Αν ο χρήστης δεν είναι συνδεδεμένος
                planOptions = '<option value="guest-plan">Πλάνο</option>';
            } else if (plans && plans.length > 0) {
                // Αν υπάρχουν διαθέσιμα πλάνα
                planOptions = plans.map((plan) => `<option value="${plan.plan_id}">${plan.title}</option>`).join('');
            } else {
                // Αν δεν υπάρχουν διαθέσιμα πλάνα
                planOptions = '<option value="">Δεν υπάρχουν διαθέσιμα πλάνα</option>';
            }

            const planInfoWindow = new maps.InfoWindow({
                content: `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border: 1px solid #ddd; max-width: 300px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #a4c991;">Προσθήκη σε πλάνο</h3>
                <label for="plan-type-${item.id}" style="font-size: 14px; color: #555;">Επιλογή πλάνου:</label>
                <select id="plan-type-${item.id}" style="width: 100%; padding: 5px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                    <option value="" disabled selected>--Επιλέξτε Πλάνο--</option>
                    ${planOptions}
                </select>
    
                <label for="plan-date-${item.id}" style="font-size: 14px; color: #555;">Ημερομηνία και ώρα:</label>
                <div style="display: flex; flex-direction: column;">
                    <input type="date" id="plan-date-${item.id}-date" style="width: 100%; padding: 5px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;">
                    <div style="display: flex; margin-bottom: 10px;">
                        <select id="plan-date-${item.id}-hour" style="flex: 1; padding: 5px; margin-right: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            ${[...Array(24).keys()].map(hour => `<option value="${hour}">${hour.toString().padStart(2, '0')}</option>`).join('')}
                        </select>
                        <select id="plan-date-${item.id}-minute" style="flex: 1; padding: 5px; border: 1px solid #ddd; border-radius: 5px;">
                            <option value="00">00</option>
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="45">45</option>
                        </select>
                    </div>
                </div>
            <button id="plan-add-button-${item.id}" style="background-color: #a4c991; color: #fff; border: none; padding: 10px 15px; border-radius: 5px; font-size: 14px; cursor: pointer; display: inline-block;">Προσθήκη</button>
        </div>
    `,
            });


            marker.addListener("click", () => {
                if (openInfoWindowRef.current) {
                    openInfoWindowRef.current.close();
                }
                mainInfoWindow.open(map, marker);
                openInfoWindowRef.current = mainInfoWindow;
            });

            mainInfoWindow.addListener("domready", () => {
                const detailsButton = document.getElementById(`info-button-details-${type}-${item.id}`);
                if (detailsButton) {
                    detailsButton.addEventListener("click", () => handleCardClick(item.id, type));
                }

                const planButton = document.getElementById(`info-button-plan-${type}-${item.id}`);
                if (planButton) {
                    planButton.addEventListener("click", () => {
                        mainInfoWindow.close();
                        planInfoWindow.open(map, marker);
                        openInfoWindowRef.current = planInfoWindow;
                    });
                }
            });

            planInfoWindow.addListener("domready", () => {
                const addButton = document.getElementById(`plan-add-button-${item.id}`);
                if (addButton) {
                    addButton.addEventListener("click", async () => {
                        const selectedDate = document.getElementById(`plan-date-${item.id}-date`).value;
                        const selectedHour = document.getElementById(`plan-date-${item.id}-hour`).value;
                        const selectedMinute = document.getElementById(`plan-date-${item.id}-minute`).value;

                        const fullDateTime = selectedDate && selectedHour && selectedMinute
                            ? `${selectedDate}T${selectedHour}:${selectedMinute}:00`
                            : null;

                        const selectedPlan = document.getElementById(`plan-type-${item.id}`);
                        const plan_id = selectedPlan && selectedPlan.value !== "" ? selectedPlan.value : null;

                        if (!plan_id) {
                            alert('Παρακαλώ επιλέξτε πλάνο.');
                            return;
                        }

                        if (!fullDateTime) {
                            alert('Παρακαλώ επιλέξτε ημερομηνία και ώρα.');
                            return;
                        }

                        const requestBody = {
                            plan_id: plan_id,
                            plan: [
                                {
                                    entity_id: `${item.id}`,
                                    date: fullDateTime,
                                },
                            ],
                        };

                        // Έλεγχος αν ο χρήστης είναι συνδεδεμένος
                        const loggedIn = sessionStorage.getItem('loggedIn') === 'true'

                        if (loggedIn) {
                            // Αν είναι συνδεδεμένος, κάνουμε την κανονική προσθήκη στο πλάνο
                            try {
                                const response = await fetch(`https://olympus-riviera.onrender.com/api/plan/${plan_id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(requestBody),
                                });

                                if (response.ok) {
                                    alert('Το πλάνο προστέθηκε επιτυχώς!');
                                } else {
                                    alert('Προέκυψε πρόβλημα κατά την προσθήκη του πλάνου.');
                                }
                            } catch (error) {
                                console.error('Error:', error);
                                alert('Προέκυψε κάποιο σφάλμα κατά την αποστολή του αιτήματος.');
                            }
                        } else {
                            // Αν δεν είναι συνδεδεμένος, αποθηκεύουμε το πλάνο στον localStorage
                            const guestPlan = JSON.parse(localStorage.getItem('guestPlan')) || {
                                title: "Guest Vacation Plan",
                                plan: [],
                            };

                            // Προσθήκη του νέου στοιχείου στο πλάνο του επισκέπτη
                            guestPlan.plan.push({
                                entity_id: `${item.id}`,
                                date: fullDateTime,
                            });

                            localStorage.setItem('guestPlan', JSON.stringify(guestPlan));

                            alert('Το πλάνο αποθηκεύτηκε για αργότερη χρήση!');
                        }
                    });
                }
            });

            return marker;
        };

        const destinationMarkers = filteredDestinations.map((destination) =>
            createMarker(destination, "destination")
        );
        const amenityMarkers = filteredAmenities.map((amenity) =>
            createMarker(amenity, "amenity")
        );

        setMarkers([...destinationMarkers, ...amenityMarkers]);
    };


    useEffect(() => {
        if (mapRef.current && window.google) {
            const maps = window.google.maps;
            handleApiLoaded({ map: mapRef.current, maps });
        }
    }, [filteredDestinations, filteredAmenities, selectedCategories, plans]); // Προσθήκη plans στις εξαρτήσεις

    useEffect(() => {
        // Αυτός ο handler θα διαγράψει το guestPlan πριν κλείσει η καρτέλα ή ο browser
        const handleBeforeUnload = () => {
            localStorage.removeItem('guestPlan');
        };

        // Προσθέτουμε τον listener για την περίπτωση που κλείνει το παράθυρο ή η καρτέλα
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Καθαρισμός του event listener όταν το component απομακρύνεται (unmounts)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

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
