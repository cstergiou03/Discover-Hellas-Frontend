import React, { useState, useEffect, useRef } from "react";
import "../StyleProvider/amenityForm.css";
import GoogleMapReact from 'google-map-react';
import Compressor from 'compressorjs'; // Εισάγουμε τη βιβλιοθήκη
import { useNavigate } from 'react-router-dom'; // Εισάγουμε το useNavigate

function AmenityForm() {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        location: "",
        website: "",
        phone: "",
        email: "",
        photos: "", // Αλλάξαμε το photos σε string
        latitude: null,
        longitude: null,
    });

    const [categories, setCategories] = useState([]);
    const markerRef = useRef(null);
    const navigate = useNavigate(); // Δημιουργούμε το navigate

    useEffect(() => {
        fetch("https://olympus-riviera.onrender.com/api/amenity/category/get/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => setCategories(data))
        .catch((error) => {
            console.error("Error fetching categories:", error);
        });
    }, []);

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

    const handleApiLoaded = (map, maps) => {
        map.addListener("click", (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            console.log("Latitude:", lat, "Longitude:", lng);

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

    // Τροποποιημένη συνάρτηση για συμπίεση και μετατροπή σε Base64
    const convertImagesToBase64 = (files) => {
        return new Promise((resolve, reject) => {
            if (!files || files.length === 0) {
                resolve(""); // Επιστρέφουμε άδειο string αν δεν υπάρχουν αρχεία
            }

            const promises = [];
            files.forEach(file => {
                promises.push(
                    new Promise((resolve, reject) => {
                        new Compressor(file, {
                            quality: 1, // Εδώ ορίζουμε το ποσοστό συμπίεσης (π.χ., 60%)
                            success(result) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    resolve(reader.result); // Επιστρέφουμε το Base64 της συμπιεσμένης εικόνας
                                };
                                reader.onerror = reject;
                                reader.readAsDataURL(result); // Διαβάζουμε το αρχείο ως Base64
                            },
                            error(err) {
                                reject(err);
                            }
                        });
                    })
                );
            });

            Promise.all(promises)
                .then(base64Images => resolve(base64Images.join(','))) // Ενώνουμε τα Base64 σε μία συμβολοσειρά με κόμμα
                .catch(reject);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Μετατροπή των φωτογραφιών σε Base64
        const photosBase64 = await convertImagesToBase64(formData.photos);
        console.log("Base64 Photos:", photosBase64);

        // Αν δεν έχουμε φωτογραφίες, επιστρέφουμε
        if (!photosBase64) {
            alert("Please upload at least one photo.");
            return;
        }

        // Δημιουργία του payload για το POST
        const payload = {
            name: formData.name,
            category_id: formData.category,
            provider_id: "provider123",
            phone: formData.phone,
            email: formData.email,
            latitude: formData.latitude,
            longitude: formData.longitude,
            description: formData.description,
            photos: photosBase64, // Στέλνουμε την ενιαία συμβολοσειρά Base64 φωτογραφιών
        };

        console.log("Payload to send:", payload);

        fetch("https://olympus-riviera.onrender.com/api/provider/amenity/add-request/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response from server:", data);
            alert("Amenity created successfully!");
            navigate("/provider"); // Πλοήγηση στην σελίδα /provider μετά την επιτυχία
        })
        .catch(error => {
            console.error("Error submitting the form:", error);
            navigate("/provider");
        });        
    };

    return (
        <div className="amenity-form-container">
            <h1>Create a New Amenity</h1>
            <form className="amenity-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Amenity Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="category">Category:</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="location">Location (Click on the map to select):</label>
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

                <label htmlFor="website">Website:</label>
                <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
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

export default AmenityForm;
