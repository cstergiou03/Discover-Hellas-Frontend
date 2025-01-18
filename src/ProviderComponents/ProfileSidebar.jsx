import React, { useEffect, useState } from "react";
import "../StyleProvider/profileSidebar.css";
import { jwtDecode } from 'jwt-decode';

function ProfileSidebar() {
    const [amenitiesCount, setAmenitiesCount] = useState(0);
    const [eventsCount, setEventsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");
    const [fullName, setFullName] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

    useEffect(() => {

        const token = sessionStorage.getItem("userToken");

        if (token) {
            try {
                // Αποκωδικοποιούμε το JWT token
                const decodedToken = jwtDecode(token);

                // Ρυθμίζουμε τα πεδία από το αποκωδικοποιημένο token
                const fullName = `${decodedToken.firstName} ${decodedToken.lastName}`; // Συνδυασμός firstName + lastName
                setFullName(fullName);
                setProfilePicture(
                    decodedToken.photo || "https://via.placeholder.com/150"
                );
                setUserId(decodedToken.userId);  // Βάζουμε το sub ως user_id
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }


        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch Amenities
                const amenitiesResponse = await fetch(
                    "https://olympus-riviera.onrender.com/api/amenity/get/all"
                );
                if (!amenitiesResponse.ok) {
                    throw new Error("Failed to fetch amenities data");
                }
                const amenitiesData = await amenitiesResponse.json();
                const filteredAmenities = amenitiesData.filter(
                    (item) => item.provider_id === userId
                );

                setAmenitiesCount(filteredAmenities.length);

                // Fetch Events
                const eventsResponse = await fetch(
                    "https://olympus-riviera.onrender.com/api/event/get/all"
                );
                if (!eventsResponse.ok) {
                    throw new Error("Failed to fetch events data");
                }
                const eventsData = await eventsResponse.json();
                const filteredEvents = eventsData.filter(
                    (item) => item.organizer_id === userId
                );

                setEventsCount(filteredEvents.length);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="profile-sidebar">
                <div className="profile-header">
                    <img
                        src={profilePicture} // Ενημέρωσε τη διαδρομή αν είναι διαφορετική
                        alt="Profile"
                        className="profile-photo"
                    />
                    <div className="profile-name">{fullName}</div>
                </div>

                {/* Εμφανίζουμε το υπόλοιπο UI χωρίς τα metrics */}
                <div>Loading data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-sidebar">
                <div className="profile-header">
                    <img
                        src={profilePicture} // Ενημέρωσε τη διαδρομή αν είναι διαφορετική
                        alt="Profile"
                        className="profile-photo"
                    />
                    <div className="profile-name">{fullName}</div>
                </div>

                {/* Εμφανίζουμε το μήνυμα λάθους */}
                <div>Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="profile-sidebar">
            <div className="profile-header">
                <img
                    src={profilePicture} // Ενημέρωσε τη διαδρομή αν είναι διαφορετική
                    alt="Profile"
                    className="profile-photo"
                />
                <div className="profile-name">{fullName}</div>
            </div>

            <div className="profile-metrics">
                <div className="metrics-item">
                    <span className="metrics-label">Amenities</span>
                    <span className="metrics-count">{amenitiesCount}</span>
                </div>
                <div className="metrics-item">
                    <span className="metrics-label">Events</span>
                    <span className="metrics-count">{eventsCount}</span>
                </div>
            </div>
        </div>
    );
}

export default ProfileSidebar;
