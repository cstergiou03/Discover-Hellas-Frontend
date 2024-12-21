import React, { useEffect, useState } from 'react';
import "../Style/filterButton.css";

function FilterButton({ onFilterChange }) {
    const [categories, setCategories] = useState([]);
    const [tempSelectedCategories, setTempSelectedCategories] = useState([]); // Για προσωρινή αποθήκευση επιλογών
    const [selectedCategories, setSelectedCategories] = useState([]); // Τρέχουσες επιλογές
    const [panelOpen, setPanelOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://olympus-riviera.onrender.com/api/admin/destination/category/get/all');
                const data = await response.json();
                setCategories(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setLoading(false);
            }
        };

        fetchCategories();
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
                    <h3>Κατηγορίες</h3>
                    {loading ? (
                        <p>Loading categories...</p>
                    ) : (
                        <ul>
                            {categories.map((category) => (
                                <li key={category.category_id}>
                                    <input
                                        type="checkbox"
                                        id={category.category_id}
                                        checked={tempSelectedCategories.includes(category.category_id)}
                                        onChange={() => handleCategoryChange(category.category_id)}
                                    />
                                    <label htmlFor={category.category_id}>{category.name}</label>
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
