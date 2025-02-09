import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, Autocomplete, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import Compressor from "compressorjs";
import { useParams, useNavigate } from "react-router-dom";
import "../StyleProvider/amenityForm.css";

const GOOGLE_MAP_LIBRARIES = ["places"];

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 39.0742,
    lng: 21.8243,
};

function EditDestination() {
    const { destinationID } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        category_id: "",
        description: "",
        photos: "",
        latitude: "",
        longitude: "",
        link_360_view: "",
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const markerRef = useRef(null);
    const navigate = useNavigate();
    const autocompleteRef = useRef(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
        libraries: GOOGLE_MAP_LIBRARIES,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ανάκτηση του προορισμού με το destinationID για την επεξεργασία
                if (destinationID) {
                    const response = await fetch(`https://discover-hellas-springboot-backend.onrender.com/api/destination/${destinationID}`);
                    const data = await response.json();
                    setFormData({
                        name: data.name,
                        category_id: data.category_id,
                        description: data.description,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        photos: data.photos || "",
                        link_360_view: data.link_360_view || "",
                    });
                }

                // Ανάκτηση κατηγοριών για το dropdown
                const categoriesResponse = await fetch("https://discover-hellas-springboot-backend.onrender.com/api/destination/category/get/all");
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, [destinationID]);

    const handlePhotoChange = async (e) => {
        const files = Array.from(e.target.files);
        const base64Images = await Promise.all(
            files.map(
                (file) =>
                    new Promise((resolve, reject) => {
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
                    })
            )
        );

        setFormData((prev) => ({
            ...prev,
            photos: base64Images.join(",") // Set the new photos, overwriting any previous ones
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Αποστολή δεδομένων για ενημέρωση του προορισμού
        const url = "https://discover-hellas-springboot-backend.onrender.com/api/admin/destination/" + `${destinationID}?` + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
        fetch(url , {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),  // Αποστολή των δεδομένων με το πεδίο photos που περιλαμβάνει τις φωτογραφίες σε Base64
        })
            .then((response) => response.json())
            .then(() => {
                alert("Destination updated successfully!");
                navigate("/admin");
            })
            .catch((error) => {
                console.error(error);
                alert("Destination updated successfully!");
                navigate("/admin");
            });
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this destination?")) {
            const url = "https://discover-hellas-springboot-backend.onrender.com/api/admin/destination/" + `${destinationID}?` + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
            fetch(url , {
                method: "DELETE",
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Destination deleted successfully!");
                        navigate("/admin");
                    } else {
                        alert("Destination deleted successfully!");
                        navigate("/admin");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert("Destination deleted successfully!");
                    navigate("/admin");
                });
        }
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
            <h1>Επεξεργασία Προορισμού</h1>
            <form className="amenity-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <label htmlFor="name">Όνομα Προορισμού:</label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <label htmlFor="category">Κατηγορία:</label>
                <select
                    id="category"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                >
                    <option value="">Διαλέξτε Κατηγορία</option>
                    {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="description">Περιγραφή:</label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />

                <label htmlFor="location">Αναζήτηση Τοποθεσίας:</label>
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

                <label htmlFor="location">Τοποθεσία: </label>
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

                <label htmlFor="photos">Photos:</label>
                <input type="file" multiple onChange={handlePhotoChange} />

                <button className="more-btn" type="submit">
                    Ενημέρωση Προορισμού
                </button>
                <button
                    className="more-btn"
                    type="button"
                    style={{ backgroundColor: "red" }}
                    onClick={handleDelete}
                >
                    Διαγραφή Προορισμού
                </button>
            </form>
        </div>
    );
}

export default EditDestination;
