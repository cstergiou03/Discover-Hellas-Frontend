import React, { useState, useEffect } from "react";
import ProviderTable from "./ProviderTable";
import "../StyleProvider/providerStatistics.css";

function ProviderStatistics() {

    const providerId = "provider123"; // Ο providerId μας

    const [amenities, setAmenities] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Φορτώνουμε τα δεδομένα από την API
    useEffect(() => {
        // Φέρνουμε τα amenities
        fetch("https://olympus-riviera.onrender.com/api/admin/amenity/get/all")
            .then((response) => response.json())
            .then((data) => {
                // Φιλτράρουμε τα amenities με βάση το providerId
                const filteredAmenities = data.filter((amenity) => amenity.provider_id === providerId);
                setAmenities(filteredAmenities); // Αποθήκευση των φιλτραρισμένων δεδομένων των amenities
            })
            .catch((err) => {
                setError("Error fetching amenities: " + err.message);
            });

        // Φέρνουμε τα events
        fetch("https://olympus-riviera.onrender.com/api/admin/event/get/all")
            .then((response) => response.json())
            .then((data) => {
                // Φιλτράρουμε τα events με βάση το organizerId
                const filteredEvents = data.filter((event) => event.organizer_id === providerId);
                setEvents(filteredEvents); // Αποθήκευση των φιλτραρισμένων δεδομένων των events
                setLoading(false); // Ενημερώνουμε ότι τελειώσαμε με τη φόρτωση
            })
            .catch((err) => {
                setError("Error fetching events: " + err.message);
            });
    }, [providerId]); // Προσθήκη εξάρτησης από το providerId

    // Έλεγχος για αν φορτώνονται τα δεδομένα ή αν υπάρχει σφάλμα
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="provider-statistics">
            <h2>Amenities</h2>
            <ProviderTable data={amenities} dataType="amenity" />
            
            <h2>Events</h2>
            <ProviderTable data={events} dataType="event" />
        </div>
    );
}

export default ProviderStatistics;
