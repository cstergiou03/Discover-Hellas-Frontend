import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTopDestination from "./PageTopDestination";
import DestinationInfo from "./DestinationInfo";
import Footer from "./Footer";
import DestinationsGallery from "./DestinationGallery";
import { jwtDecode } from 'jwt-decode';
import { FaUser } from "react-icons/fa";
import LoginModal from "./LoginModal";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 39.0742,
    lng: 21.8243,
};

function Activity() {
    const { activityId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [rating, setRating] = useState();
    const [reviewText, setReviewText] = useState();
    const [mapKey, setMapKey] = useState(Date.now());
    const [showReviewsModal, setShowReviewsModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [userId, setUserId] = useState();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [visited, setVisited] = useState(false);
    const [visitData, setVisitData] = useState([]);
    const [averageRating, setAverageRating] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
    });

    useEffect(() => {
        const token = sessionStorage.getItem("userToken");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.userId);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [userId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://discover-hellas-springboot-backend.onrender.com/api/activity/${activityId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchAverageRating = async () => {
            try {
                const response = await fetch(
                    `https://discover-hellas-springboot-backend.onrender.com/api/activity/statistics/${activityId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch average rating");
                }
                const stats = await response.json();
                setAverageRating(stats[0]?.average_rating || "N/A"); // Set average rating
            } catch (err) {
                console.error("Error fetching average rating:", err.message);
            }
        };

        fetchData();
        fetchAverageRating();
    }, [activityId]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(
                    `https://discover-hellas-springboot-backend.onrender.com/api/feedback/get/${activityId}/evaluation/get/all`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }
                const reviewsData = await response.json();
                console.log(reviewsData);
                setReviews(reviewsData); // Ενημερώνουμε το state με τις κριτικές

                // Έλεγχος για να δούμε αν υπάρχει κριτική του τρέχοντος χρήστη
                const userReview = reviewsData.find((review) => review.user_id === userId);
                if (userReview) {
                    setRating(userReview.rating); // Ορίζουμε την αξιολόγηση
                    setReviewText(userReview.comment); // Ορίζουμε το σχόλιο
                }
            } catch (err) {
                console.error("Error fetching reviews:", err.message);
            }
        };

        fetchReviews();
    }, [activityId]);


    useEffect(() => {
        if (!userId) return;
    
        const fetchUserVisits = async () => {
            try {
                const response = await fetch(
                    `https://discover-hellas-springboot-backend.onrender.com/api/user/visit/all/${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem("userToken")}`
                );
    
                if (!response.ok) {
                    throw new Error("Failed to fetch visits");
                }
    
                const visitsData = await response.json();
                console.log("Visits data from API:", visitsData);
    
                // Πρώτο αντικείμενο στο array
                const userVisits = visitsData[0];
                if (!userVisits) {
                    console.warn("No visits data available for this user.");
                    setVisitData([]);
                    setVisited(false);
                    return;
                }
    
                // Ενημέρωση visitData
                setVisitData(userVisits.visits || []);
    
                // Έλεγχος αν υπάρχει το destinationId
                const isVisited = userVisits.visits.some(visit => visit.entity_id === activityId);
                setVisited(isVisited);
                console.log("Is visited:", isVisited);
    
            } catch (error) {
                console.error("Error fetching visits:", error.message);
    
                // Handle the case when the user has no visits yet
                const createVisitData = {
                    user_id: userId,
                    visits: [] // Empty visit list for the new user
                };
    
                try {
                    const postResponse = await fetch(
                        "https://discover-hellas-springboot-backend.onrender.com/api/user/visit/create" + "?Authorization=Bearer%20" + `${sessionStorage.getItem("userToken")}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(createVisitData)
                        }
                    );
    
                    if (!postResponse.ok) {
                        throw new Error("Failed to create visit record");
                    }
    
                    console.log("Visit record created successfully");
    
                } catch (postError) {
                    console.error("Error creating visit record:", postError.message);
                }
            }
        };
    
        fetchUserVisits();
    }, [userId, activityId]);
    
    // Optional: Add a useEffect to watch visitData updates
    useEffect(() => {
        console.log("Updated visitData:", visitData);
    }, [visitData]);    
    
    useEffect(() => {
        if (data) {
            // Change the key only when the data is loaded
            setMapKey(Date.now());
        }
    }, [data]);

    useEffect(() => {
        if (mapInstance && data) {
            const { map, maps } = mapInstance;
            new maps.Marker({
                position: {
                    lat: parseFloat(data.latitude),
                    lng: parseFloat(data.longitude),
                },
                map,
                title: data.name,
            });
        }
    }, [mapInstance, data]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const photosTable = data.photos
        ? data.photos
            .split("data:image/jpeg;base64,")
            .filter((photo) => photo.trim() !== "")
            .map((photo) =>
                "data:image/jpeg;base64," + photo.trim().replace(/,$/, "")
            )
        : [];

    const handleDirectionsClick = () => {
        const latitude = data.latitude;
        const longitude = data.longitude;

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=&destination=${latitude},${longitude}`;

        window.open(googleMapsUrl, "_blank");
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setShowLoginModal(true); // Εμφάνιση του LoginModal αν δεν υπάρχει userId
            return;
        }

        if (rating === 0 || reviewText.trim() === "") {
            alert("Παρακαλώ συμπληρώστε και την βαθμολογία και την κριτική σας.");
            return;
        }

        const reviewPayload = {
            user_id: userId,
            entity_id: activityId,
            entity_type: "ACTIVITY",
            rating,
            comment: reviewText,
            view: "false",
        };

        try {
            const response = await fetch("https://discover-hellas-springboot-backend.onrender.com/api/feedback/evaluation/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewPayload),
            });

            if (!response.ok) {
                throw new Error("Η αποστολή της κριτικής απέτυχε.");
            }

            // Ενημερώνουμε το state με τη νέα κριτική
            const newReview = {
                user_id: "user123",
                reviewText,
                rating,
                date: new Date().toISOString(),
            };
            // setReviews([newReview, ...reviews]);
            setRating(0);
            setReviewText("");
            alert("Η κριτική σας υποβλήθηκε με επιτυχία!");
        } catch (error) {
            alert(`Σφάλμα: ${error.message}`);
        }
    };


    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleTextChange = (e) => {
        setReviewText(e.target.value);
    };

    const openReviewsModal = () => {
        setShowReviewsModal(true);
    };

    const closeReviewsModal = () => {
        setShowReviewsModal(false);
    };

    function ReviewModal() {
        return (
            <div className="review-modal">
                <div className="modal-content">
                    <div>
                        <h2>Κριτικές</h2>
                        <button onClick={closeReviewsModal} className="close-modal-button">
                            ×
                        </button>
                    </div>
                    <div className="average-rating">
                        <p>
                            <strong>Μέση Αξιολόγηση:</strong>{" "}
                            {averageRating !== null ? parseFloat(averageRating).toFixed(1) : "Δεν υπάρχουν δεδομένα"}
                        </p>
                    </div>
                    <div className="reviews-list">
                        {reviews.length === 0 ? (
                            <p>Δεν υπάρχουν κριτικές ακόμα.</p>
                        ) : (
                            reviews.map((review, index) => (
                                <div key={index} className="review">
                                    <div className="review-header">
                                        <div className="review-img">
                                            <FaUser size={40} />
                                        </div>
                                        <div className="review-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={`star ${review.rating >= star ? "filled" : ""}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p><strong>Κριτική: </strong>{review.comment}</p>
                                    <p><strong>Ημερομηνία: </strong>{new Date(review.createdAt).toLocaleString()}</p>
                                    <hr />
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        );
    }

    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    const handleLoginSuccess = () => {
        setLoggedIn(true);
        sessionStorage.setItem('loggedIn', 'true');
        localStorage.removeItem('guestPlan');
    };

    if (!data || !data.latitude || !data.longitude) {
        return;
    }

    const handleRadioChange = async () => {
        if (!sessionStorage.getItem('loggedIn')) {
            // Εμφάνιση του LoginModal αν δεν είναι συνδεδεμένος
            setShowLoginModal(true);
            return;
        }
    
        // Εάν ο χρήστης είναι συνδεδεμένος, τότε αλλάζουμε την κατάσταση του visited
        setVisited(prevVisited => {
            const newVisited = !prevVisited;
            return newVisited;
        });
    
        // Ενημέρωση της λίστας επισκέψεων με PUT
        try {
            const updatedVisits = [...visitData]; // Αντιγράφουμε το visitData για να μην το τροποποιούμε απευθείας
            console.log(updatedVisits);
            if (visited) {
                // Αφαίρεση του συγκεκριμένου entity_id αν το κάνουμε uncheck
                const updatedVisitsList = updatedVisits.filter(visit => visit.entity_id !== activityId);
                console.log("addfsafas" + updatedVisitsList);
                await updateUserVisits(updatedVisitsList);
            } else {
                // Προσθήκη του νέου entity_id στην λίστα των επισκέψεων
                updatedVisits.push({ entity_id: activityId });
                await updateUserVisits(updatedVisits);
            }
        } catch (error) {
            console.error("Error updating visits:", error);
        }
    };
     
    
    const updateUserVisits = async (updatedVisits) => {
        try {
            const response = await fetch(
                `https://discover-hellas-springboot-backend.onrender.com/api/user/visit/update/${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem("userToken")}`,
                {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ visits: updatedVisits }), // Στέλνουμε τη λίστα visits
                }
            );
    
            if (!response.ok) {
                throw new Error("Failed to update visits");
            }
    
            console.log("Visits updated successfully");
    
            // Ενημερώνουμε το state με τις νέες επισκέψεις
            setVisitData(updatedVisits); // Ενημερώνουμε το state με την ενημερωμένη λίστα
    
        } catch (error) {
            console.error("Error updating visits:", error);
        }
    };    

    return (
        <div>
            <PageTopDestination data={data} />
            <DestinationInfo data={data} />
            <DestinationsGallery data={photosTable} />
            <div className="event-map-and-info">
                <div className="event-map-container">
                    {isLoaded ? (
                        <GoogleMap
                            key={mapKey}
                            mapContainerStyle={containerStyle}
                            center={{
                                lat: parseFloat(data.latitude) || defaultCenter.lat,
                                lng: parseFloat(data.longitude) || defaultCenter.lng,
                            }}
                            zoom={9}
                        >
                            {data.latitude && data.longitude && (
                                <MarkerF
                                    position={{
                                        lat: parseFloat(data.latitude),
                                        lng: parseFloat(data.longitude),
                                    }}
                                />
                            )}
                        </GoogleMap>
                    ) : (
                        <div>Loading map...</div>
                    )}
                </div>
                <div className="event-info-right">
                    <div>
                        <h2>Κριτικές</h2>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${rating >= star ? "filled" : ""}`}
                                        onClick={() => handleRatingChange(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            <textarea
                                value={reviewText}
                                onChange={handleTextChange}
                                placeholder="Γράψτε την κριτική σας"
                                rows="4"
                                required
                            ></textarea>

                            <div className="review-buttons">
                                <button type="submit" className="more-btn">
                                    Υποβολή Κριτικής
                                </button>
                                <button type="button" className="more-btn" onClick={openReviewsModal}>
                                    Εμφάνιση Κριτικών
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="down-buttons">
                        <button className="guide-button" onClick={handleDirectionsClick}>
                            Οδηγίες
                        </button>
                        <div className="visit-button">
                            <input
                                type="checkbox"
                                name="radio"
                                id="radio1"
                                className="radio"
                                checked={visited}
                                onChange={handleRadioChange}
                                
                            />

                            <label className="visited" htmlFor="radio1">Έχω επισκεφτεί</label>
                        </div>
                    </div>
                </div>
            </div>
            {showReviewsModal && <ReviewModal />}
            {showLoginModal &&
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={closeLoginModal}
                    setLoggedIn={handleLoginSuccess}
                />
            }
            <Footer />
        </div>
    );
}

export default Activity;
