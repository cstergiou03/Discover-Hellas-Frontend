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
                const decodedToken = jwtDecode(token);
                const fullName = `${decodedToken.firstName} ${decodedToken.lastName}`;
                setFullName(fullName);
                setProfilePicture(
                    decodedToken.photo || "https://via.placeholder.com/150"
                );
                setUserId(decodedToken.userId);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (!userId) return;
    
        const fetchData = async () => {
            try {
                setLoading(true);
    
                // Fetch amenities data
                const amenityUrl =
                    "https://discover-hellas-springboot-backend.onrender.com/api/provider/amenity/get/all/" +
                    `${userId}` +
                    "?Authorization=Bearer%20" +
                    `${sessionStorage.getItem("userToken")}`;
                const amenitiesResponse = await fetch(amenityUrl);
    
                if (!amenitiesResponse.ok) {
                    setAmenitiesCount(0);
                } else {
                    const amenitiesData = await amenitiesResponse.json();
                    setAmenitiesCount(amenitiesData.length);
                }
            } catch (err) {
                console.error("Error fetching amenities:", err);
                setAmenitiesCount(0);
            }
    
            try {
                // Fetch events data
                const eventUrl =
                    "https://discover-hellas-springboot-backend.onrender.com/api/provider/event/get/all/" +
                    `${userId}` +
                    "?Authorization=Bearer%20" +
                    `${sessionStorage.getItem("userToken")}`;
                console.log(eventUrl);
                const eventsResponse = await fetch(eventUrl);
    
                if (!eventsResponse.ok) {
                    setEventsCount(0);
                } else {
                    const eventsData = await eventsResponse.json();
                    setEventsCount(eventsData.length);
                }
            } catch (err) {
                console.error("Error fetching events:", err);
                setEventsCount(0);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [userId]);    

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
