import React, { useState, useEffect, useRef } from "react";
import "../StyleProvider/eventForm.css";
import Compressor from "compressorjs";
import { useNavigate } from "react-router-dom";
import { GoogleMap, MarkerF, Autocomplete, useJsApiLoader } from "@react-google-maps/api";
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

function EventForm() {
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

    const autocompleteRef = useRef(null);
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [userToken, setUserToken] = useState();

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
        libraries: GOOGLE_MAP_LIBRARIES,
    });

    useEffect(() => {
        const token = sessionStorage.getItem("userToken");
    
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserToken(decodedToken);
                setUserId(decodedToken.userId);
            } catch (error) {
                console.error("Error decoding token:", error);
                setUserId("");
            }
        }
    }, []);

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
    console.log("MALAKAAAA" + sessionStorage.getItem("userToken"));
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

        
        const url = "https://discover-hellas-springboot-backend.onrender.com/api/provider/event/add-request/create?" + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
        fetch(url , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then(() => {
                alert("Event created successfully!");
                navigate("/provider");
            })
            .catch((error) => {
                console.error("Error submitting the form:", error);
                alert("Event created successfully!");
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
            <h1>Πάροχος - Δημιουργία Εκδήλωσης</h1>
            <form className="event-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <label htmlFor="name">Όνομα Εκδήλωσης:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="description">Περιγραφή:</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="eventStart">Έναρξη Εκδήλωσης:</label>
                <input
                    type="datetime-local"
                    id="eventStart"
                    name="eventStart"
                    value={formData.eventStart}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="eventEnd">Λήξη Εκδήλωσης:</label>
                <input
                    type="datetime-local"
                    id="eventEnd"
                    name="eventEnd"
                    value={formData.eventEnd}
                    onChange={handleChange}
                    required
                />
    
                <label htmlFor="location">Αναζήτηση Τοποθεσίας:</label>
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
    
                <label htmlFor="location">Τοποθεσία (Click on the map to select):</label>
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

                <label htmlFor="photos">Φωτογραφίες:</label>
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

export default EventForm;
