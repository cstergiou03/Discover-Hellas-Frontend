import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import "../Style/destinationCards.css";
import { useNavigate } from 'react-router-dom';

function DestinationCards() {
    const [userId, setUserId] = useState(null);
    const [preferences, setPreferences] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Παίρνουμε το JWT token από το sessionStorage
        const token = sessionStorage.getItem("userToken");

        if (token) {
            try {
                // Αποκωδικοποιούμε το JWT token
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.userId); // Ρυθμίζουμε το userId
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            // Φέρνουμε τα preferences του χρήστη
            fetch(`https://discover-hellas-springboot-backend.onrender.com/api/user/${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem("userToken")}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch user preferences");
                    }
                    return response.json();
                })
                .then((userData) => {
                    const userPreferences = userData.preferences[0]?.DestinationCategories || [];
                    setPreferences(userPreferences);
                })
                .catch((error) => console.error("Error fetching user preferences:", error));
        }
    }, [userId]);

    useEffect(() => {
        const fetchDestinations = async () => {
            const fetchedDestinations = [];

            if (preferences.length > 0) {
                // Φέρνουμε destinations για κάθε κατηγορία και κρατάμε ένα τυχαίο
                const categoryDestinations = await Promise.all(
                    preferences.map(async (categoryId) => {
                        try {
                            const response = await fetch(`https://discover-hellas-springboot-backend.onrender.com/api/destination/${categoryId}/destinations`);
                            if (!response.ok) {
                                throw new Error(`Failed to fetch destinations for category ${categoryId}`);
                            }
                            const destinations = await response.json();
                            // Επιλέγουμε τυχαία ένα destination από κάθε κατηγορία
                            if (destinations.length > 0) {
                                return destinations[Math.floor(Math.random() * destinations.length)];
                            }
                            return null;
                        } catch (error) {
                            console.error(`Error fetching destinations for category ${categoryId}:`, error);
                            return null;
                        }
                    })
                );
                fetchedDestinations.push(...categoryDestinations.filter(Boolean));
            }

            // Αν οι προτάσεις είναι λιγότερες από 3, φέρνουμε τυχαία από όλα τα destinations
            if (fetchedDestinations.length < 3) {
                try {
                    const response = await fetch("https://discover-hellas-springboot-backend.onrender.com/api/destination/get/all");
                    if (!response.ok) {
                        throw new Error("Failed to fetch all destinations");
                    }
                    const allDestinations = await response.json();
                    // Επιλέγουμε τυχαία προορισμούς για να συμπληρώσουμε την τριάδα
                    while (fetchedDestinations.length < 3 && allDestinations.length > 0) {
                        const randomIndex = Math.floor(Math.random() * allDestinations.length);
                        fetchedDestinations.push(allDestinations.splice(randomIndex, 1)[0]);
                    }
                } catch (error) {
                    console.error("Error fetching all destinations:", error);
                }
            }

            setDestinations(fetchedDestinations);
        };

        fetchDestinations();
    }, [preferences]);

    // Function to get the first image from base64 data
    const getFirstImage = (photos) => {
        if (!photos) return "/placeholder.svg?height=200&width=300";

        if (photos.includes("data:image/jpeg;base64,")) {
            const photosArray = photos
                .split("data:image/jpeg;base64,")
                .filter((photo) => photo.trim() !== "")
                .map((photo) => "data:image/jpeg;base64," + photo.trim().replace(/,$/, ""));
            return photosArray[0]; // Return the first base64 image
        }

        return photos.split(",")[0]?.trim(); // Return the first regular image URL
    };

    const handleCardClick = (destinationId) => {
        navigate(`/destination/${destinationId}`); // Navigate to activity page with activityId
    };

    return (
        <div>
            {/* Τίτλος */}
            <h1 className="destination-title">Προτάσεις Προορισμών</h1>

            {/* Κάρτες Προορισμών */}
            <div className="destination-cards-container">
                {destinations.length > 0 ? (
                    destinations.map((destination) => (
                        <div 
                            key={destination.destination_id} 
                            className="destination-card"
                            onClick={() => handleCardClick(destination.destination_id)}
                            >
                            <img
                                src={getFirstImage(destination.photos)} // Use the getFirstImage function
                                alt={destination.name}
                                className="destination-image"
                            />
                            <h2 className="destination-name">{destination.name}</h2>
                        </div>
                    ))
                ) : (
                    <p>Δεν υπάρχουν διαθέσιμες προτάσεις για εσάς.</p>
                )}
            </div>
        </div>
    );
}

export default DestinationCards;
