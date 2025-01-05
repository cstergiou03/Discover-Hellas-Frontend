import React from "react";
import "../Style/experienceRecord.css";

function CategoryRecord({ data, onDelete }) {
    const handleDelete = () => {
        const url = `https://olympus-riviera.onrender.com/api/admin/destination/category/${data.category_id}`;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Αν χρειάζεστε κάποιο token ή authorization, το προσθέτετε εδώ
                // 'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (response.ok) {
                alert("Η κατηγορία διαγράφηκε επιτυχώς.");
                onDelete(data.category_id);  // Καλούμε την onDelete του γονέα για να ανανεώσουμε τα δεδομένα
            } else {
                alert("Σφάλμα κατά τη διαγραφή της κατηγορίας.");
            }
        })
        .catch(error => {
            console.error("Σφάλμα:", error);
            alert("Σφάλμα κατά τη διαγραφή της κατηγορίας.");
        });
    };

    return (
        <div className="experience-record">
            <div className="record-column">{data.name}</div>
            <div className="record-column">{data.description}</div>
            <div className="record-column">
                <button 
                    className="more-btn" 
                    style={{ backgroundColor: "red" }} 
                    onClick={handleDelete}
                >
                    Διαγραφή Κατηγορίας
                </button>
            </div>
        </div>
    );
}

export default CategoryRecord;
