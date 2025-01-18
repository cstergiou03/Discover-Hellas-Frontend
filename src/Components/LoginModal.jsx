import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/loginModal.css";
import { jwtDecode } from 'jwt-decode';

function LoginModal({ isOpen, onClose, setLoggedIn }) {
    const [googleError, setGoogleError] = useState("");
    const googleSignInButtonRef = useRef(null);
    const googleSignUpButtonRef = useRef(null);

    const navigate = useNavigate();
    const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

    useEffect(() => {
        // Φόρτωση του Google script μόνο μία φορά
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
            setIsGoogleScriptLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isOpen && isGoogleScriptLoaded) {
            initializeGoogleButtons();
        }
    }, [isOpen, isGoogleScriptLoaded]);

    const initializeGoogleButtons = () => {
        if (googleSignInButtonRef.current) {
            googleSignInButtonRef.current.innerHTML = "";
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

        if (googleSignUpButtonRef.current) {
            googleSignUpButtonRef.current.innerHTML = "";
            window.google.accounts.id.initialize({
                client_id: "8002692462-0m4n72frcfp3obipnla4297prlmgs2rm.apps.googleusercontent.com",
                callback: handleGoogleSignUp,
            });
            window.google.accounts.id.renderButton(
                googleSignUpButtonRef.current,
                {
                    theme: "outline",
                    size: "large",
                    text: "signup_with",
                }
            );
        }
    };

    const handleGoogleSignIn = async (response) => {
        if (response.credential) {
            console.log("Google Login Response:", response);
            try {
                const jwt_token = response.credential;
    
                // Κάνε το POST request στο backend για το login
                const apiResponse = await fetch("https://olympus-riviera.onrender.com/api/user/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jwt_token }),
                });
    
                const data = await apiResponse.json();
    
                if (apiResponse.ok) {
                    // Αν η απάντηση είναι επιτυχής, αποθήκευσε το νέο jwt_token στο sessionStorage
                    sessionStorage.setItem("userToken", data.jwt_token);  // Αποθήκευση του token στο sessionStorage
                    const decodedToken = jwtDecode(data.jwt_token);

                    // Ελέγξτε το πεδίο "role" στην απάντηση και κάνετε navigate στην κατάλληλη διαδρομή
                    if (decodedToken.role === "REGISTERED") {
                        navigate("/"); // Αν ο ρόλος είναι "REGISTERED", πήγαινε στην αρχική σελίδα
                    } else if (decodedToken.role === "PROVIDER") {
                        navigate("/provider"); // Αν ο ρόλος είναι "PROVIDER", πήγαινε στη σελίδα παρόχου
                    } else if (decodedToken.role === "ADMIN") {
                        navigate("/admin"); // Αν ο ρόλος είναι "ADMIN", πήγαινε στη σελίδα διαχείρισης
                    }
    
                    setLoggedIn(true);
                    onClose();
                } else {
                    setGoogleError("Login failed. Please try again.");
                }
            } catch (error) {
                console.error("Login error:", error);
                setGoogleError("Something went wrong with Google login. Please try again.");
            }
        } else {
            setGoogleError("Something went wrong with Google login. Please try again.");
        }
    };    

    const handleGoogleSignUp = async (response) => {
        if (response.credential) {
            const jwt_token = response.credential;
            console.log(jwt_token);
            const role = "PROVIDER";
            const requestBody = { jwt_token, role };

            try {
                const apiResponse = await fetch(
                    "https://olympus-riviera.onrender.com/api/user/register",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(requestBody),
                    }
                );

                const data = await apiResponse.json();
                if (apiResponse.ok) {
                    sessionStorage.setItem("token", data.jwt_token);  // Χρησιμοποιούμε sessionStorage
                    sessionStorage.setItem("loggedIn", "true");  // Χρησιμοποιούμε sessionStorage
                    navigate("/");
                } else {
                    setGoogleError("Registration failed. Please try again.");
                }
            } catch (error) {
                console.error("Sign-Up error:", error);
                setGoogleError("Something went wrong during registration. Please try again.");
            }
        } else {
            setGoogleError("Something went wrong during registration. Please try again.");
        }
    };

    return (
        isOpen && (
            <div className="login-modal-overlay">
                <div className="login-modal-content">
                    <button className="close-btn" onClick={onClose}>
                        X
                    </button>
                    <h2>Σύνδεση</h2>
                    <div ref={googleSignInButtonRef}></div>

                    <h2 style={{ marginTop: "20px" }}>Εγγραφή σαν Πάροχος</h2>
                    <div ref={googleSignUpButtonRef}></div>

                    {googleError && <p style={{ color: "red" }}>{googleError}</p>}
                </div>
            </div>
        )
    );
}

export default LoginModal;
