import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "../StyleAdmin/amenityFormAdmin.css";
import "react-image-gallery/styles/css/image-gallery.css";

function AmenityFormAdmin() {
    const { amenityId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        provider: "",
        phone: "",
        email: "",
        photos: [],
        latitude: 40.0853,
        longitude: 22.3584,
        status: ""
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvalId, setApprovalId] = useState("");
    const [isNewAmenity, setIsNewAmenity] = useState(false);


    useEffect(() => {
        // Φόρτωση κατηγοριών
        fetch("https://olympus-riviera.onrender.com/api/amenity/category/get/all")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch(() => setError("Failed to fetch categories."));
    
        // Φορτώνουμε το πρώτο endpoint για το add-request
        fetch(`https://olympus-riviera.onrender.com/api/admin/approval/amenity/add-request/get/${amenityId}`)
            .then(async (response) => {
                if (response.ok) {
                    setIsNewAmenity(true); // Αν είναι νέο amenity
                    return response.json();
                } else {
                    throw new Error("Failed to fetch add-request."); // Ρίχνουμε σφάλμα για να πάμε στο catch
                }
            })
            .then((data) => {
                const approvalData = data[0] || data; // Αντιμετώπιση του array ή του single object
                
                if (approvalData) {
                    setApprovalId(approvalData.approval_id); // Αποθηκεύουμε το approval_id αν υπάρχει
                    const amenityData = approvalData.entity_id 
                        ? approvalData.entity_id // Για νέο ή επεξεργασμένο όντως
                        : approvalData;
    
                    // Αν το status είναι "APPROVED", πρέπει να φορτώσουμε τα δεδομένα του amenity από άλλο endpoint
                    if (approvalData.status === "PENDING") {
                        fetch(`https://olympus-riviera.onrender.com/api/amenity/get/${amenityId}`)
                            .then((response) => response.json())
                            .then((data) => {
                                const photosTable = data.photos
                                    ? data.photos
                                          .split("data:image/jpeg;base64,")
                                          .filter((photo) => photo.trim() !== "")
                                          .map((photo) =>
                                              "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
                                          )
                                    : [];
    
                                setFormData({
                                    name: data.name,
                                    category: data.category_id,
                                    description: data.description,
                                    provider: data.provider_id,
                                    phone: data.phone || "",
                                    email: data.email || "",
                                    photos: photosTable,
                                    latitude: data.latitude || 40.0853,
                                    longitude: data.longitude || 22.3584,
                                    status: approvalData.status || "PENDING",
                                });
                                setLoading(false);
                            })
                            .catch((err) => {
                                console.error("Error fetching amenity data:", err);
                                setError("Failed to fetch amenity data.");
                                setLoading(false);
                            });
                    } else {
                        const photosTable = amenityData.photos
                            ? amenityData.photos
                                  .split("data:image/jpeg;base64,")
                                  .filter((photo) => photo.trim() !== "")
                                  .map((photo) =>
                                      "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
                                  )
                            : [];
    
                        setFormData({
                            name: amenityData.name,
                            category: amenityData.category_id,
                            description: amenityData.description,
                            provider: amenityData.provider_id,
                            phone: amenityData.phone || "",
                            email: amenityData.email || "",
                            photos: photosTable,
                            latitude: amenityData.latitude || 40.0853,
                            longitude: amenityData.longitude || 22.3584,
                            status: approvalData.status || "PENDING",
                        });
                        setLoading(false);
                    }
                }
            })
            .catch((err) => {
                // Εδώ γίνεται το fetch για το edit-request αν αποτύχει το πρώτο
                console.error("Error fetching add-request, trying edit-request:", err);
    
                fetch(`https://olympus-riviera.onrender.com/api/admin/approval/amenity/edit-request/get/${amenityId}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("No matching amenity found for edit.");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        const approvalData = data[0] || data;
    
                        if (approvalData) {
                            setApprovalId(approvalData.approval_id);
                            const amenityData = approvalData.entity_id 
                                ? approvalData.entity_id 
                                : approvalData;
    
                            // Ελέγχουμε αν το status είναι "APPROVED" για να πάρουμε τα δεδομένα του amenity
                            if (approvalData.status === "PENDING") {
                                fetch(`https://olympus-riviera.onrender.com/api/amenity/get/${amenityId}`)
                                    .then((response) => response.json())
                                    .then((data) => {
                                        const photosTable = data.photos
                                            ? data.photos
                                                  .split("data:image/jpeg;base64,")
                                                  .filter((photo) => photo.trim() !== "")
                                                  .map((photo) =>
                                                      "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
                                                  )
                                            : [];
    
                                        setFormData({
                                            name: data.name,
                                            category: data.category_id,
                                            description: data.description,
                                            provider: data.provider_id,
                                            phone: data.phone || "",
                                            email: data.email || "",
                                            photos: photosTable,
                                            latitude: data.latitude || 40.0853,
                                            longitude: data.longitude || 22.3584,
                                            status: approvalData.status || "PENDING",
                                        });
                                        setLoading(false);
                                    })
                                    .catch((err) => {
                                        console.error("Error fetching amenity data after edit-request failed:", err);
                                        setError("Failed to fetch amenity data.");
                                        setLoading(false);
                                    });
                            } else {
                                const photosTable = amenityData.photos
                                    ? amenityData.photos
                                          .split("data:image/jpeg;base64,")
                                          .filter((photo) => photo.trim() !== "")
                                          .map((photo) =>
                                              "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
                                          )
                                    : [];
    
                                setFormData({
                                    name: amenityData.name,
                                    category: amenityData.category_id,
                                    description: amenityData.description,
                                    provider: amenityData.provider_id,
                                    phone: amenityData.phone || "",
                                    email: amenityData.email || "",
                                    photos: photosTable,
                                    latitude: amenityData.latitude || 40.0853,
                                    longitude: amenityData.longitude || 22.3584,
                                    status: approvalData.status || "PENDING",
                                });
                                setLoading(false);
                            }
                        }
                    })
                    .catch((err) => {
                        console.error("Error fetching edit-request, trying amenity data:", err);
    
                        // Εδώ, αν το edit-request αποτύχει, φέρνουμε τα δεδομένα του amenity
                        fetch(`https://olympus-riviera.onrender.com/api/amenity/get/${amenityId}`)
                            .then((response) => response.json())
                            .then((data) => {
                                const photosTable = data.photos
                                    ? data.photos
                                          .split("data:image/jpeg;base64,")
                                          .filter((photo) => photo.trim() !== "")
                                          .map((photo) =>
                                              "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
                                          )
                                    : [];
    
                                setFormData({
                                    name: data.name,
                                    category: data.category_id,
                                    description: data.description,
                                    provider: data.provider_id,
                                    phone: data.phone || "",
                                    email: data.email || "",
                                    photos: photosTable,
                                    latitude: data.latitude || 40.0853,
                                    longitude: data.longitude || 22.3584,
                                    status: "APPROVED", // Επειδή τα δεδομένα του amenity είναι πλέον valid
                                });
                                setLoading(false);
                            })
                            .catch((err) => {
                                console.error("Error fetching amenity data after edit-request failure:", err);
                                setError("Failed to fetch amenity data.");
                                setLoading(false);
                            });
                    });
            });
    }, [amenityId]);       

    const handleStatusChange = (status) => {
        // Επιλέγουμε το κατάλληλο URL ανάλογα με το isNewAmenity
        const url = isNewAmenity
            ? `https://olympus-riviera.onrender.com/api/admin/approval/amenity/add-request/get/${approvalId}/updateStatus?status=${status}`
            : `https://olympus-riviera.onrender.com/api/admin/approval/amenity/edit-request/get/${approvalId}/updateStatus?status=${status}`;
    
        // Αποστολή δεδομένων στον server
        fetch(url, {
            method: "PUT",
        })
            .then((response) => {
                if (response.ok) {
                    alert("Amenity updated successfully!");
                    navigate("/admin");
                } else {
                    throw new Error("Failed to update amenity");
                }
            })
            .catch(() => alert("Error updating amenity."));
    };
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const imageGalleryItems = formData.photos.map((photo) => ({
        original: photo,
        thumbnail: photo,
    }));

    console.log(formData);

    return (
        <div className="amenity-form-container">
            <h1>View Amenity</h1>
            <form className="amenity-form">
                <label htmlFor="name">Amenity Name:</label>
                <input type="text" id="name" name="name" value={formData.name} readOnly />

                <label htmlFor="category">Category:</label>
                <select id="category" name="category" value={formData.category} disabled>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" value={formData.description} readOnly />

                <label htmlFor="location">Location:</label>
                <div style={{ height: "400px", width: "100%" }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
                        }}
                        defaultCenter={{
                            lat: parseFloat(formData.latitude),
                            lng: parseFloat(formData.longitude),
                        }}
                        defaultZoom={15}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => {
                            new maps.Marker({
                                position: {
                                    lat: parseFloat(formData.latitude),
                                    lng: parseFloat(formData.longitude),
                                },
                                map: map,
                            });
                        }}
                    />
                </div>

                <label htmlFor="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} readOnly />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} readOnly />

                <label>Photos:</label>
                <div className="photo-carousel">
                    {imageGalleryItems.length > 0 ? (
                        <ImageGallery
                            items={imageGalleryItems}
                            showThumbnails={true}
                            showPlayButton={false}
                            showFullscreenButton={true}
                        />
                    ) : (
                        <p>No photos available.</p>
                    )}
                </div>

                <div className="action-buttons">
                    {/* Εμφάνιση κουμπιών με βάση το status */}
                    {formData.status === "PENDING" && (
                        <>
                        <button
                            type="button"
                            className="more-btn"
                            onClick={() => handleStatusChange("APPROVED")}
                        >
                            Approve
                        </button>
                        <button
                            type="button"
                            className="more-btn"
                            onClick={() => handleStatusChange("REJECTED")}
                        >
                            Reject
                        </button>
                    </>
                    )}
                    {formData.status === "REJECTED" && null}
                </div>
            </form>
        </div>
    );
}

export default AmenityFormAdmin;
