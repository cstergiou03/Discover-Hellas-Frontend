import React, { useState, useEffect, useRef } from "react";
import "../StyleProvider/eventForm.css";
import Compressor from "compressorjs";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleMap, Autocomplete, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { jwtDecode } from "jwt-decode";

const GOOGLE_MAP_LIBRARIES = ["places"];

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 39.0742,
    lng: 21.8243,
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
    const [rejectionReason, setRejectionReason] = useState("");
    const [status, setStatus] = useState("");

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

        fetch(`https://discover-hellas-springboot-backend.onrender.com/api/event/get/${eventId}`)
            .then((response) => response.json())
            .then((data) => {
                // Convert ISO date strings to the proper format for datetime-local input
                setStatus(data.status);
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

                if(data.status === "REJECTED"){
                    const approvalUrl = `https://discover-hellas-springboot-backend.onrender.com/api/provider/approval/${eventId}/rejections/get/all?` + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
                    console.log(approvalUrl);
                        fetch(approvalUrl)
                            .then((response) => response.json())
                            .then((data) => {
                                const approvalData = data[0] || data;
                                setRejectionReason(approvalData.comments);
                            })
                }
            })
            .catch((error) => {
                console.error("Error fetching event data:", error);
            });
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
    
        if (name === "photos") {
            const newFiles = files ? Array.from(files) : [];
            setFormData((prevFormData) => ({
                ...prevFormData,
                photos: [...prevFormData.photos, ...newFiles],
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
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
                return;
            }
    
            const promises = files.map((file) => {
                // Check if the file is already a Base64 string or a URL
                if (typeof file === "string") {
                    // Skip processing and directly include the URL
                    return Promise.resolve(file);
                } else if (file instanceof File || file instanceof Blob) {
                    // Process the File or Blob object
                    return new Promise((resolve, reject) => {
                        new Compressor(file, {
                            quality: 0.7,
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
                } else {
                    return Promise.reject(new Error("Invalid file type"));
                }
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

        const url = "https://discover-hellas-springboot-backend.onrender.com/api/provider/event/edit-request/create/" + `${eventId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem("userToken")}`
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then(() => {
                alert("Event updated successfully!");
                navigate("/provider");
            })
            .catch((error) => {
                alert("Failed to update event.");
                navigate("/provider");
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
                            <MarkerF
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

                {status === "REJECTED" && (
                    <div className="rejection-reason">
                        <label htmlFor="rejectionReason">Λόγος Απόρριψης:</label>
                        <textarea
                            id="rejectionReason"
                            name="rejectionReason"
                            value={rejectionReason || "Δεν υπάρχει λόγος απόρριψης"}
                            readOnly
                        />
                    </div>
                )}

                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default EventEdit;
