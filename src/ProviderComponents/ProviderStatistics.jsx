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
    }, [userId])

    useEffect(() => {
        if (!userId) return;
    
        const amenityUrl = "https://discover-hellas-springboot-backend.onrender.com/api/provider/amenity/get/all/" + `${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`;
        fetch(amenityUrl)
            .then((response) => response.json())
            .then((data) => {
                setAmenities(data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Error fetching amenities: " + err.message);
            });
    
        const eventUrl = "https://discover-hellas-springboot-backend.onrender.com/api/provider/event/get/all/" + `${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`;
        fetch(eventUrl)
            .then((response) => response.json())
            .then((data) => {
                setEvents(data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Error fetching events: " + err.message);
            });
    }, [userId]);    

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>{error}</div>;
    // }

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
