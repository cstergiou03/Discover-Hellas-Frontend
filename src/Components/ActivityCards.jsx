import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { jwtDecode } from 'jwt-decode';
import "../Style/destinationCards.css";

function ActivityCards() {
    const [userId, setUserId] = useState(null);
    const [hobbies, setHobbies] = useState([]); // Renamed preferences to hobbies
    const [activities, setActivities] = useState([]); // Renamed destinations to activities
    const navigate = useNavigate(); // Initialize navigate

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
            // Φέρνουμε τα hobbies του χρήστη
            fetch(`https://olympus-riviera.onrender.com/api/user/${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem("userToken")}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch user hobbies");
                    }
                    return response.json();
                })
                .then((userData) => {
                    const userHobbies = userData.preferences[0]?.Hobbies || []; // Renamed DestinationCategories to Hobbies
                    setHobbies(userHobbies);
                })
                .catch((error) => console.error("Error fetching user hobbies:", error));
        }
    }, [userId]);

    useEffect(() => {
        const fetchActivities = async () => {
            const fetchedActivities = [];

            if (hobbies.length > 0) {
                // Φέρνουμε activities για κάθε hobby και κρατάμε ένα τυχαίο
                const hobbyActivities = await Promise.all(
                    hobbies.map(async (hobbyId) => {
                        try {
                            const response = await fetch(`https://olympus-riviera.onrender.com/api/activity/${hobbyId}/activities`);
                            if (!response.ok) {
                                throw new Error(`Failed to fetch activities for hobby ${hobbyId}`);
                            }
                            const activities = await response.json();
                            // Επιλέγουμε τυχαία ένα activity από κάθε hobby
                            if (activities.length > 0) {
                                return activities[Math.floor(Math.random() * activities.length)];
                            }
                            return null;
                        } catch (error) {
                            console.error(`Error fetching activities for hobby ${hobbyId}:`, error);
                            return null;
                        }
                    })
                );
                fetchedActivities.push(...hobbyActivities.filter(Boolean));
            }

            // Αν οι προτάσεις είναι λιγότερες από 3, φέρνουμε τυχαία από όλα τα activities
            if (fetchedActivities.length < 3) {
                try {
                    const response = await fetch("https://olympus-riviera.onrender.com/api/activity/get/all");
                    if (!response.ok) {
                        throw new Error("Failed to fetch all activities");
                    }
                    const allActivities = await response.json();
                    // Επιλέγουμε τυχαία activities για να συμπληρώσουμε την τριάδα
                    while (fetchedActivities.length < 3 && allActivities.length > 0) {
                        const randomIndex = Math.floor(Math.random() * allActivities.length);
                        fetchedActivities.push(allActivities.splice(randomIndex, 1)[0]);
                    }
                } catch (error) {
                    console.error("Error fetching all activities:", error);
                }
            }

            setActivities(fetchedActivities);
        };

        fetchActivities();
    }, [hobbies]);

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

    // Function to handle card click and navigate to activity page
    const handleCardClick = (activityId) => {
        navigate(`/activity/${activityId}`); // Navigate to activity page with activityId
    };

    return (
        <div>
            {/* Τίτλος */}
            <h1 className="destination-title">Προτάσεις Δραστηριοτήτων</h1>

            {/* Κάρτες Δραστηριοτήτων */}
            <div className="destination-cards-container">
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <div 
                            key={activity.activity_id} 
                            className="destination-card" 
                            onClick={() => handleCardClick(activity.activity_id)} // Add click handler
                        >
                            <img
                                src={getFirstImage(activity.photos)} // Use the getFirstImage function
                                alt={activity.name}
                                className="destination-image"
                            />
                            <h2 className="destination-name">{activity.name}</h2>
                        </div>
                    ))
                ) : (
                    <p>Δεν υπάρχουν διαθέσιμες προτάσεις για εσάς.</p>
                )}
            </div>
        </div>
    );
}

export default ActivityCards;
