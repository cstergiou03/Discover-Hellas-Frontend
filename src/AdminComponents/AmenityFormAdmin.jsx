import React, { useState, useEffect } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "../StyleAdmin/amenityFormAdmin.css";
import "react-image-gallery/styles/css/image-gallery.css";

const GOOGLE_MAP_LIBRARIES = ["places"];

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 39.0742,
    lng: 21.8243,
};

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
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
        libraries: GOOGLE_MAP_LIBRARIES,
    });

    useEffect(() => {
        // Φόρτωση κατηγοριών
        fetch("https://olympus-riviera.onrender.com/api/amenity/category/get/all")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch(() => setError("Failed to fetch categories."));

        // Φορτώνουμε το πρώτο endpoint για το add-request
        const url1 = "https://olympus-riviera.onrender.com/api/admin/approval/amenity/add-request/get/" + `${amenityId}?` + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
        fetch(url1)
            .then(async (response) => {
                if (response.ok) {
                    setIsNewAmenity(true);
                    return response.json();
                } else {
                    throw new Error("Failed to fetch add-request."); // Ρίχνουμε σφάλμα για να πάμε στο catch
                }
            })
            .then((data) => {
                console.log("EDQWWWWW " + data);
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
                // console.error("Error fetching add-request, trying edit-request:", err);
                const url2 = "https://olympus-riviera.onrender.com/api/admin/approval/amenity/edit-request/get/" + `${amenityId}?` + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
                fetch(url2)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("No matching amenity found for edit.");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("EDQWWWWW2 " + data);
                        const approvalData = data[0] || data;

                        if (approvalData) {
                            setApprovalId(approvalData.approval_id);
                            const amenityData = approvalData.entity_id
                                ? approvalData.entity_id
                                : approvalData;

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

                        const approvalUrl = `https://olympus-riviera.onrender.com/api/admin/approval/${amenityId}/rejections/get/all?` + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
                        fetch(approvalUrl)
                            .then((response) => response.json())
                            .then((data) => {
                                const approvalData = data[0] || data;
                                setRejectionReason(approvalData.comments);
                            })
                       
                        fetch(`https://olympus-riviera.onrender.com/api/amenity/get/${amenityId}`)
                            .then((response) => response.json())
                            .then((data) => {
                                console.log("EDQWWWWW ");
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
                                    status: data.status,
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
        console.log(approvalId)
        const addUrl = "https://olympus-riviera.onrender.com/api/admin/approval/amenity/add-request/get/" + `${approvalId}` + "/updateStatus?status=" + `${status}` + "&Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
        const editUrl = "https://olympus-riviera.onrender.com/api/admin/approval/amenity/edit-request/get/" + `${approvalId}` + "/updateStatus?status=" + `${status}` + "&Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
        
        const url3 = isNewAmenity
            ? addUrl
            : editUrl;
        console.log(url3);
        const requestBody = {
            comments: status === "REJECTED" ? rejectionReason : "",
        };
        fetch(url3, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
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

    const openRejectModal = () => {
        setIsRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setIsRejectModalOpen(false);
    };

    const handleRejectSubmit = () => {
        handleStatusChange("REJECTED");
        closeRejectModal();
    };

    return (
        <div className="amenity-form-container">
            <h1>Παροχή</h1>
            <form className="amenity-form">
                <label htmlFor="name">'Ονομα Παροής:</label>
                <input type="text" id="name" name="name" value={formData.name} readOnly />

                <label htmlFor="category">Κατηγορία:</label>
                <select id="category" name="category" value={formData.category} disabled>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="description">Περιγραφή:</label>
                <textarea id="description" name="description" value={formData.description} readOnly />

                <label htmlFor="location">Τοποθεσία:</label>


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

                {formData.status === "REJECTED" && (
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
                                onClick={openRejectModal}
                            >
                                Reject
                            </button>
                        </>
                    )}
                    {formData.status === "REJECTED" && null}
                </div>
            </form>
            {isRejectModalOpen && (
                <div className="reject-modal">
                    <div className="reject-modal-content">
                        <div>
                            <h2>Λόγος Απόρριψης</h2>
                            <button onClick={closeRejectModal} className="close-modal-button">
                                ×
                            </button>
                        </div>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Πληκτρολογήστε τον λόγο απόρριψης εδώ..."
                            rows={6}
                            className="reject-reason-textarea"
                        />
                        <button
                            onClick={handleRejectSubmit}
                            className="submit-reject-button"
                            disabled={!rejectionReason.trim()}
                        >
                            Υποβολή
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AmenityFormAdmin;
