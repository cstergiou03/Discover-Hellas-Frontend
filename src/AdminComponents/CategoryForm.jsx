import React, { useState } from "react";
import "../StyleAdmin/amenityFormAdmin.css";
import { useNavigate } from "react-router-dom";

function CategoryForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryFor: "",
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        const { name, description, categoryFor } = formData;

        if (!name || !description || !categoryFor) {
            alert("Please fill in all fields.");
            return;
        }

        const url =
            categoryFor === "Προορισμό"
                ? "https://olympus-riviera.onrender.com/api/admin/destination/category/create?" + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
                : "https://olympus-riviera.onrender.com/api/admin/amenity/category/create?" + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`;

        const body = {
            name,
            description,
        };

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Category created successfully!");
                    navigate("/admin");
                } else {
                    navigate("/admin");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                navigate("/admin");
            });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="amenity-form-container">
            <h1>Create Category</h1>
            <form className="amenity-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Category Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <label htmlFor="categoryFor">Κατηγορία για:</label>
                <select
                    id="categoryFor"
                    name="categoryFor"
                    value={formData.categoryFor}
                    onChange={handleChange}
                >
                    <option value="">Επιλέξτε κατηγορία</option>
                    <option value="Προορισμό">Προορισμό</option>
                    <option value="Παροχή">Παροχή</option>
                </select>

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <div className="action-buttons">
                    <button type="submit" className="more-btn">
                        Create Category
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CategoryForm;
