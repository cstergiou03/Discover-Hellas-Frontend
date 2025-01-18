import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import Compressor from "compressorjs";
import "../StyleProvider/amenityForm.css";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAP_LIBRARIES = ["places"];

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 40.0853,
    lng: 22.3584,
};

function DestinationForm() {
    const [formData, setFormData] = useState({
        name: "",
        category_id: "",
        description: "",
        photos: "",
        latitude: null,
        longitude: null,
        link_360_view: "",
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const autocompleteRef = useRef(null);
    const navigate = useNavigate();

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
        libraries: GOOGLE_MAP_LIBRARIES,
    });

    useEffect(() => {
        // Ανάκτηση κατηγοριών για το dropdown

        fetch("https://olympus-riviera.onrender.com/api/destination/category/get/all")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    const handlePhotoChange = async (e) => {
        const files = Array.from(e.target.files);
        const base64Images = await Promise.all(
            files.map(
                (file) =>
                    new Promise((resolve, reject) => {
                        new Compressor(file, {
                            quality: 0.3,
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
                    })
            )
        );

        setFormData((prev) => ({
            ...prev,
            photos: prev.photos ? `${prev.photos},${base64Images.join(",")}` : base64Images.join(","),
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Αποστολή δεδομένων για δημιουργία νέου προορισμού
        const url = "https://olympus-riviera.onrender.com/api/admin/destination/create?" + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
        fetch(url , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),  // Αποστολή των δεδομένων με το πεδίο photos που περιλαμβάνει τις φωτογραφίες σε Base64
        })
            .then((response) => response.json())
            .then(() => {
                alert("Destination saved successfully!");
                navigate("/admin");
            })
            .catch((error) => {
                alert("Destination saved successfully!");
                navigate("/admin");
            });
    };

    if (loading) return <div>Loading...</div>;

    

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
        }
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded || loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="amenity-form-container">
            <h1>Add New Destination</h1>
            <form className="amenity-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <label htmlFor="name">Destination Name:</label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <label htmlFor="category">Category:</label>
                <select
                    id="category"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />

                <label htmlFor="location">Search Location:</label>
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

                <label htmlFor="360Link">360 Link:</label>
                <input
                    type="url"
                    id="360Link"
                    value={formData.link_360_view}
                    onChange={(e) => setFormData({ ...formData, link_360_view: e.target.value })}
                />

                <label htmlFor="photos">Photos:</label>
                <input type="file" multiple onChange={handlePhotoChange} />

                <button className="more-btn" type="submit">
                    Add Destination
                </button>
            </form>
        </div>
    );
}

export default DestinationForm;
