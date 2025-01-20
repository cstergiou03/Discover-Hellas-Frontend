import { useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";
import { useState, useEffect } from "react";
import "../Style/header.css";
import LoginModal from "./LoginModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FaBars } from 'react-icons/fa';

function Header() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [language, setLanguage] = useState("GR");
    const [categories, setCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Initialize loggedIn state in sessionStorage to false if not already set
        if (sessionStorage.getItem('userToken') === null) {
            sessionStorage.setItem('userToken', '');  // Set to empty if no userToken is present
        }

        // Check if userToken exists in sessionStorage
        const storedUserToken = sessionStorage.getItem('userToken');
        setLoggedIn(!!storedUserToken);  // If there's a userToken, set loggedIn to true

        // Fetch categories from API
        fetch("https://olympus-riviera.onrender.com/api/destination/category/get/all")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Error fetching categories:", error));

        // Check if screen is mobile (adjust the breakpoint as needed)
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 970);
        };

        checkMobile(); // Initial check
        window.addEventListener('resize', checkMobile); // Update on resize

        // Cleanup event listener
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
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
        navigate("/activity");
    };

    const handleProviderlClick = (event) => {
        event.preventDefault();
        navigate("/amenity");
    };

    const handleLoginClick = () => {
        if (isMobile) {
            setIsMenuOpen(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUserIconClick = () => {
        navigate("/profile");
    };

    // Update loggedIn state and save to sessionStorage
    const handleLoginSuccess = () => {
        setLoggedIn(true);
        sessionStorage.setItem('loggedIn', 'true');
        localStorage.removeItem('guestPlan');
    };

    // Logout functionality
    const handleLogout = () => {
        setLoggedIn(false);
        sessionStorage.removeItem('userToken');
        sessionStorage.setItem('loggedIn', 'false');
        navigate("/");
    };
    

    // Toggle the mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Non-Mobile UI */}
            {!isMobile ? (
                <header className="header">
                    <img src={logo} alt="Company Logo" className="logo2" onClick={handleHomeTravelClick} />
                    <nav className="navigation">
                        <div
                            className="dropdown"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <span className="dropdown-title" onClick={() => navigate("/destination")}>Προορισμοί</span>
                            {isDropdownOpen && (
                                <ul>
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <li key={category.category_id}>
                                                <span onClick={() => navigate(`/destinations/${category.category_id}`)}>
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
                        <a onClick={handleExperiencelClick}>Δραστηριότητες</a>
                        <a onClick={handleProviderlClick}>Παροχές</a>
                        <button onClick={handleLanguageChange}>{language}</button>

                        {loggedIn ? (
                            <>
                                <button className="user-icon" onClick={handleUserIconClick}>
                                    <FontAwesomeIcon icon={faUser} size="lg" />
                                </button>
                                <button onClick={handleLogout}>Αποσύνδεση</button>
                            </>
                        ) : (
                            <button className="login-button" onClick={handleLoginClick}>
                                Σύνδεση
                            </button>
                        )}
                    </nav>

                    <LoginModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        setLoggedIn={handleLoginSuccess}
                    />
                </header>
            ) : (
                /* Mobile UI */
                <header className="mobile-header">
                    <button onClick={toggleMenu} className="logo-button">
                        <FaBars />
                    </button>
                    <div>
                        <img src={logo} alt="Company Logo" className="mobile-logo" onClick={handleHomeTravelClick} />
                    </div>
                </header>
            )}

            {/* Mobile Menu - Conditional Rendering */}
            <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                <a onClick={handleTravelClick}>Οργάνωσε το ταξίδι σου</a>
                <a onClick={handleCalendarTravelClick}>Εκδηλώσεις</a>
                <a onClick={handleExperiencelClick}>Δραστηριότητες</a>
                <a onClick={handleProviderlClick}>Παροχές</a>
                <button onClick={handleLanguageChange}>{language}</button>
                {loggedIn ? (
                    <>
                        <button className="user-icon" onClick={handleUserIconClick}>
                            <FontAwesomeIcon icon={faUser} size="lg" />
                        </button>
                        <button onClick={handleLogout}>Αποσύνδεση</button>
                    </>
                ) : (
                    <button className="login-button" onClick={handleLoginClick}>
                        Σύνδεση
                    </button>
                )}
            </nav>

            <LoginModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                setLoggedIn={handleLoginSuccess}
            />
        </>
    );
}

export default Header;
