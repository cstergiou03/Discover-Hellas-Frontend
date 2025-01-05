import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import Compressor from "compressorjs";
import "../StyleProvider/amenityForm.css";

function DestinationForm() {
    const [formData, setFormData] = useState({
        name: "",
        category_id: "",
        description: "",
        photos: "",
        latitude: 40.0853,
        longitude: 22.3584,
        link_360_view: "",
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const markerRef = useRef(null);

    const imageGalleryItems = formData.photos
        ? formData.photos.split(",").map((photo) => ({
              original: photo,
              thumbnail: photo,
          }))
        : [];

    useEffect(() => {
        // Ανάκτηση κατηγοριών για το dropdown
        fetch("https://olympus-riviera.onrender.com/api/admin/destination/category/get/all")
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
                            quality: 0.1,
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Αποστολή δεδομένων για δημιουργία νέου προορισμού
        fetch("https://olympus-riviera.onrender.com/api/admin/destination/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),  // Αποστολή των δεδομένων με το πεδίο photos που περιλαμβάνει τις φωτογραφίες σε Base64
        })
            .then((response) => response.json())
            .then(() => {
                alert("Destination saved successfully!");
                // navigate("/admin"); // Μπορείς να προσθέσεις και πλοήγηση αν χρειάζεται
            })
            .catch((error) => console.error(error));
    };

    if (loading) return <div>Loading...</div>;

    const handleLocationChange = ({ lat, lng }) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            latitude: lat,
            longitude: lng,
        }));
    };

    const handleApiLoaded = (map, maps) => {
        // No initial marker placement
        // Listen for map click to update the location
        map.addListener("click", (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            // Remove previous marker if exists
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }

            // Create a new marker for the new location
            const newMarker = new maps.Marker({
                position: { lat, lng },
                map,
                title: "Selected Location",
            });

            markerRef.current = newMarker;

            // Update form data with the new location
            handleLocationChange({ lat, lng });
        });
    };

    return (
        <div className="amenity-form-container">
            <h1>Add New Destination</h1>
            <form className="amenity-form" onSubmit={handleSubmit}>
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

                <label htmlFor="map">Location:</label>
                <div style={{ height: "400px", width: "100%" }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
                        }}
                        defaultCenter={{
                            lat: formData.latitude,
                            lng: formData.longitude,
                        }}
                        defaultZoom={9}
                        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                        yesIWantToUseGoogleMapApiInternals
                    />
                </div>

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
