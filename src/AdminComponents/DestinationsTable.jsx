import React, { useState, useEffect } from "react";
import Records from "./Records";

function DestinationsTable() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageButtons, setPageButtons] = useState(5); // Αρχικά 5 κουμπιά σελίδων

    // Συνάρτηση για την αλλαγή του πλήθους των σελίδων όταν το πλάτος είναι μικρότερο από 950px
    useEffect(() => {
        const updatePageButtons = () => {
            if (window.innerWidth <= 950) {
                setItemsPerPage(3); // Εμφανίζουμε 3 κουμπιά σελίδων για μικρές οθόνες
            } else {
                setItemsPerPage(5); // Επαναφορά στα 5 κουμπιά για μεγαλύτερες οθόνες
            }
        };

        updatePageButtons(); // Καλέστε τη συνάρτηση κατά την αρχική φόρτωση
        window.addEventListener("resize", updatePageButtons); // Παρακολούθηση αλλαγής μεγέθους οθόνης

        return () => {
            window.removeEventListener("resize", updatePageButtons); // Καθαρισμός του event listener
        };
    }, []);

    // Στρατηγική για υπολογισμό τρέχουσας σελίδας
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = destinations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(destinations.length / itemsPerPage);

    // Συνάρτηση για την αλλαγή σελίδας
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Συνάρτηση για την ανανέωση των δεδομένων μετά τη διαγραφή
    const handleCategoryDelete = (categoryId) => {
        const updatedCategories = destinations.filter(category => category.destination_id !== categoryId);
        setDestinations(updatedCategories);
    };

    useEffect(() => {
        // Fetch από το endpoint για να πάρουμε τους προορισμούς
        fetch("https://discover-hellas-springboot-backend.onrender.com/api/destination/get/all")
            .then((response) => response.json())
            .then((data) => {
                setDestinations(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading destinations: {error.message}</div>;
    }

    return (
        <div className="destinations-table-container">
            <h2>Προορισμοί</h2>
            <div className="destinations-list">
                {currentItems.map((destination) => (
                    <Records key={destination.destination_id} data={destination} />
                ))}
            </div>

            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span>Σελίδα {currentPage} από {totalPages}</span>

                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default DestinationsTable;
