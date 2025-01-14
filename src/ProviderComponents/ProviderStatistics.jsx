import React, { useState, useEffect } from "react";
import ProviderTable from "./ProviderTable";
import "../StyleProvider/providerStatistics.css";

function ProviderStatistics() {
    const providerId = "provider123"; // Ο providerId μας

    const [amenities, setAmenities] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("https://olympus-riviera.onrender.com/api/admin/amenity/get/all")
            .then((response) => response.json())
            .then((data) => {
                const filteredAmenities = data.filter((amenity) => amenity.provider_id === providerId);
                setAmenities(filteredAmenities);
            })
            .catch((err) => {
                setError("Error fetching amenities: " + err.message);
            });

        fetch("https://olympus-riviera.onrender.com/api/admin/event/get/all")
            .then((response) => response.json())
            .then((data) => {
                const filteredEvents = data.filter((event) => event.organizer_id === providerId);
                setEvents(filteredEvents);
                setLoading(false);
            })
            .catch((err) => {
                setError("Error fetching events: " + err.message);
            });
    }, [providerId]);

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
