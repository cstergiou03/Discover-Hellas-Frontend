import React, { useState, useEffect, useRef } from "react";
import "../StyleProvider/eventForm.css";
import Compressor from "compressorjs";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { jwtDecode } from "jwt-decode";

const GOOGLE_MAP_LIBRARIES = ["places"];

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 40.0853,
    lng: 22.3584,
};

function EventEdit() {
    const { eventId } = useParams(); // Get the eventId from the URL
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        siteLink: "",
        phone: "",
        email: "",
        photos: [],
        latitude: null,
        longitude: null,
        eventStart: "",
        eventEnd: "",
    });
    const autocompleteRef = useRef(null);
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
        libraries: GOOGLE_MAP_LIBRARIES,
    });

    useEffect(() => {
        const token = sessionStorage.getItem("userToken");
            
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.userId);
            } catch (error) {
                console.error("Error decoding token:", error);
                setUserId(""); // set empty or handle error state
            }
        }

        fetch(`https://olympus-riviera.onrender.com/api/event/get/${eventId}`)
            .then((response) => response.json())
            .then((data) => {
                // Convert ISO date strings to the proper format for datetime-local input
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    return date.toISOString().slice(0, 16); // Get the date in 'YYYY-MM-DDTHH:MM' format
                };

                setFormData({
                    name: data.name,
                    description: data.description,
                    location: data.location,
                    siteLink: data.siteLink,
                    phone: data.phone,
                    email: data.email,
                    photos: data.photos ? data.photos.split(",") : [],
                    latitude: data.latitude,
                    longitude: data.longitude,
                    eventStart: formatDate(data.event_start),
                    eventEnd: formatDate(data.event_end),
                });

                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching event data:", error);
                setIsLoading(false);
            });
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? Array.from(files) : value,
        });
    };

    const handlePlaceSelected = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const { lat, lng } = place.geometry.location;
            setFormData((prevFormData) => ({
                ...prevFormData,
                latitude: lat(),
                longitude: lng(),
                location: place.formatted_address || "",
            }));
        }
    };

    const convertImagesToBase64 = (files) => {
        return new Promise((resolve, reject) => {
            if (!files || files.length === 0) {
                resolve("");
            }

            const promises = files.map((file) => {
                return new Promise((resolve, reject) => {
                    new Compressor(file, {
                        quality: 0.8,
                        success(result) {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(result);
                        },
                        error(err) {
                            reject(err);
                        },
                    });
                });
            });

            Promise.all(promises)
                .then((base64Images) => resolve(base64Images.join(",")))
                .catch(reject);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const photosBase64 = await convertImagesToBase64(formData.photos);
        if (!photosBase64) {
            alert("Please upload at least one photo.");
            return;
        }

        const payload = {
            name: formData.name,
            organizer_id: userId,
            phone: formData.phone,
            email: formData.email,
            event_start: formData.eventStart,
            event_end: formData.eventEnd,
            latitude: formData.latitude,
            longitude: formData.longitude,
            description: formData.description,
            siteLink: formData.siteLink,
            photos: photosBase64,
        };

        fetch(`https://olympus-riviera.onrender.com/api/provider/event/${eventId}/update`, {
            method: "PUT", // Use PUT for updating the event
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then(() => {
                alert("Event updated successfully!");
                navigate("/provider"); // Navigate back to the provider's dashboard
            })
            .catch((error) => {
                console.error("Error submitting the form:", error);
                alert("Failed to update event.");
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
        }
    };

    return (
        <div className="event-form-container">
            <h1>Edit Event</h1>
            <form className="event-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Event Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="eventStart">Event Start:</label>
                <input
                    type="datetime-local"
                    id="eventStart"
                    name="eventStart"
                    value={formData.eventStart}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="eventEnd">Event End:</label>
                <input
                    type="datetime-local"
                    id="eventEnd"
                    name="eventEnd"
                    value={formData.eventEnd}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="location">Search for a Location:</label>
                {isLoaded ? (
                    <Autocomplete
                        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                        onPlaceChanged={handlePlaceSelected}
                    >
                        <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Search location..."
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </Autocomplete>
                ) : (
                    <p>Loading maps...</p>
                )}
    
                <label htmlFor="location">Location (Click on the map to select):</label>
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={{
                            lat: parseFloat(formData.latitude) || defaultCenter.lat,
                            lng: parseFloat(formData.longitude) || defaultCenter.lng,
                        }}
                        zoom={9}
                    >
                        {formData.latitude && formData.longitude && (
                            <Marker
                                position={{ lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }}
                            />
                        )}
                    </GoogleMap>
                ) : (
                    <p>Loading maps...</p>
                )}
                <label htmlFor="siteLink">Website Link:</label>
                <input
                    type="url"
                    id="siteLink"
                    name="siteLink"
                    value={formData.siteLink}
                    onChange={handleChange}
                />

                <label htmlFor="phone">Phone:</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="photos">Photos:</label>
                <input
                    type="file"
                    id="photos"
                    name="photos"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                />

                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default EventEdit;
