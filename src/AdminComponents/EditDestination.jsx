import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import Compressor from "compressorjs";
import { useParams, useNavigate } from "react-router-dom";
import "../StyleProvider/amenityForm.css";

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ανάκτηση του προορισμού με το destinationID για την επεξεργασία
                if (destinationID) {
                    const response = await fetch(`https://olympus-riviera.onrender.com/api/destination/${destinationID}`);
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
                const categoriesResponse = await fetch("https://olympus-riviera.onrender.com/api/admin/destination/category/get/all");
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);  // Set loading to false when both data sets are loaded
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
            photos: base64Images.join(",") // Set the new photos, overwriting any previous ones
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Αποστολή δεδομένων για ενημέρωση του προορισμού
        fetch(`https://olympus-riviera.onrender.com/api/admin/destination/${destinationID}`, {
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
                navigate("/admin");
            });
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this destination?")) {
            fetch(`https://olympus-riviera.onrender.com/api/admin/destination/${destinationID}`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Destination deleted successfully!");
                        // Optionally navigate to another page after deletion
                        navigate("/admin");
                    } else {
                        navigate("/admin");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    navigate("/admin");
                });
        }
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
        const latitude = formData.latitude ? parseFloat(formData.latitude) : 40.0853;
        const longitude = formData.longitude ? parseFloat(formData.longitude) : 22.3584;

        // Ελέγχουμε αν οι τιμές latitude και longitude είναι αριθμοί
        if (isNaN(latitude) || isNaN(longitude)) {
            console.error("Invalid coordinates:", latitude, longitude);
            return; // Αν είναι λάθος, δεν προχωράμε
        }

        const position = { lat: latitude, lng: longitude };

        // Set the map's center to the destination or fallback location
        map.setCenter(position);

        // Αν υπάρχει ήδη marker, τον αφαιρούμε
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        // Δημιουργούμε νέο marker και τον τοποθετούμε στο χάρτη
        const marker = new maps.Marker({
            position,
            map,
            title: "Selected Location",
        });

        markerRef.current = marker;

        // Ακροαστής για κλικ στο χάρτη
        map.addListener("click", (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            // Αφαίρεση προηγούμενου marker
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }

            // Δημιουργία νέου marker για τη νέα τοποθεσία
            const newMarker = new maps.Marker({
                position: { lat, lng },
                map,
                title: "Selected Location",
            });

            markerRef.current = newMarker;

            // Ενημέρωση των συντεταγμένων
            handleLocationChange({ lat, lng });
        });
    };


    return (
        <div className="amenity-form-container">
            <h1>Edit Destination</h1>
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

                <div style={{ height: "500px", width: "100%" }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
                        }}
                        defaultCenter={{
                            lat: parseFloat(formData.latitude),
                            lng: parseFloat(formData.longitude),
                        }}
                        defaultZoom={9}
                        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                        yesIWantToUseGoogleMapApiInternals
                    />

                </div>

                <label htmlFor="360Link">360 Link:</label>
                <input
                    // type="url"
                    id="360Link"
                    value={formData.link_360_view}
                    onChange={(e) => setFormData({ ...formData, link_360_view: e.target.value })}
                />

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
