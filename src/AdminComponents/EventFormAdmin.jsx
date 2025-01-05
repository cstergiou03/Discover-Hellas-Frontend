import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "../StyleAdmin/amenityFormAdmin.css";
import "react-image-gallery/styles/css/image-gallery.css";

function EventFormAdmin() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        provider: "",
        phone: "",
        email: "",
        photos: [],
        latitude: 40.0853,
        longitude: 22.3584,
        status: "",
        siteLink: "",
        event_start: "",
        event_end: "",
    });    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvalId, setApprovalId] = useState("");
    const [approvalData, setApprovalData] = useState(null);

    useEffect(() => {
        // Φορτώνουμε το πρώτο endpoint για το add-request
        fetch(`https://olympus-riviera.onrender.com/api/admin/approval/event/add-request/get/${eventId}`)
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to fetch add-request.");
                }
            })
            .then((data) => {
                const approval = data[0] || data; // Αντιμετώπιση του array ή του single object
                setApprovalData(approval); // Αποθήκευση των δεδομένων έγκρισης
                setApprovalId(approval.approval_id); // Αποθηκεύουμε το approval_id

                const eventData = approval.entity_id ? approval.entity_id : approval;

                // Αν το status είναι "PENDING", πρέπει να φορτώσουμε τα δεδομένα του event
                if (approval.status === "PENDING") {
                    fetch(`https://olympus-riviera.onrender.com/api/event/get/${eventId}`)
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
                                description: data.description,
                                provider: data.provider_id,
                                phone: data.phone || "",
                                email: data.email || "",
                                photos: photosTable,
                                latitude: data.latitude || 40.0853,
                                longitude: data.longitude || 22.3584,
                                status: approval.status || "PENDING",
                                siteLink: data.siteLink || "",
                                event_start: data.event_start || "",
                                event_end: data.event_end || "",
                            });
                            setLoading(false);
                        })
                        .catch((err) => {
                            console.error("Error fetching event data:", err);
                            setError("Failed to fetch event data.");
                            setLoading(false);
                        });
                } else {
                    // Αν το status δεν είναι "PENDING", εμφανίζουμε τα δεδομένα από το approval
                    const photosTable = eventData.photos
                        ? eventData.photos
                              .split("data:image/jpeg;base64,")
                              .filter((photo) => photo.trim() !== "")
                              .map((photo) =>
                                  "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
                              )
                        : [];

                    setFormData({
                        name: eventData.name,
                        description: eventData.description,
                        provider: eventData.provider_id,
                        phone: eventData.phone || "",
                        email: eventData.email || "",
                        photos: photosTable,
                        latitude: eventData.latitude || 40.0853,
                        longitude: eventData.longitude || 22.3584,
                        status: approval.status || "PENDING",
                        siteLink: eventData.siteLink || "",
                        event_start: eventData.event_start || "",
                        event_end: eventData.event_end || "",
                    });
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error("Error fetching add-request, trying edit-request:", err);

                fetch(`https://olympus-riviera.onrender.com/api/admin/approval/event/edit-request/get/${eventId}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("No matching event found for edit.");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        const approval = data[0] || data;
                        setApprovalData(approval);
                        setApprovalId(approval.approval_id);

                        const eventData = approval.entity_id ? approval.entity_id : approval;

                        if (approval.status === "PENDING") {
                            fetch(`https://olympus-riviera.onrender.com/api/event/get/${eventId}`)
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
                                        description: data.description,
                                        provider: data.provider_id,
                                        phone: data.phone || "",
                                        email: data.email || "",
                                        photos: photosTable,
                                        latitude: data.latitude || 40.0853,
                                        longitude: data.longitude || 22.3584,
                                        status: approval.status || "PENDING",
                                        siteLink: data.siteLink || "",
                                        event_start: data.event_start || "",
                                        event_end: data.event_end || "",
                                    });
                                    setLoading(false);
                                })
                                .catch((err) => {
                                    console.error("Error fetching event data after edit-request failed:", err);
                                    setError("Failed to fetch event data.");
                                    setLoading(false);
                                });
                        } else {
                            const photosTable = eventData.photos
                                ? eventData.photos
                                      .split("data:image/jpeg;base64,")
                                      .filter((photo) => photo.trim() !== "")
                                      .map((photo) =>
                                          "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
                                      )
                                : [];

                            setFormData({
                                name: eventData.name,
                                description: eventData.description,
                                provider: eventData.provider_id,
                                phone: eventData.phone || "",
                                email: eventData.email || "",
                                photos: photosTable,
                                latitude: eventData.latitude || 40.0853,
                                longitude: eventData.longitude || 22.3584,
                                status: approval.status || "PENDING",
                                siteLink: eventData.siteLink || "",
                                event_start: eventData.event_start || "",
                                event_end: eventData.event_end || "",
                            });
                            setLoading(false);
                        }
                    })
                    .catch((err) => {
                        console.error("Error fetching edit-request, trying event data:", err);

                        // Εδώ φέρνουμε τα δεδομένα του event αν όλα τα προηγούμενα αποτύχουν
                        fetch(`https://olympus-riviera.onrender.com/api/event/get/${eventId}`)
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
                                    description: data.description,
                                    provider: data.provider_id,
                                    phone: data.phone || "",
                                    email: data.email || "",
                                    photos: photosTable,
                                    latitude: data.latitude || 40.0853,
                                    longitude: data.longitude || 22.3584,
                                    status: "APPROVED",
                                    siteLink: data.siteLink || "",
                                    event_start: data.event_start || "",
                                    event_end: data.event_end || "",
                                });
                                setLoading(false);
                            })
                            .catch((err) => {
                                console.error("Error fetching event data after edit-request failure:", err);
                                setError("Failed to fetch event data.");
                                setLoading(false);
                            });
                    });
            });
    }, [eventId]);

    const handleStatusChange = (status) => {
        const url = approvalData.approval_type === "Create"
            ? `https://olympus-riviera.onrender.com/api/admin/approval/event/add-request/get/${approvalId}/updateStatus?status=${status}`
            : `https://olympus-riviera.onrender.com/api/admin/approval/event/edit-request/get/${approvalId}/updateStatus?status=${status}`;

        fetch(url, {
            method: "PUT",
        })
            .then((response) => {
                if (response.ok) {
                    alert("Event updated successfully!");
                    navigate("/admin");
                } else {
                    throw new Error("Failed to update event");
                }
            })
            .catch(() => alert("Error updating event."));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const imageGalleryItems = formData.photos.map((photo) => ({
        original: photo,
        thumbnail: photo,
    }));

    const renderActionButtons = () => {
        if (formData.status === "APPROVED") {
            return <div></div>;
        }
        if (formData.status === "REJECTED") {
            return <div></div>;
        }
    
        // Αν το status είναι "PENDING" ή οποιοδήποτε άλλο status που επιτρέπει την αλλαγή
        return (
            <div className="action-buttons">
                <button onClick={() => handleStatusChange("APPROVED")} className="more-btn">Approve</button>
                <button onClick={() => handleStatusChange("REJECTED")} className="more-btn">Reject</button>
            </div>
        );
    };

    console.log(formData.event_start)

    const formatDateTimeForInput = (dateTime) => {
        if (!dateTime) return ""; // Επιστροφή κενής τιμής αν δεν υπάρχει
        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
    
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };    

    return (
        <div className="event-form-container">
            <h1>View Event</h1>
            <form className="event-form">
                <label htmlFor="name">Event Name:</label>
                <input type="text" id="name" name="name" value={formData.name} readOnly />

                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" value={formData.description} readOnly />

                <label htmlFor="eventStart">Event Start:</label>
                <input type="datetime-local" id="eventStart" name="eventStart" value={formatDateTimeForInput(formData.event_start)} readOnly />

                <label htmlFor="eventEnd">Event End:</label>
                <input type="datetime-local" id="eventEnd" name="eventEnd" value={formatDateTimeForInput(formData.event_end)} readOnly />


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
                        defaultZoom={10}
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
                
                <label htmlFor="phone">Website:</label>
                <input type="web" id="siteLink" name="siteLink" value={formData.siteLink} readOnly />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} readOnly />

                <label>Photos:</label>
                <div className="photo-carousel">
                    {imageGalleryItems.length > 0 ? (
                        <ImageGallery
                            items={imageGalleryItems}
                            showFullscreenButton={false}
                            showPlayButton={false}
                            useBrowserFullscreen={false}
                        />
                    ) : (
                        <div>No photos available.</div>
                    )}
                </div>
            </form>

            {renderActionButtons()}
        </div>
    );
}

export default EventFormAdmin;
