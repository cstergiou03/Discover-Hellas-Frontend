import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/loginModal.css";

function LoginModal({ isOpen, onClose, setLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [googleSignInError, setGoogleSignInError] = useState("");
    const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
    const googleSignInButtonRef = useRef(null);

    const navigate = useNavigate();

    const provider = true;

    useEffect(() => {
        if (isOpen) {
            if (!window.google || !window.google.accounts) {
                const script = document.createElement("script");
                script.src = "https://accounts.google.com/gsi/client";
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    setIsGoogleScriptLoaded(true);
                };
                document.body.appendChild(script);
            } else {
                initializeGoogleLogin();
            }
        }

        return () => {
            setIsGoogleScriptLoaded(false);
        };
    }, [isOpen]);

    const initializeGoogleLogin = () => {
        if (isGoogleScriptLoaded && googleSignInButtonRef.current) {
            window.google.accounts.id.initialize({
                client_id: "8002692462-0m4n72frcfp3obipnla4297prlmgs2rm.apps.googleusercontent.com",
                callback: handleGoogleSignIn,
            });

            window.google.accounts.id.renderButton(
                googleSignInButtonRef.current,
                {
                    theme: "outline",
                    size: "large",
                    text: "signin_with",
                }
            );
        }
    };

    const handleGoogleSignIn = (response) => {
        console.log("Google Response:", response);
        if (response.credential) {
            console.log("Logged in with Google:", response);
            setLoggedIn(true); // Αλλαγή του `loggedIn` στο Header
            if (provider) {
                navigate("/provider"); // Navigate to /provider if provider is true
            } else {
                onClose(); // Κλείσιμο του modal
            }
        } else {
            setGoogleSignInError("Something went wrong with Google login. Please try again.");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
        setLoggedIn(true); // Αλλαγή του `loggedIn` στο Header
        if (provider) {
            navigate("/provider"); // Navigate to /provider if provider is true
        } else {
            onClose(); // Κλείσιμο του modal
        }
    };


    useEffect(() => {
        if (isGoogleScriptLoaded) {
            initializeGoogleLogin();
        }
    }, [isGoogleScriptLoaded]);

    const handleRegisterTravel = (event) => {
        event.preventDefault();
        navigate("/register");
    };

    return (
        isOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="close-btn" onClick={onClose}>X</button>

                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>

                    <div ref={googleSignInButtonRef}></div>
                    {googleSignInError && <p style={{ color: "red" }}>{googleSignInError}</p>}

                    <div className="register-section">
                        <p>Δεν έχετε λογαρισμό;<a onClick={handleRegisterTravel}> Δημιουργήστε</a></p>
                    </div>
                </div>
            </div>
        )
    );
}

export default LoginModal;

