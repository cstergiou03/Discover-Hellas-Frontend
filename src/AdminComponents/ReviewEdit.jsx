import "../StyleAdmin/amenityFormAdmin.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ReviewEdit() {
    const { reviewId } = useParams();
    const [review, setReview] = useState([]);
    const [status, setStatus] = useState("");
    const [destinationName, setDestinationName] = useState("");
    const [view, setView] = useState("");
    const [approvalId, setApprovalId] = useState("");
    const [type, setType] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
            fetch(`https://discover-hellas-springboot-backend.onrender.com/api/admin/feedback/evaluation/get/${reviewId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`)
                .then((response) => response.json())
                .then((data) => {
                    setStatus(data.status);
                    setReview(data);
                    setView(data.view);
                    setType(data.entity_type === "DESTINATION" ? "destination" : "activity")
                })
                .catch((error) => {
                    console.error("Error fetching amenity data:", error);
                });

           
    }, []);

    useEffect(() => {
        fetch(`https://discover-hellas-springboot-backend.onrender.com/api/${type}/${review.entity_id}`)
            .then((response) => response.json())
            .then((data) => {
                setDestinationName(data.name);
            })
            .catch((error) => {
                console.error("Error fetching amenity data:", error);
            });

    }, [review]);

    const handleStatusChange = (newStatus) => {
        const approvalUrl =
            "https://discover-hellas-springboot-backend.onrender.com/api/admin/approval/review/" +
            `${reviewId}` +
            "/approval?Authorization=Bearer%20" +
            `${sessionStorage.getItem('userToken')}`;
        console.log(approvalUrl);
    
        fetch(approvalUrl)
            .then((response) => response.json())
            .then((data) => {
                const fetchedApprovalId = data.approval_id; // Παίρνουμε το ID από την απόκριση
                console.log(fetchedApprovalId);
    
                const updateStatusUrl = "https://discover-hellas-springboot-backend.onrender.com/api/admin/approval/review/get/" + `${fetchedApprovalId}` + "/updateStatus?status=" + `${newStatus}` + "&Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`;
                console.log(updateStatusUrl);
    
                fetch(updateStatusUrl, {
                    method: "PUT",
                })
                    .then((response) => {
                        if (response.ok) {
                            alert("Review updated successfully!");
                            navigate("/admin"); // Μεταφορά στην επόμενη σελίδα
                        } else {
                            console.error("Error updating review status.");
                            alert("Error updating review.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error sending update status request:", error);
                        alert("Network error.");
                    });
            })
            .catch((error) => {
                console.error("Error fetching approval ID:", error);
                alert("Error fetching approval ID.");
            });
    };
    
    // Διαχείριση της αλλαγής του public
    const handleViewChange = (event) => {
        const newValue = event.target.value === "VISIBLE" ? "true" : "false";
        console.log(newValue);
        setView(newValue);
        

        setReview((prevData) => ({
            ...prevData,
            view: newValue === "true" ? "VISIBLE" : "HIDDEN",
        }));
    
        fetch("https://discover-hellas-springboot-backend.onrender.com/api/admin/feedback/evaluation/get/" + `${reviewId}` + "/view?visible=" + `${newValue}` + "&Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`, {
            method: "PUT"
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Η αλλαγή της κατάστασης 'Δημόσιο' ολοκληρώθηκε επιτυχώς.");
                } else {
                    console.error("Σφάλμα κατά την ενημέρωση της κατάστασης 'Δημόσιο'.");
                }
            })
            .catch((error) => {
                console.error("Σφάλμα δικτύου κατά την ενημέρωση της κατάστασης 'Δημόσιο':", error);
            });
    };
    

    return (
        <div className="amenity-form-container">
            <h1>View Review</h1>
            <form className="amenity-form">
                <label htmlFor="destination">Προορισμός/Δραστηριότητα</label>
                <input type="text" id="destination" name="destination" value={destinationName} readOnly />

                <label htmlFor="comment">Σχόλιο:</label>
                <textarea id="comment" name="comment" value={review.comment} readOnly />

                <label htmlFor="rating">Βαθμολογία:</label>
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
                
                <label htmlFor="rating">Δημόσιο:</label>
                <select id="view" name="view" value={review.view === "VISIBLE" ? "VISIBLE" : "HIDDEN"} onChange={handleViewChange}>
                    <option value="VISIBLE">ΝΑΙ</option>
                    <option value="HIDDEN">ΟΧΙ</option>
                </select>

                {/* Εμφάνιση των κουμπιών ανάλογα με το status */}
                <div className="action-buttons">
                    {status === "PENDING" && (
                        <>
                            <button
                                type="button"
                                className="more-btn"
                                onClick={() => handleStatusChange("APPROVED")}
                            >
                                Έγκριση
                            </button>
                            <button
                                type="button"
                                className="more-btn"
                                onClick={() => handleStatusChange("REJECTED")}
                            >
                                Απόρριψη
                            </button>
                        </>
                    )}
                    {(status === "APPROVED" || status === "REJECTED") && null}
                </div>
            </form>
        </div>
    );
}

export default ReviewEdit;
