import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../StyleProvider/providerTable.css";

function ProviderTable({ data, dataType }) {
    const [activeTab, setActiveTab] = useState("APPROVED");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Default είναι 5

    const navigate = useNavigate();

    // Ελέγχουμε το πλάτος της οθόνης και προσαρμόζουμε το pagination
    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth <= 768) {
                setItemsPerPage(3); // Μειώνουμε τα items ανά σελίδα στις μικρές οθόνες
            } else {
                setItemsPerPage(5); // Επαναφέρουμε την προεπιλογή
            }
        };

        // Καλούμε την αρχική ρύθμιση και προσθέτουμε listener για αλλαγές στο μέγεθος
        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);

        return () => {
            window.removeEventListener("resize", updateItemsPerPage);
        };
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const filteredData = data.filter((item) => item.status === activeTab);

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
        const id = dataType === "amenity" ? item.amenity_id : item.event_id;
        navigate(`/provider/edit-${dataType}/${id}`);
    };

    return (
        <div className="provider-table">
            <div className="tabs">
                {["APPROVED", "PENDING", "REJECTED"].map((status) => (
                    <div
                        key={status}
                        className={`tab ${activeTab === status ? "active" : ""}`}
                        onClick={() => setActiveTab(status)}
                    >
                        {status}
                    </div>
                ))}
            </div>

            <div className="table">
                <div className="table-items">
                    {currentPageData.length > 0 ? (
                        currentPageData.map((item) => (
                            <div className="table-item" key={item.id}>
                                <div className="record-name">{item.name}</div>
                                <div className="record-description">{item.description}</div>

                                <button
                                    onClick={() => handleEditClick(item)}
                                    className="more-btn"
                                >
                                    Περισσότερα
                                </button>
                            </div>
                        ))
                    ) : (
                        <div>No {dataType === "amenity" ? "amenities" : "events"} in this category</div>
                    )}
                </div>

                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProviderTable;
