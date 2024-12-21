import React, { useEffect, useState } from "react";
import "../Style/experienceMain.css";
import PageTopDestination from "./PageTopDestination";
import Footer from "./Footer";
import AmenityRecord from "./AmenityRecord";
import ProviderData from "../assets/providerData.json";

function AmenityMain() {
    const [amenities, setAmenities] = useState([]);  // Ενημερώνουμε το όνομα της μεταβλητής
    const [filteredAmenities, setFilteredAmenities] = useState([]);  // Ενημερώνουμε το όνομα της μεταβλητής
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const amenitiesPerPage = 5;  // Ενημερώνουμε το όνομα της μεταβλητής
    const PageTopData = ProviderData;

    // Fetch all amenities
    useEffect(() => {
        fetch("https://olympus-riviera.onrender.com/api/amenity/get/all")
            .then((response) => response.json())
            .then((data) => {
                setAmenities(data);  // Ενημερώνουμε το όνομα της μεταβλητής
                setFilteredAmenities(data);  // Ενημερώνουμε το όνομα της μεταβλητής
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching amenities:", error);  // Ενημερώνουμε το όνομα
                setLoading(false);
            });
    }, []);

    // Fetch categories
    useEffect(() => {
        fetch("https://olympus-riviera.onrender.com/api/amenity/category/get/all")
            .then((response) => response.json())
            .then((data) => {
                setCategories([{ category_id: "all", name: "All" }, ...data]);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    // Handle search input
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        filterAmenities(term, selectedCategory);  // Ενημερώνουμε το όνομα της μεταβλητής
    };

    // Handle filter dropdown
    const handleFilter = (categoryId) => {
        setSelectedCategory(categoryId);

        filterAmenities(searchTerm, categoryId);  // Ενημερώνουμε το όνομα της μεταβλητής
    };

    // Filter amenities based on search term and category
    const filterAmenities = (term, categoryId) => {
        let filtered = amenities;  // Ενημερώνουμε το όνομα της μεταβλητής

        if (categoryId !== "all") {
            filtered = filtered.filter(
                (amenity) => amenity.category_id === categoryId  // Ενημερώνουμε το όνομα της μεταβλητής
            );
        }

        if (term) {
            filtered = filtered.filter((amenity) =>  // Ενημερώνουμε το όνομα της μεταβλητής
                amenity.name.toLowerCase().includes(term)
            );
        }

        setFilteredAmenities(filtered);  // Ενημερώνουμε το όνομα της μεταβλητής
        setCurrentPage(1);
    };

    // Pagination logic
    const indexOfLastAmenity = currentPage * amenitiesPerPage;  // Ενημερώνουμε το όνομα της μεταβλητής
    const indexOfFirstAmenity = indexOfLastAmenity - amenitiesPerPage;  // Ενημερώνουμε το όνομα της μεταβλητής
    const currentAmenities = filteredAmenities.slice(  // Ενημερώνουμε το όνομα της μεταβλητής
        indexOfFirstAmenity,
        indexOfLastAmenity
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="experience-main-container">
            <PageTopDestination data={PageTopData} />

            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => handleFilter(e.target.value)}
                    className="filter-select"
                >
                    {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="experience-table">
                    {currentAmenities.map((amenity) => (  // Ενημερώνουμε το όνομα της μεταβλητής
                        <AmenityRecord key={amenity.destination_id} data={amenity} />  // Ενημερώνουμε το όνομα της μεταβλητής
                    ))}
                </div>
            )}

            {!loading && (
                <div className="pagination">
                    {Array.from(
                        { length: Math.ceil(filteredAmenities.length / amenitiesPerPage) },  // Ενημερώνουμε το όνομα της μεταβλητής
                        (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`pagination-button ${
                                    currentPage === index + 1 ? "active" : ""
                                }`}
                            >
                                {index + 1}
                            </button>
                        )
                    )}
                </div>
            )}

            <Footer />
        </div>
    );
}

export default AmenityMain;
