import React, { useState, useEffect, useRef } from "react";
import "../StyleProvider/amenityForm.css";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleMap, MarkerF, Autocomplete, useJsApiLoader } from "@react-google-maps/api";

// Σταθερή μεταβλητή για τις βιβλιοθήκες του Google Maps
const GOOGLE_MAP_LIBRARIES = ["places"];

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 39.0742,
    lng: 21.8243,
};

function AmenityEdit() {
    const { amenityId } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        location: "",
        phone: "",
        email: "",
        photos: [],
        latitude: null,
        longitude: null,
    });
    const [initialFormData, setInitialFormData] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const autocompleteRef = useRef(null);
    const navigate = useNavigate();
    const [rejectionReason, setRejectionReason] = useState("");
    const [status, setStatus] = useState("");

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
        libraries: GOOGLE_MAP_LIBRARIES,
    });

    useEffect(() => {
        // Fetch categories
        fetch("https://olympus-riviera.onrender.com/api/amenity/category/get/all")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Error fetching categories:", error));

        // Fetch amenity data
        fetch(`https://olympus-riviera.onrender.com/api/amenity/get/${amenityId}`)
            .then((response) => response.json())
            .then((data) => {
                setStatus(data.status);
                const initialData = {
                    name: data.name,
                    category: data.category_id,
                    description: data.description,
                    phone: data.phone || "",
                    email: data.email || "",
                    photos: data.photos ? data.photos.split(",") : [],
                    latitude: data.latitude,
                    longitude: data.longitude,
                    location: data.location || "",
                };

                setFormData(initialData);
                setInitialFormData(initialData);

                if(data.status === "REJECTED"){
                    const approvalUrl = `https://olympus-riviera.onrender.com/api/provider/approval/${amenityId}/rejections/get/all?` + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
                    console.log(approvalUrl);
                        fetch(approvalUrl)
                            .then((response) => response.json())
                            .then((data) => {
                                const approvalData = data[0] || data;
                                setRejectionReason(approvalData.comments);
                            })
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching amenity data:", error);
                setLoading(false);
            });
    }, [amenityId]);

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

        const changedFields = {};
        for (const key in formData) {
            if (formData[key] !== initialFormData[key]) {
                changedFields[key] = formData[key];
            }
        }

        if (Object.keys(changedFields).length === 0) {
            alert("No changes detected.");
            return;
        }

        const payload = {
            amenity_id: amenityId,
            ...changedFields,
        };

        const url = "https://olympus-riviera.onrender.com/api/provider/amenity/edit-request/create/" + `${amenityId}?` + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
        fetch(url , {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("Amenity updated successfully!");
                navigate("/provider");
            })
            .catch((error) => {
                console.error("Error submitting the form:", error);
                navigate("/provider");
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

    if (!isLoaded || loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="amenity-form-container">
            <h1>Edit Amenity</h1>
            <form className="amenity-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <label htmlFor="name">Amenity Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />

                <label htmlFor="category">Category:</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange}>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} />

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

                <label htmlFor="location">Location (Click on the map to select):</label>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{
                        lat: parseFloat(formData.latitude) || defaultCenter.lat,
                        lng: parseFloat(formData.longitude) || defaultCenter.lng,
                    }}
                    zoom={9}
                >
                    {formData.latitude && formData.longitude && (
                        <MarkerF position={{ lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }} />
                    )}
                </GoogleMap>

                <label htmlFor="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />

                <label htmlFor="photos">Photos:</label>
                <input type="file" id="photos" name="photos" accept="image/*" multiple onChange={handleChange} />

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

                <button type="submit" className="submit-button">Update Amenity</button>
            </form>
        </div>
    );
}

export default AmenityEdit;
