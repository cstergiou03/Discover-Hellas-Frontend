import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Style/experienceMain.css";
import PageTopDestination from "./PageTopDestination";
import Footer from "./Footer";
import ExperienceData from "../../src/assets/activityData.json";
import ActivityRecord from "./ActivityRecord";
import { jwtDecode } from "jwt-decode";

function ActivityList() {
    const { categoryId } = useParams();
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [visitedEntities, setVisitedEntities] = useState([]);

    const destinationsPerPage = 5;
    const PageTopData = ExperienceData;

    // Fetch all destinations
    useEffect(() => {
        fetch("https://olympus-riviera.onrender.com/api/activity/get/all")
            .then((response) => response.json())
            .then((data) => {
                setDestinations(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching destinations:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const fetchVisitedEntities = async () => {
            try {
                const userToken = sessionStorage.getItem("userToken");

                if (!userToken) {
                    console.error("User token not found in sessionStorage");
                    return;
                }

                const decodedToken = jwtDecode(userToken);
                const userId = decodedToken.userId;

                const response = await fetch(
                    `https://olympus-riviera.onrender.com/api/user/visit/all/${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem("userToken")}`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }

                const result = await response.json();
                console.log("Full result:", result);

                // Εφόσον το result είναι πίνακας, παίρνουμε το πρώτο στοιχείο
                if (Array.isArray(result) && result.length > 0) {
                    const visits = result[0].visits; // Εδώ παίρνουμε τα visits
                    console.log("Visited entities:", visits);
                    setVisitedEntities(visits);
                } else {
                    console.error("Unexpected result format or empty array");
                }
            } catch (error) {
                console.error("Error fetching visited entities:", error);
            }
        };
        fetchVisitedEntities();
    }, [destinations]);

    // Fetch categories
    useEffect(() => {
        fetch("https://olympus-riviera.onrender.com/api/activity/category/get/all")
            .then((response) => response.json())
            .then((data) => {
                const categoriesWithAll = [{ category_id: "all", name: "All" }, ...data];
                setCategories(categoriesWithAll);

                // Προεπιλογή κατηγορίας
                if (categoryId && categoriesWithAll.some(cat => cat.category_id === categoryId)) {
                    setSelectedCategory(categoryId);
                } else {
                    setSelectedCategory("all");
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, [categoryId]);

    // Ενημέρωση της λίστας με βάση τις αλλαγές
    useEffect(() => {
        if (!loading) {
            filterDestinations(searchTerm, selectedCategory);
        }
    }, [loading, selectedCategory, searchTerm]);

    // Filter destinations based on search term and category
    const filterDestinations = (term, categoryId) => {
        let filtered = destinations;

        if (categoryId !== "all") {
            filtered = filtered.filter(
                (destination) => destination.category_id === categoryId
            );
        }

        if (term) {
            filtered = filtered.filter((destination) =>
                destination.name.toLowerCase().includes(term)
            );
        }

        setFilteredDestinations(filtered);
        setCurrentPage(1);  // Reset to first page after filtering
    };

    // Handle search input
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
    };

    // Handle filter dropdown
    const handleFilter = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    // Pagination logic
    const indexOfLastDestination = currentPage * destinationsPerPage;
    const indexOfFirstDestination = indexOfLastDestination - destinationsPerPage;
    const currentDestinations = filteredDestinations.slice(
        indexOfFirstDestination,
        indexOfLastDestination
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
                    disabled={categoryId !== undefined && categoryId !== "all"}
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
                    {currentDestinations.map((destination) => (
                        <ActivityRecord
                            key={destination.activity_id}
                            data={destination}
                            isVisited={visitedEntities.some(
                                (visit) => visit.entity_id === destination.activity_id
                            )}
                        />
                    ))}
                </div>
            )}

            {!loading && (
                <div className="pagination">
                    {Array.from(
                        { length: Math.ceil(filteredDestinations.length / destinationsPerPage) },
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

export default ActivityList;
