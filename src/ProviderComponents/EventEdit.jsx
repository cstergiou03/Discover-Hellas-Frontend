import React, { useState, useEffect, useRef } from "react";
import "../StyleProvider/eventForm.css";
import GoogleMapReact from 'google-map-react';
import Compressor from 'compressorjs';
import { useNavigate, useParams } from 'react-router-dom';

function EventEdit() {
    const { eventId } = useParams();  // Get the eventId from the URL
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        siteLink: "",
        phone: "",
        email: "",
        photos: "",
        latitude: null,
        longitude: null,
        eventStart: "",
        eventEnd: "",
    });
    const [destinations, setDestinations] = useState([]);
    const [isCustomLocation, setIsCustomLocation] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const markerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch destinations list
        fetch("https://olympus-riviera.onrender.com/api/destination/get/all")
            .then(response => response.json())
            .then(data => setDestinations(data))
            .catch(error => console.error("Error fetching destinations:", error));

        // Fetch event data using the provided eventId
        fetch(`https://olympus-riviera.onrender.com/api/event/get/${eventId}`)
            .then(response => response.json())
            .then(data => {
                // Convert ISO date strings to the proper format for datetime-local input
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    return date.toISOString().slice(0, 16);  // Get the date in 'YYYY-MM-DDTHH:MM' format
                };

                setFormData({
                    name: data.name,
                    description: data.description,
                    location: data.location,
                    siteLink: data.siteLink,
                    phone: data.phone,
                    email: data.email,
                    photos: data.photos ? data.photos.split(',') : [],
                    latitude: data.latitude,
                    longitude: data.longitude,
                    eventStart: formatDate(data.event_start),  // Convert event_start to the correct format
                    eventEnd: formatDate(data.event_end),      // Convert event_end to the correct format
                });
                // Determine if location is custom based on the latitude and longitude
                setIsCustomLocation(data.latitude && data.longitude);
                setIsLoading(false);
            })
            .catch(error => {
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

    const handleLocationChange = ({ lat, lng }) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            latitude: lat,
            longitude: lng,
        }));
    };

    const handleDestinationChange = (e) => {
        const selectedDestinationName = e.target.value;
        const selectedDestination = destinations.find(
            (destination) => destination.name === selectedDestinationName
        );

        if (selectedDestination) {
            setFormData({
                ...formData,
                location: selectedDestination.name,
                latitude: parseFloat(selectedDestination.latitude),
                longitude: parseFloat(selectedDestination.longitude),
            });
        }
    };

    const handleApiLoaded = (map, maps) => {
        map.addListener("click", (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            if (markerRef.current) {
                markerRef.current.setMap(null);
            }

            const newMarker = new maps.Marker({
                position: { lat, lng },
                map,
                title: "Selected Location",
            });

            markerRef.current = newMarker;
            handleLocationChange({ lat, lng });
        });
    };

    const convertImagesToBase64 = (files) => {
        return new Promise((resolve, reject) => {
            if (!files || files.length === 0) {
                resolve("");
            }

            const promises = [];
            files.forEach(file => {
                promises.push(
                    new Promise((resolve, reject) => {
                        new Compressor(file, {
                            quality: 0.6,
                            success(result) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    resolve(reader.result);
                                };
                                reader.onerror = reject;
                                reader.readAsDataURL(result);
                            },
                            error(err) {
                                reject(err);
                            }
                        });
                    })
                );
            });

            Promise.all(promises)
                .then(base64Images => resolve(base64Images.join(',')))
                .catch(reject);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const photosBase64 = await convertImagesToBase64(formData.photos);
        console.log("Base64 Photos:", photosBase64);

        if (!photosBase64) {
            alert("Please upload at least one photo.");
            return;
        }

        const payload = {
            name: formData.name,
            organizer_id: "provider123",  // Assuming this is the logged-in provider's ID
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

        console.log("Payload to send:", payload);

        fetch(`https://olympus-riviera.onrender.com/api/provider/event/${eventId}/update`, {
            method: "PUT",  // Use PUT for updating the event
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Response from server:", data);
                alert("Event updated successfully!");
                navigate("/provider");  // Navigate back to the provider's dashboard
            })
            .catch(error => {
                console.error("Error submitting the form:", error);
                alert("Failed to update event.");
            });
    };

    if (isLoading) {
        return <div>Loading...</div>;  // Display loading message until data is ready
    }

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

                <label htmlFor="customLocation">Custom Location:</label>
                <select
                    id="customLocation"
                    name="customLocation"
                    value={isCustomLocation ? "Ναι" : "Όχι"}
                    onChange={(e) => setIsCustomLocation(e.target.value === "Ναι")}
                >
                    <option value="Όχι">Όχι</option>
                    <option value="Ναι">Ναι</option>
                </select>

                {!isCustomLocation && (
                    <>
                        <label htmlFor="location">Location (Select from Dropdown):</label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleDestinationChange}
                            required
                        >
                            <option value="">Select a location</option>
                            {destinations.map((destination) => (
                                <option
                                    key={destination.destination_id}
                                    value={destination.name}
                                >
                                    {destination.name}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {isCustomLocation && (
                    <div style={{ height: '500px', width: '100%' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{
                                key: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
                            }}
                            defaultCenter={{
                                lat: 40.0853,
                                lng: 22.3584,
                            }}
                            defaultZoom={9}
                            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                            yesIWantToUseGoogleMapApiInternals
                        />
                    </div>
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

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default EventEdit;
