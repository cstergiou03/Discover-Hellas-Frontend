import React, { useState, useEffect } from "react";
import "../StyleAdmin/adminStatistics.css";
import AdminTable from "./AdminTable";
import DestinationsTable from "./DestinationsTable";
import CategoriesTable from "./CategoriesTable";  // Εισάγουμε το CategoriesTable

function AdminStatistics() {
    const [selectedItem, setSelectedItem] = useState(null); // Επιλογή στοιχείου από το ListBox
    const [openSections, setOpenSections] = useState({
        requests: true,
        stats: true,
        entity: true,
        cat: true,
    }); // Κατάσταση για το expand/collapse των τμημάτων
    const [amenities, setAmenities] = useState([]); // Δεδομένα για amenities
    const [events, setEvents] = useState([]); // Δεδομένα για events
    const [destinationCategories, setDestinationCategories] = useState([]); // Δεδομένα για destination categories
    const [amenityCategories, setAmenityCategories] = useState([]); // Δεδομένα για destination categories
    const [loading, setLoading] = useState(false); // Κατάσταση φόρτωσης
    const [error, setError] = useState(null); // Κατάσταση λάθους

    const handleClick = (item) => {
        setSelectedItem(item); // Ορισμός της επιλεγμένης επιλογής
        // Ανάλογα με την επιλογή, ανοίγουμε ή κλείνουμε την αντίστοιχη ενότητα
        if (item === "Requests") {
            setOpenSections(prev => ({ ...prev, requests: !prev.requests }));
        } else if (item === "Stats") {
            setOpenSections(prev => ({ ...prev, stats: !prev.stats }));
        } else if (item === "Entity") {
            setOpenSections(prev => ({ ...prev, entity: !prev.entity }));
        } else if (item === "Categories") {
            setOpenSections(prev => ({ ...prev, cat: !prev.cat }));
        }
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
            <div className="admin-list-box">
                <h3>Επιλογές</h3>
                <ul className="custom-list">
                    <li onClick={() => handleClick("Requests")}>
                        Αιτήματα {openSections.requests ? "▲" : "▼"}
                    </li>
                    {openSections.requests && (
                        <ul className="sub-list">
                            <li onClick={() => handleClick("Amenities")}>Παροχές</li>
                            <li onClick={() => handleClick("Events")}>Εκδηλώσεις</li>
                            <li onClick={() => handleClick("Users")}>Χρήστες</li>
                        </ul>
                    )}
                    <li onClick={() => handleClick("Stats")}>
                        Στατιστικά {openSections.stats ? "▲" : "▼"}
                    </li>
                    {openSections.stats && (
                        <ul className="sub-list">
                            <li onClick={() => handleClick("Stats1")}>Στατιστικά 1</li>
                            <li onClick={() => handleClick("Stats2")}>Στατιστικά 2</li>
                            <li onClick={() => handleClick("Stats3")}>Στατιστικά 3</li>
                        </ul>
                    )}
                    <li onClick={() => handleClick("Entity")}>
                        Οντότητες {openSections.entity ? "▲" : "▼"}
                    </li>
                    {openSections.entity && (
                        <ul className="sub-list">
                            <li onClick={() => handleClick("Destinations")}>Προορισμοί</li>
                            <li onClick={() => handleClick("Activities")}>Δραστηριότητες</li>
                        </ul>
                    )}
                    <li onClick={() => handleClick("Categories")}>
                        Κατηγορίες {openSections.cat ? "▲" : "▼"}
                    </li>
                    {openSections.cat && (
                        <ul className="sub-list">
                            <li onClick={() => handleClick("DestinationCategories")}>Κατηγορίες Προορισμών</li>
                            <li onClick={() => handleClick("AmenityCategories")}>Κατηγορίες Παροχών</li>
                        </ul>
                    )}
                </ul>
            </div>

            <div className="admin-content">
                {selectedItem && selectedItem !== "Requests" && selectedItem !== "Stats" && renderContent()}
            </div>
        </div>
    );
}

export default AdminStatistics;
