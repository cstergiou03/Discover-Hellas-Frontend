import React, { useState, useEffect } from "react";
import "../StyleAdmin/adminStatistics.css";
import AdminTable from "./AdminTable";
import DestinationsTable from "./DestinationsTable";
import CategoriesTable from "./CategoriesTable";  // Εισάγουμε το CategoriesTable

function AdminStatistics() {
    const [selectedItem, setSelectedItem] = useState(null); // Επιλογή στοιχείου από το ListBox
    const [openSection, setOpenSection] = useState(null); // Μόνο ένα ανοιχτό τμήμα
    const [amenities, setAmenities] = useState([]); // Δεδομένα για amenities
    const [events, setEvents] = useState([]); // Δεδομένα για events
    const [destinationCategories, setDestinationCategories] = useState([]); // Δεδομένα για destination categories
    const [amenityCategories, setAmenityCategories] = useState([]); // Δεδομένα για destination categories
    const [loading, setLoading] = useState(false); // Κατάσταση φόρτωσης
    const [error, setError] = useState(null); // Κατάσταση λάθους

    const handleClick = (item) => {
        setSelectedItem(item); // Ορισμός της επιλεγμένης επιλογής
        // Αν το section που κλικάρεται είναι ήδη ανοιχτό, το κλείνουμε. Διαφορετικά, το ανοίγουμε.
        setOpenSection((prevSection) => (prevSection === item ? null : item));
    };

    useEffect(() => {
        if (selectedItem === "Amenities") {
            setLoading(true);
            fetch("https://olympus-riviera.onrender.com/api/admin/amenity/get/all")
                .then((response) => response.json())
                .then((data) => {
                    setAmenities(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError("Σφάλμα κατά τη φόρτωση των amenities.");
                    setLoading(false);
                });
        }

        if (selectedItem === "Events") {
            setLoading(true);
            fetch("https://olympus-riviera.onrender.com/api/admin/event/get/all")
                .then((response) => response.json())
                .then((data) => {
                    setEvents(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError("Σφάλμα κατά τη φόρτωση των events.");
                    setLoading(false);
                });
        }

        if (selectedItem === "DestinationCategories") {
            setLoading(true);
            fetch("https://olympus-riviera.onrender.com/api/admin/destination/category/get/all")
                .then((response) => response.json())
                .then((data) => {
                    setDestinationCategories(data); // Αποθήκευση των δεδομένων των κατηγοριών προορισμών
                    setLoading(false);
                })
                .catch((err) => {
                    setError("Σφάλμα κατά τη φόρτωση των κατηγοριών προορισμών.");
                    setLoading(false);
                });
        }

        if (selectedItem === "AmenityCategories") {
            setLoading(true);
            fetch("https://olympus-riviera.onrender.com/api/amenity/category/get/all")
                .then((response) => response.json())
                .then((data) => {
                    setAmenityCategories(data); // Αποθήκευση των δεδομένων των κατηγοριών προορισμών
                    setLoading(false);
                })
                .catch((err) => {
                    setError("Σφάλμα κατά τη φόρτωση των κατηγοριών προορισμών.");
                    setLoading(false);
                });
        }
    }, [selectedItem]);

    const renderContent = () => {
        if (loading) {
            return <div>Φόρτωση δεδομένων...</div>;
        }
        if (error) {
            return <div>{error}</div>;
        }
        switch (selectedItem) {
            case "Amenities":
                return <AdminTable data={amenities} dataType="amenity" />;
            case "Events":
                return <AdminTable data={events} dataType="event" />;
            case "Destinations":
                return <DestinationsTable data={events} dataType="event" />;
            case "DestinationCategories":
                return <CategoriesTable data={destinationCategories} dataType="destinationCategory" />;
            case "AmenityCategories":
                return <CategoriesTable data={amenityCategories} dataType="amenityCategory" />;
            default:
                return <div>Επιλέξτε μια επιλογή από τη λίστα για να δείτε δεδομένα.</div>;
        }
    };

    return (
        <div className="admin-container">
            <h2>Διαχείριση Στοιχείων</h2>
            
            {/* Αιτήματα */}
            <h3 onClick={() => handleClick("requests")}>
                Αιτήματα {openSection === "requests" ? "▲" : "▼"}
            </h3>
            {openSection === "requests" && (
                <div className="section-content">
                    <h4 onClick={() => handleClick("Amenities")}>Παροχές</h4>
                    <h4 onClick={() => handleClick("Events")}>Εκδηλώσεις</h4>
                    <h4 onClick={() => handleClick("Users")}>Χρήστες</h4>
                </div>
            )}

            {/* Στατιστικά */}
            <h3 onClick={() => handleClick("stats")}>
                Στατιστικά {openSection === "stats" ? "▲" : "▼"}
            </h3>
            {openSection === "stats" && (
                <div className="section-content">
                    <h4 onClick={() => handleClick("Stats1")}>Στατιστικά 1</h4>
                    <h4 onClick={() => handleClick("Stats2")}>Στατιστικά 2</h4>
                    <h4 onClick={() => handleClick("Stats3")}>Στατιστικά 3</h4>
                </div>
            )}

            {/* Οντότητες */}
            <h3 onClick={() => handleClick("entity")}>
                Οντότητες {openSection === "entity" ? "▲" : "▼"}
            </h3>
            {openSection === "entity" && (
                <div className="section-content">
                    <h4 onClick={() => handleClick("Destinations")}>Προορισμοί</h4>
                    <h4 onClick={() => handleClick("Activities")}>Δραστηριότητες</h4>
                </div>
            )}

            {/* Κατηγορίες */}
            <h3 onClick={() => handleClick("cat")}>
                Κατηγορίες {openSection === "cat" ? "▲" : "▼"}
            </h3>
            {openSection === "cat" && (
                <div className="section-content">
                    <h4 onClick={() => handleClick("DestinationCategories")}>Κατηγορίες Προορισμών</h4>
                    <h4 onClick={() => handleClick("AmenityCategories")}>Κατηγορίες Παροχών</h4>
                </div>
            )}

            {/* Περιεχόμενο */}
            <div className="admin-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminStatistics;
