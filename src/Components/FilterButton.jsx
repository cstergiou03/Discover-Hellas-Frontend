import React, { useEffect, useState } from 'react';
import "../Style/filterButton.css";

function FilterButton({ onFilterChange }) {
    const [destinationCategories, setDestinationCategories] = useState([]);
    const [amenityCategories, setAmenityCategories] = useState([]);
    const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [panelOpen, setPanelOpen] = useState(false);
    const [loadingDestinations, setLoadingDestinations] = useState(true);
    const [loadingAmenities, setLoadingAmenities] = useState(true);

    useEffect(() => {
        const fetchDestinationCategories = async () => {
            try {
                const response = await fetch('https://olympus-riviera.onrender.com/api/admin/destination/category/get/all');
                const data = await response.json();
                setDestinationCategories(data);
                setLoadingDestinations(false);
            } catch (error) {
                console.error('Error fetching destination categories:', error);
                setLoadingDestinations(false);
            }
        };

        const fetchAmenityCategories = async () => {
            try {
                const response = await fetch('https://olympus-riviera.onrender.com/api/amenity/category/get/all');
                const data = await response.json();
                setAmenityCategories(data);
                setLoadingAmenities(false);
            } catch (error) {
                console.error('Error fetching amenity categories:', error);
                setLoadingAmenities(false);
            }
        };

        fetchDestinationCategories();
        fetchAmenityCategories();
    }, []);

    const handleCategoryChange = (categoryId) => {
        const updatedTempCategories = tempSelectedCategories.includes(categoryId)
            ? tempSelectedCategories.filter(id => id !== categoryId)
            : [...tempSelectedCategories, categoryId];

        setTempSelectedCategories(updatedTempCategories);
    };

    const applyFilters = () => {
        setSelectedCategories(tempSelectedCategories);
        onFilterChange(tempSelectedCategories);
    };

    return (
        <div className="filter-button-container">
            <button
                className="filter-button"
                onClick={() => {
                    setPanelOpen(!panelOpen);
                    setTempSelectedCategories(selectedCategories);
                }}
            >
                ⚙️ Φίλτρα
            </button>

            {panelOpen && (
                <div className="filter-panel">
                    <h3>Κατηγορίες Προορισμών</h3>
                    {loadingDestinations ? (
                        <p>Loading destination categories...</p>
                    ) : (
                        <ul>
                            {destinationCategories.map((category) => (
                                <li key={category.category_id}>
                                    <input
                                        type="checkbox"
                                        id={`destination-${category.category_id}`}
                                        checked={tempSelectedCategories.includes(category.category_id)}
                                        onChange={() => handleCategoryChange(category.category_id)}
                                    />
                                    <label htmlFor={`destination-${category.category_id}`}>{category.name}</label>
                                </li>
                            ))}
                        </ul>
                    )}

                    <h3>Κατηγορίες Παροχών</h3>
                    {loadingAmenities ? (
                        <p>Loading amenity categories...</p>
                    ) : (
                        <ul>
                            {amenityCategories.map((category) => (
                                <li key={category.category_id}>
                                    <input
                                        type="checkbox"
                                        id={`amenity-${category.category_id}`}
                                        checked={tempSelectedCategories.includes(category.category_id)}
                                        onChange={() => handleCategoryChange(category.category_id)}
                                    />
                                    <label htmlFor={`amenity-${category.category_id}`}>{category.name}</label>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="filter-buttons">
                        <button onClick={() => setPanelOpen(false)} className="close-panel-button">
                            Κλείσιμο
                        </button>
                        <button onClick={applyFilters} className="apply-button">
                            Εφαρμογή
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterButton;
