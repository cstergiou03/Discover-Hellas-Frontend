import React, { useState, useEffect } from "react";
import "../StyleProvider/amenityForm.css";
import GoogleMapReact from "google-map-react";
import Compressor from "compressorjs";
import { useNavigate, useParams } from "react-router-dom";

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
    const [loading, setLoading] = useState(true); // Κατάσταση φόρτωσης
    const navigate = useNavigate();

    // Φόρτωση δεδομένων κατηγοριών και amenity
    useEffect(() => {
        // Φόρτωση κατηγοριών
        fetch("https://olympus-riviera.onrender.com/api/amenity/category/get/all")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Error fetching categories:", error));

        // Φόρτωση δεδομένων του amenity
        fetch(`https://olympus-riviera.onrender.com/api/amenity/get/${amenityId}`)
            .then((response) => response.json())
            .then((data) => {
                const initialData = {
                    name: data.name,
                    category: data.category_id,
                    description: data.description,
                    phone: data.phone || "",
                    email: data.email || "",
                    photos: data.photos ? data.photos.split(",") : [],
                    latitude: data.latitude,
                    longitude: data.longitude,
                };
                setFormData(initialData);
                setInitialFormData(initialData); // Αποθήκευση των αρχικών δεδομένων
                setLoading(false); // Όταν φορτωθούν τα δεδομένα, ορίζουμε το loading σε false
            })
            .catch((error) => {
                console.error("Error fetching amenity data:", error);
                setLoading(false); // Όταν συμβεί σφάλμα, το loading τελειώνει
            });
    }, [amenityId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "photos") {
            const existingPhotos = formData.photos.filter((photo) => typeof photo === "string");
            const newPhotos = files ? Array.from(files) : [];
            setFormData({ ...formData, photos: [...existingPhotos, ...newPhotos] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleApiLoaded = (map, maps) => {
        if (loading) return; // Αν η φόρτωση δεν έχει ολοκληρωθεί, μην κάνεις τίποτα

        const initialLatLng = formData.latitude && formData.longitude
            ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }
            : null;

        let marker = null;

        // Αν υπάρχουν συντεταγμένες, τοποθετούμε τον marker
        if (initialLatLng) {
            marker = new maps.Marker({
                position: initialLatLng,
                map: map,
            });
        }

        // Ακρόαση click για αλλαγή marker
        map.addListener("click", (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            // Ενημέρωση των συντεταγμένων στο formData
            setFormData((prevFormData) => ({
                ...prevFormData,
                latitude: lat,
                longitude: lng,
            }));

            if (marker) {
                marker.setPosition({ lat, lng });
            } else {
                marker = new maps.Marker({
                    position: { lat, lng },
                    map: map,
                });
            }
        });
    };

    const convertImagesToBase64 = async (photos) => {
        return Promise.all(
            photos.map((photo) => {
                if (typeof photo === "string") {
                    return photo;
                }
                return new Promise((resolve, reject) => {
                    new Compressor(photo, {
                        quality: 1,
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
            })
        ).then((base64Images) => base64Images.join(","));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const changedFields = {};
        for (const key in formData) {
            if (formData[key] !== initialFormData[key]) {
                changedFields[key] = formData[key];
            }
        }

        if (changedFields.photos) {
            changedFields.photos = await convertImagesToBase64(changedFields.photos);
        }

        if (Object.keys(changedFields).length === 0) {
            alert("No changes detected.");
            return;
        }

        const payload = {
            amenity_id: amenityId,
            ...changedFields,
        };

        fetch(`https://olympus-riviera.onrender.com/api/provider/amenity/edit-request/create/${amenityId}`, {
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

    if (loading) {
        return <div>Loading...</div>; // Εμφανίζεται ένα μήνυμα φόρτωσης μέχρι να ολοκληρωθεί η φόρτωση των δεδομένων
    }

    return (
        <div className="amenity-form-container">
            <h1>Edit Amenity</h1>
            <form className="amenity-form" onSubmit={handleSubmit}>
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

                <label htmlFor="location">Location (Click on the map to select):</label>
                <div style={{ height: "500px", width: "100%" }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
                        }}
                        defaultCenter={[
                            parseFloat(formData.latitude) || 40.0853,
                            parseFloat(formData.longitude) || 22.3584,
                        ]}
                        defaultZoom={9}
                        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                        yesIWantToUseGoogleMapApiInternals
                    />
                </div>

                <label htmlFor="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />

                <label htmlFor="photos">Photos:</label>
                <input type="file" id="photos" name="photos" accept="image/*" multiple onChange={handleChange} />

                <button type="submit" className="submit-button">Update Amenity</button>
            </form>
        </div>
    );
}

export default AmenityEdit;
