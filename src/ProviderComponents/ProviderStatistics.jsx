import React, { useState, useEffect } from "react";
import ProviderTable from "./ProviderTable";
import "../StyleProvider/providerStatistics.css";
import { jwtDecode } from 'jwt-decode';

function ProviderStatistics() {

    const [amenities, setAmenities] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("userToken");

        if (token) {
            try {
                
                const decodedToken = jwtDecode(token);

                setUserId(decodedToken.userId);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        fetch("https://olympus-riviera.onrender.com/api/amenity/get/all")
            .then((response) => response.json())
            .then((data) => {
                const filteredAmenities = data.filter((amenity) => amenity.provider_id === userId);
                setAmenities(filteredAmenities);
            })
            .catch((err) => {
                setError("Error fetching amenities: " + err.message);
            });

        fetch("https://olympus-riviera.onrender.com/api/event/get/all")
            .then((response) => response.json())
            .then((data) => {
                const filteredEvents = data.filter((event) => event.organizer_id === userId);
                setEvents(filteredEvents);
                setLoading(false);
            })
            .catch((err) => {
                setError("Error fetching events: " + err.message);
            });
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="provider-statistics">
            <div className="statistics-section">
                <h2>Amenities</h2>
                <ProviderTable data={amenities} dataType="amenity" />
            </div>

            <div className="statistics-section">
                <h2>Events</h2>
                <ProviderTable data={events} dataType="event" />
            </div>
        </div>
    );
}

export default ProviderStatistics;
