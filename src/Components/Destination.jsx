import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTopDestination from "./PageTopDestination";
import DestinationInfo from "./DestinationInfo";
import Footer from "./Footer";
import DestinationsGallery from "./DestinationGallery";
import GoogleMapReact from 'google-map-react';
import "../Style/destination.css";
import { FaUser } from "react-icons/fa";

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

    const handleReviewSubmit = (e) => {
        e.preventDefault();

        if (rating === 0 || reviewText.trim() === "") {
            alert("Παρακαλώ συμπληρώστε και την βαθμολογία και την κριτική σας.");
            return;
        }

        const newReview = {
            user_id: "user123", // Simple example user
            reviewText,
            rating,
            date: new Date().toISOString(),
        };

        setReviews([newReview, ...reviews]); // Update the reviews state
        setRating(0);
        setReviewText("");
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
                                        {/* Χρησιμοποιούμε το εικονίδιο από τη βιβλιοθήκη */}
                                        <div className="review-img">
                                            <FaUser size={40} /> {/* Αυτό είναι το εικονίδιο του χρήστη */}
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
                                    <p><strong>Κριτική: </strong>{review.reviewText}</p>
                                    <p><strong>Ημερομηνία: </strong>{new Date(review.date).toLocaleString()}</p>
                                    <hr />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!data || !data.latitude || !data.longitude) {
        return;
    }

    return (
        <div>
            <PageTopDestination data={data} />
            <DestinationInfo data={data} /> 
            <DestinationsGallery data={photosTable} />
            <div className="event-map-and-info">
                <div className="event-map-container">
                    {data.latitude && data.longitude ? (
                        <GoogleMapReact
                            key={mapKey}
                            bootstrapURLKeys={{
                                key: "AIzaSyCIrKrxTVDqlcRVFNyNMm5iS869G7RYvuc",
                            }}
                            defaultZoom={10}
                            defaultCenter={{
                                lat: parseFloat(data.latitude),
                                lng: parseFloat(data.longitude),
                            }}
                            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                            yesIWantToUseGoogleMapApiInternals
                        />
                    ) : (
                        <div>Δεν υπάρχουν διαθέσιμες συντεταγμένες για τον χάρτη.</div>
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
            <Footer />
        </div>
    );
}

export default Destination;
