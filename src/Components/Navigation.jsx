import "../Style/navigation.css";
import request from "superagent";
import logo from "../assets/logo.png";
import React, { useState } from 'react';

function Navigation() {
    const [language, setLanguage] = useState('en');
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const toggleLanguage = () => {
        setLanguage(prevLanguage => (prevLanguage === 'en' ? 'gr' : 'en'));
    };

    const toggleRegisterModal = () => {
        setIsRegisterModalOpen(!isRegisterModalOpen);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const toggleLoginModal = () => {
        setIsLoginModalOpen(!isLoginModalOpen);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
    
        request
            .post('https://olympus-riviera.onrender.com/user')
            .set('Content-Type', 'application/json')
            .send({
                userId: "", // Μπορεί να χρειάζεται να το αφαιρέσεις αν το API δεν το απαιτεί
                username: name,
                password: password,
                email: email,
                role: "user"
            })
            .then((res) => {
                console.log("User created:", res.body);
                setSuccessMessage('User created successfully!');
                setIsRegisterModalOpen(false);
                setName('');
                setPassword('');
                setEmail('');
            })
            .catch((error) => {
                console.log("Error details:", error.response || error);
                setErrorMessage('Failed to connect to the server. Please check your network or try again later.');
            });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();

        request
            .post('https://olympus-riviera.onrender.com/login') // Αλλάξτε το URL αν χρειάζεται
            .set('Content-Type', 'application/json')
            .send({
                email: loginEmail,
                password: loginPassword,
            })
            .then((res) => {
                console.log("User logged in:", res.body);
                setSuccessMessage('Logged in successfully!');
                setIsLoginModalOpen(false);
                setLoginEmail('');
                setLoginPassword('');
            })
            .catch((error) => {
                console.log("Login error details:", error.response || error);
                setErrorMessage('Failed to log in. Please check your credentials and try again.');
            });
    };
    
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={logo} className="logo" alt="Logo" />
            </div>
            <div className="navbar-center">
                <ul className="nav-list">
                    <li className="dropdown">
                        <a href="/about">Προορισμοί</a>
                        <ul className="dropdown-content">
                            <li><a href="">Category 1</a></li>
                            <li><a href="">Category 2</a></li>
                        </ul>
                    </li>
                </ul>
                <a href="/trip">Οργάνωσε το ταξίδι σου</a>
                <a href="/events">Εκδηλώσεις</a>
                <a href="/experience">Εμπειρίες</a>
            </div>
            <div className="navbar-right">
                <button className="btn" onClick={toggleLoginModal}>Σύνδεση</button>
                <button className="btn" onClick={toggleRegisterModal}>Εγγραφή</button>
                <div className="language-switcher">
                    <button onClick={toggleLanguage} className="btn">
                        {language === 'en' ? 'EN' : 'GR'}
                    </button>
                </div>
            </div>

            {/* Register Modal */}
            {isRegisterModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleRegisterModal}>&times;</span>
                        <h2>Register</h2>
                        <form onSubmit={handleRegisterSubmit}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Password:
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>
                            <button type="submit" className="btn">Submit</button>
                        </form>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        {successMessage && <p className="success">{successMessage}</p>}
                    </div>
                </div>
            )}

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleLoginModal}>&times;</span>
                        <h2>Login</h2>
                        <form onSubmit={handleLoginSubmit}>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Password:
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                            </label>
                            <button type="submit" className="btn">Login</button>
                        </form>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        {successMessage && <p className="success">{successMessage}</p>}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navigation;
