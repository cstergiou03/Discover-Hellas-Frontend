import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Εισάγουμε useLocation και useNavigate
import GoogleMapReact from "google-map-react";
import Compressor from "compressorjs";
import "../StyleProvider/amenityForm.css";

function AmenityForm() {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        location: "",
        website: "",
        phone: "",
        email: "",
        photos: "",
        latitude: null,
        longitude: null,
    });

    const [categories, setCategories] = useState([]);
    const markerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation(); // Λαμβάνουμε το τρέχον URL

    useEffect(() => {
        fetch("https://olympus-riviera.onrender.com/api/amenity/category/get/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => setCategories(data))
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
            category_id: formData.category,
            provider_id: "provider123", // Dummy provider ID for now
            phone: formData.phone,
            email: formData.email,
            latitude: formData.latitude,
            longitude: formData.longitude,
            description: formData.description,
            photos: photosBase64,
        };
    
        let apiUrl = "";
        if (location.pathname.includes("/admin/create-amenity")) {
            apiUrl = "https://olympus-riviera.onrender.com/api/admin/amenity/create";
        } else {
            apiUrl = "https://olympus-riviera.onrender.com/api/provider/amenity/add-request/create";
        }
    
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("Amenity processed successfully!");
                if (location.pathname.includes("/admin")) {
                    navigate("/admin"); // Redirect admin to /admin
                } else {
                    navigate("/provider"); // Redirect provider to /provider
                }
            })
            .catch((error) => {
                if (location.pathname.includes("/admin")) {
                    navigate("/admin"); // Redirect admin to /admin
                } else {
                    navigate("/provider"); // Redirect provider to /provider
                }
            });
    };    

    return (
        <div className="amenity-form-container">
            <h1>{location.pathname.includes("/admin") ? "Admin - Create Amenity" : "Provider - Create Amenity"}</h1>
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
                <div style={{ height: "500px", width: "100%" }}>
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

export default AmenityForm;
