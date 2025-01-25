import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PageTopDestination from "./PageTopDestination";
import DestinationInfo from "./DestinationInfo";
import Footer from "./Footer";
import DestinationsGallery from "./DestinationGallery";
import GoogleMapReact from 'google-map-react';
import "../Style/destination.css";
import { jwtDecode } from 'jwt-decode';
import { FaUser } from "react-icons/fa";
import LoginModal from "./LoginModal";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 40.0853,
    lng: 22.3584,
};

function Destination() {
    const { destinationId } = useParams();
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
    const [loggedIn, setLoggedIn] = useState(false);

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
                    `https://olympus-riviera.onrender.com/api/destination/${destinationId}`
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

        fetchData();
    }, [destinationId]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(
                    `https://olympus-riviera.onrender.com/api/feedback/get/${destinationId}/evaluation/get/all`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }
                const reviewsData = await response.json();
                console.log(reviewsData);
                setReviews(reviewsData); // Ενημερώνουμε το state με τις κριτικές
            } catch (err) {
                console.error("Error fetching reviews:", err.message);
            }
        };

        fetchReviews();
    }, [destinationId]);


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

    const handleApiLoaded = (map, maps) => {
        setMapInstance({ map, maps });

        if (data && data.latitude && data.longitude) {
            new maps.Marker({
                position: {
                    lat: parseFloat(data.latitude),
                    lng: parseFloat(data.longitude),
                },
                map,
                title: data.name,
            });
        }
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
            entity_id: destinationId,
            entity_type: "DESTINATION",
            rating,
            comment: reviewText,
            view: "false",
        };

        try {
            const response = await fetch("https://olympus-riviera.onrender.com/api/feedback/evaluation/create", {
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

    const onLoad = (marker) => {
        console.log("marker: ", marker);
      };

    return (
        <div>
            <PageTopDestination data={data} />
            <DestinationInfo data={data} />
            <DestinationsGallery data={photosTable} />

            {/* <div className="iframe-container">
                <iframe 
                    src="http://195.130.106.58/scan/e2c37e7e-eace-4b55-a96b-4ab7406c0c35?alt=0.115&long=1.417&apt=75&fullscr=false&nbors=6&dataset=cube" 
                    width="80%" 
                    height="500px" 
                    frameBorder="0" 
                    allowFullScreen
                    title="TruView Virtual Tour"
                ></iframe>
            </div>  */}

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

                    <button className="guide-button" onClick={handleDirectionsClick}>
                        Οδηγίες
                    </button>
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

export default Destination;
