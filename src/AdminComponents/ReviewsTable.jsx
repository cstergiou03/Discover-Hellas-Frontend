import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../StyleProvider/providerTable.css";

function ReviewsTable({ data, dataType }) {
    const [activeTab, setActiveTab] = useState("APPROVED");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Αρχική τιμή 4
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 950) {
                setItemsPerPage(3);
            } else {
                setItemsPerPage(5);
            }
        };

        // Παρακολούθηση της αλλαγής μεγέθους του παραθύρου
        window.addEventListener("resize", handleResize);
        
        // Αρχική ρύθμιση
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
            setCurrentPage(1);
    }, [activeTab]);

    useEffect(() => {
        const fetchDestinationsAndActivities = async () => {
            try {
                // Φέρνουμε όλα τα destinations
                const destinationsResponse = await fetch("https://olympus-riviera.onrender.com/api/destination/get/all");
                const destinationsData = await destinationsResponse.json();

                // Φέρνουμε όλα τα activities
                const activitiesResponse = await fetch("https://olympus-riviera.onrender.com/api/activity/get/all");
                const activitiesData = await activitiesResponse.json();

                // Δημιουργούμε χάρτες για τα destinations και τα activities
                const destinationMap = destinationsData.reduce((acc, destination) => {
                    acc[destination.destination_id] = destination.name;
                    return acc;
                }, {});

                const activityMap = activitiesData.reduce((acc, activity) => {
                    acc[activity.activity_id] = activity.name;
                    return acc;
                }, {});

                // Ενημερώνουμε τα reviews με το `name`
                const updatedReviews = data.map(comment => {
                    const entityName =
                        comment.entity_type === "DESTINATION"
                            ? destinationMap[comment.entity_id]
                            : activityMap[comment.entity_id];

                    return {
                        ...comment,
                        name: entityName, // Προσθήκη του name
                    };
                });

                // Ανανεώνουμε τα reviews με τα νέα δεδομένα
                setReviews(updatedReviews);
            } catch (error) {
                console.error("Error fetching destinations or activities:", error);
            }
        };

        fetchDestinationsAndActivities();
    }, [data]);

    const filteredData = reviews?.filter(item => item.status === activeTab) || [];
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleEditClick = (item) => {
        const id = item.review_id;
        navigate(`/admin/edit-${dataType}/${id}`);
    };

    return (
        <div className="provider-table">
            <div className="tabs">
                {["APPROVED", "PENDING", "REJECTED"].map(status => (
                    <div
                        key={status}
                        className={`tab ${activeTab === status ? 'active' : ''}`}
                        onClick={() => setActiveTab(status)}
                    >
                        {status}
                    </div>
                ))}
            </div>

            <div className="table">
                <div className="table-items">
                    {currentPageData.length > 0 ? (
                        currentPageData.map(item => (
                            <div className="table-item" key={item.id}>
                                <div className="record-name">{item.name}</div>
                                {item.view === "VISIBLE" ? 
                                    <div className="record-name">ΔΗΜΟΣΙΟ</div>
                                    :
                                    <div className="record-name">ΙΔΙΩΤΙΚΟ</div>
                                }   
                                <button 
                                    onClick={() => handleEditClick(item)}
                                    className="more-btn"
                                >
                                    Περισσότερα
                                </button>
                            </div>
                        ))
                    ) : (
                        <div>No {dataType}s in this category</div>
                    )}
                </div>
            </div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default ReviewsTable;
