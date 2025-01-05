import React, { useEffect, useState, useRef } from "react";
import "../Style/planView.css";
import Header from "./Header";
import PlanRecord from "./PlanRecord";
import GoogleMapReact from "google-map-react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useNavigate, useParams } from "react-router-dom";

function PlanView() {
    const [plan, setPlan] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const { planId } = useParams();
    const [loading, setLoading] = useState(true);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const markers = useRef([]);
    const mapRef = useRef(null);
    const [routeInfo, setRouteInfo] = useState({
        totalDistance: 0,
        totalDuration: 0,
        totalCost: 0,
        legs: [],
    });

    console.log(planId);

    // Συνάρτηση για την λήψη των δεδομένων
    const fetchData = async () => {
        try {
            const destinationsResponse = await fetch(
                "https://olympus-riviera.onrender.com/api/destination/get/all"
            );
            const destinationsData = await destinationsResponse.json();
            setDestinations(destinationsData);
    
            const amenitiesResponse = await fetch(
                "https://olympus-riviera.onrender.com/api/amenity/get/all"
            );
            const amenitiesData = await amenitiesResponse.json();
            setAmenities(amenitiesData);
    
            // Εδώ δεν ψάχνουμε για το plan μέσω του planId, αλλά το φέρνουμε κατευθείαν
            const planResponse = await fetch(
                `https://olympus-riviera.onrender.com/api/plan/${planId}`
            );
            const planData = await planResponse.json();
    
            if (planData) {
                // Ταξινόμηση του πλάνου με βάση την ημερομηνία
                const sortedPlan = planData.plan.sort((a, b) => {
                    const dateA = new Date(a.date.split('T')[0]);
                    const dateB = new Date(b.date.split('T')[0]);
    
                    if (isNaN(dateA.getTime())) {
                        console.error("Μη έγκυρη ημερομηνία:", a.date);
                        return 0;
                    }
                    if (isNaN(dateB.getTime())) {
                        console.error("Μη έγκυρη ημερομηνία:", b.date);
                        return 0;
                    }
    
                    return dateA - dateB;
                });
    
                setPlan({ ...planData, plan: sortedPlan });
            }
    
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };
    

    // Κλήση fetchData όταν φορτώνει η σελίδα
    useEffect(() => {
        fetchData();
    }, []);

    const getEntityDetails = (entityId) => {
        const destination = destinations.find(
            (destination) => destination.destination_id === entityId
        );
        const amenity = amenities.find(
            (amenity) => amenity.amenity_id === entityId
        );

        return destination || amenity || null;
    };

    const handleApiLoaded = ({ map, maps }) => {
        mapRef.current = map;

        markers.current.forEach((marker) => marker.marker.setMap(null));
        markers.current = [];

        if (!plan || !plan.plan) return;

        plan.plan.forEach((entry) => {
            const entity = getEntityDetails(entry.entity_id);
            if (entity) {
                const position = {
                    lat: parseFloat(entity.latitude),
                    lng: parseFloat(entity.longitude),
                };
                const marker = new maps.Marker({
                    position,
                    map,
                    title: entity.name,
                });
                markers.current.push({ marker, entityId: entry.entity_id });
            }
        });

        if (!directionsRenderer) {
            const renderer = new maps.DirectionsRenderer();
            renderer.setMap(map);
            setDirectionsRenderer(renderer);
        }
    };

    const handleDelete = async (entityId) => {
        try {
            // Διαγραφή από το backend
            const response = await fetch(
                "https://olympus-riviera.onrender.com/api/plan/pln_f7714aff/remove",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        entity_ids: [entityId],
                    }),
                }
            );
    
            if (response.ok) {
                // Ανανέωση του πλάνου
                setPlan((prevPlan) => ({
                    ...prevPlan,
                    plan: prevPlan.plan.filter((entry) => entry.entity_id !== entityId),
                }));
    
                // Αφαίρεση marker από το χάρτη
                const markerIndex = markers.current.findIndex((m) => m.entityId === entityId);
                if (markerIndex !== -1) {
                    markers.current[markerIndex].marker.setMap(null);
                    markers.current.splice(markerIndex, 1);
                }
    
                if (directionsRenderer) {
                    directionsRenderer.setDirections({ routes: [] });
                }
    
                fetchData(); // Επαναφόρτωση των δεδομένων μετά τη διαγραφή
            } else {
                console.error("Error removing entity from plan:", response);
            }
        } catch (error) {
            console.error("Error during delete request:", error);
        }
    };
    
    const handleUpdate = async (updatedEntity) => {
            // Ενημέρωση του πλάνου
            const postResponse = await fetch(
                `https://olympus-riviera.onrender.com/api/plan/${planId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        plan: [updatedEntity],
                    }),
                }
            );
        
            const postData = await postResponse.json();
            setPlan({ ...postData }); // Ενημέρωση του UI χωρίς πλήρη ανανέωση
    };       

    const calculateRoute = () => {
        if (!plan || !plan.plan || !directionsRenderer || !window.google) return;

        const maps = window.google.maps;
        const directionsService = new maps.DirectionsService();

        directionsRenderer.setDirections({ routes: [] });

        const waypoints = plan.plan.slice(1, -1).map((entry) => {
            const entity = getEntityDetails(entry.entity_id);
            return {
                location: new maps.LatLng(entity.latitude, entity.longitude),
                stopover: true,
            };
        });

        const originEntity = getEntityDetails(plan.plan[0].entity_id);
        const destinationEntity = getEntityDetails(plan.plan[plan.plan.length - 1].entity_id);

        const request = {
            origin: new maps.LatLng(originEntity.latitude, originEntity.longitude),
            destination: new maps.LatLng(destinationEntity.latitude, destinationEntity.longitude),
            waypoints: waypoints,
            travelMode: maps.TravelMode.DRIVING,
        };

        directionsService.route(request, (result, status) => {
            if (status === maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);

                const totalDistance = result.routes[0].legs.reduce(
                    (sum, leg) => sum + leg.distance.value,
                    0
                ) / 1000;
                const totalDuration = result.routes[0].legs.reduce(
                    (sum, leg) => sum + leg.duration.value,
                    0
                ) / 60;

                const fuelConsumptionPer100Km = 7;
                const fuelPricePerLitre = 1.8;
                const totalCost = (totalDistance / 100) * fuelConsumptionPer100Km * fuelPricePerLitre;

                const legs = result.routes[0].legs.map((leg) => ({
                    startAddress: leg.start_address,
                    endAddress: leg.end_address,
                    distance: leg.distance.text,
                    duration: leg.duration.text,
                }));

                setRouteInfo({
                    totalDistance,
                    totalDuration,
                    totalCost,
                    legs,
                });
            } else {
                console.error("Directions request failed due to", status);
            }
        });
    };

    const formatDuration = (durationInMinutes) => {
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        return `${hours} ώρες ${minutes} λεπτά`;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="plan-main-container">
            <div className="plan-header-container">
                <Header />
            </div>
            <div className="plan-content">
                <div className="plan-list">
                    <h3>{plan ? `Πλάνο: ${plan.title}` : "Loading Plan..."}</h3>
                    <TransitionGroup className="plan-record">
                        {plan?.plan?.map((entry, index) => {
                            const entity = getEntityDetails(entry.entity_id);
                            if (!entity) return null;
    
                            return (
                                <CSSTransition key={index} timeout={500} classNames="fade">
                                    <PlanRecord
                                        record={entry}
                                        entity={entity}
                                        onDelete={handleDelete}
                                        onUpdate={handleUpdate}
                                        onShowInstructions={(id) => {
                                            console.log("Οδηγίες για το entity:", id);
                                        }}
                                        planId={planId}
                                    />
                                </CSSTransition>
                            );
                        })}
                    </TransitionGroup>
                </div>
                <div className="plan-map">
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
                        }}
                        defaultZoom={10}
                        defaultCenter={{
                            lat: 40.0853,
                            lng: 22.3584,
                        }}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={handleApiLoaded}
                    />
                </div>
            </div>
            <div className="travel-info-container">
                <button onClick={calculateRoute} className="more-btn">
                    Υπολόγισε Διαδρομή
                </button>
                <div className="travel-info-cards">
                    <div className="travel-card">
                        <h4>Συνολική Απόσταση</h4>
                        <p>{routeInfo.totalDistance.toFixed(2)} km</p>
                    </div>
                    <div className="travel-card">
                        <h4>Συνολική Διάρκεια</h4>
                        <p>{formatDuration(routeInfo.totalDuration.toFixed(0))}</p>
                    </div>
    
                    <div className="travel-card">
                        <h4>Κόστος Διαδρομής</h4>
                        <p>{routeInfo.totalCost.toFixed(2)} €</p>
                    </div>
                    {routeInfo.legs.map((leg, index) => (
                        <div className="travel-card" key={index}>
                            <h4>Διαδρομή {index + 1}</h4>
                            <p>Από: {leg.startAddress}</p>
                            <p>Προς: {leg.endAddress}</p>
                            <p>Απόσταση: {leg.distance}</p>
                            <p>Διάρκεια: {leg.duration}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );    
}

export default PlanView;
