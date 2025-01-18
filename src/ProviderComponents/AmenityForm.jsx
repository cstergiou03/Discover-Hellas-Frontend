import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import Compressor from "compressorjs";
import "../StyleProvider/amenityForm.css";
import { jwtDecode } from "jwt-decode";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 40.0853,
    lng: 22.3584,
};

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
    const autocompleteRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
        libraries: ["places"],
    });

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

        fetch("https://olympus-riviera.onrender.com/api/amenity/category/get/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Error fetching categories:", error));
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
            provider_id: userId,
            phone: formData.phone,
            email: formData.email,
            latitude: formData.latitude,
            longitude: formData.longitude,
            description: formData.description,
            photos: photosBase64,
        };

        let apiUrl = "";
        if (location.pathname.includes("/admin/create-amenity")) {
            apiUrl = "https://olympus-riviera.onrender.com/api/admin/amenity/create?" + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`;
        } else {
            apiUrl = "https://olympus-riviera.onrender.com/api/provider/amenity/add-request/create?" + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`;
        }

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem('userToken')}`,
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then(() => {
                alert("Amenity processed successfully!");
                navigate(location.pathname.includes("/admin") ? "/admin" : "/provider");
            })
            .catch((error) => {
                console.error("Error:", error);
                navigate(location.pathname.includes("/admin") ? "/admin" : "/provider");
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
        }
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="amenity-form-container">
            <h1>{location.pathname.includes("/admin") ? "Admin - Create Amenity" : "Provider - Create Amenity"}</h1>
            <form className="amenity-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
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

                <label htmlFor="location">Search for a Location:</label>
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

                <label htmlFor="location">Location: </label>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{
                        lat: parseFloat(formData.latitude) || defaultCenter.lat,
                        lng: parseFloat(formData.longitude) || defaultCenter.lng,
                    }}
                    zoom={9}
                >
                    {formData.latitude && formData.longitude && (
                        <Marker position={{ lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }} />
                    )}
                </GoogleMap>
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
