import React, { useEffect, useState } from "react";
import "../StyleAdmin/profileSidebarAdmin.css";

function ProfileSidebarAdmin() {
    const [amenitiesCount, setAmenitiesCount] = useState(0);
    const [eventsCount, setEventsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
                setAmenitiesCount(amenitiesData.length);

                // Fetch Events
                const eventsResponse = await fetch(
                    "https://olympus-riviera.onrender.com/api/event/get/all"
                );
                if (!eventsResponse.ok) {
                    throw new Error("Failed to fetch events data");
                }
                const eventsData = await eventsResponse.json();
                setEventsCount(eventsData.length);

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
                        src="../../src/assets/profile.jpg" // Ενημέρωσε τη διαδρομή αν είναι διαφορετική
                        alt="Profile"
                        className="profile-photo"
                    />
                    <div className="profile-name">John Doe</div>
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
                        src="../../src/assets/profile.jpg" // Ενημέρωσε τη διαδρομή αν είναι διαφορετική
                        alt="Profile"
                        className="profile-photo"
                    />
                    <div className="profile-name">John Doe</div>
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
                    src="../../src/assets/profile.jpg" // Ενημέρωσε τη διαδρομή αν είναι διαφορετική
                    alt="Profile"
                    className="profile-photo"
                />
                <div className="profile-name">John Doe</div>
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

export default ProfileSidebarAdmin;
