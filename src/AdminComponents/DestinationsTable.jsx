import React, { useState, useEffect } from "react";
import Records from "./Records";

function DestinationsTable() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch από το endpoint για να πάρουμε τους προορισμούς
        fetch("https://olympus-riviera.onrender.com/api/destination/get/all")
            .then((response) => response.json())
            .then((data) => {
                setDestinations(data);  // Αποθήκευση των δεδομένων στους προορισμούς
                setLoading(false);  // Ολοκληρώθηκε το φόρτωμα
            })
            .catch((error) => {
                setError(error);
                setLoading(false);  // Ολοκληρώθηκε το φόρτωμα με σφάλμα
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading destinations: {error.message}</div>;
    }

    return (
        <div className="destinations-table-container">
            <h2>Προορισμοί</h2>
            <div className="destinations-list">
                {destinations.map((destination) => (
                    <Records key={destination.destination_id} data={destination} />
                ))}
            </div>
        </div>
    );
}

export default DestinationsTable;
