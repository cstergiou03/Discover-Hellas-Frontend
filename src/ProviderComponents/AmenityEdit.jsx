import React, { useState, useEffect } from "react";
import "../StyleProvider/amenityForm.css";
import GoogleMapReact from 'google-map-react';
import Compressor from 'compressorjs'; 
import { useNavigate, useParams } from 'react-router-dom'; 

function AmenityEdit() {
    const { amenityId } = useParams();  // Λαμβάνουμε το amenityId από το URL
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
    const navigate = useNavigate();

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

        // Φορτώνουμε τα δεδομένα του συγκεκριμένου amenity
        fetch(`https://olympus-riviera.onrender.com/api/amenity/get/${amenityId}`)
            .then(response => response.json())
            .then(data => {
                setFormData({
                    name: data.name,
                    category: data.category_id,
                    description: data.description,
                    location: `${data.latitude}, ${data.longitude}`,
                    website: data.website || "",
                    phone: data.phone || "",
                    email: data.email || "",
                    photos: data.photos ? data.photos.split(',') : [],  // Μετατροπή των φωτογραφιών από string σε array
                    latitude: data.latitude,
                    longitude: data.longitude,
                });
            })
            .catch((error) => {
                console.error("Error fetching amenity data:", error);
            });
    }, [amenityId]);

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

            setFormData((prevFormData) => ({
                ...prevFormData,
                latitude: lat,
                longitude: lng,
            }));
        });
    };

    // Τροποποιημένη συνάρτηση για συμπίεση και μετατροπή σε Base64
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
                            quality: 1, 
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

        // Μετατροπή των φωτογραφιών σε Base64
        const photosBase64 = await convertImagesToBase64(formData.photos);
        console.log("Base64 Photos:", photosBase64);

        if (!photosBase64) {
            alert("Please upload at least one photo.");
            return;
        }

        const payload = {
            name: formData.name,
            category_id: formData.category,
            provider_id: "provider123",  // Πρέπει να αντικαταστήσεις το provider_id με το πραγματικό σου provider ID
            phone: formData.phone,
            email: formData.email,
            latitude: formData.latitude,
            longitude: formData.longitude,
            description: formData.description,
            photos: photosBase64,
        };

        console.log("Payload to send:", payload);

        fetch(`https://olympus-riviera.onrender.com/api/provider/amenity/edit-request/create/${amenityId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response from server:", data);
            alert("Amenity updated successfully!");
            navigate("/provider");
        })
        .catch(error => {
            console.error("Error submitting the form:", error);
            navigate("/provider");
        });        
    };

    return (
        <div className="amenity-form-container">
            <h1>Edit Amenity</h1>
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
                            lat: formData.latitude || 40.0853,
                            lng: formData.longitude || 22.3584,
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

                <button type="submit" className="submit-button">Ενημέρωση</button>
            </form>
        </div>
    );
}

export default AmenityEdit;
