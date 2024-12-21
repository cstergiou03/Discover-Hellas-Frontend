import { useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";
import { useState, useEffect } from "react";
import "../Style/header.css";
import LoginModal from "./LoginModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Header() {
    const [loggedIn, setLoggedIn] = useState(false); // Μετατροπή σε κατάσταση
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [language, setLanguage] = useState("GR");
    const [categories, setCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://olympus-riviera.onrender.com/api/admin/destination/category/get/all")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    const handleLanguageChange = () => {
        setLanguage((prevLanguage) => (prevLanguage === "GR" ? "EN" : "GR"));
    };

    const handleTravelClick = (event) => {
        event.preventDefault();
        navigate("/map");
    };

    const handleHomeTravelClick = (event) => {
        event.preventDefault();
        navigate("/");
    };

    const handleCalendarTravelClick = (event) => {
        event.preventDefault();
        navigate("/calendar");
    };

    const handleExperiencelClick = (event) => {
        event.preventDefault();
        navigate("/experience");
    };

    const handleProviderlClick = (event) => {
        event.preventDefault();
        navigate("/amenity");
    };

    const handleLoginClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <header className="header">
            <img src={logo} alt="Company Logo" className="logo2" onClick={handleHomeTravelClick} />
            <nav className="navigation">
                <div 
                    className="dropdown"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                >
                    <span className="dropdown-title">Προορισμοί</span>
                    {isDropdownOpen && (
                        <ul>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <li key={category.category_id}>
                                        <span onClick={() => navigate(`/experience/${category.category_id}`)}>
                                            {category.name}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <li>Loading...</li>
                            )}
                        </ul>
                    )}
                </div>
                <a onClick={handleTravelClick}>Οργάνωσε το ταξίδι σου</a>
                <a onClick={handleCalendarTravelClick}>Εκδηλώσεις</a>
                <a onClick={handleExperiencelClick}>Εμπειρίες</a>
                <a onClick={handleProviderlClick}>Παροχές</a>
                <input placeholder="Search..." />
                <button onClick={handleLanguageChange}>{language}</button>

                {loggedIn ? (
                    <button className="user-icon">
                        <FontAwesomeIcon icon={faUser} size="lg" />
                    </button>
                ) : (
                    <button className="login-button" onClick={handleLoginClick}>
                        Login
                    </button>
                )}
            </nav>

            <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} setLoggedIn={setLoggedIn} />
        </header>
    );
}

export default Header;
