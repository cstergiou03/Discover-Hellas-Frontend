import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/loginModal.css";

function LoginModal({ isOpen, onClose, setLoggedIn }) {
    const [googleSignInError, setGoogleSignInError] = useState("");
    const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
    const googleSignInButtonRef = useRef(null);

    const navigate = useNavigate();

    const provider = false;
    const admin = false;

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
            console.log("JWT Token:", response.credential);
            
            try {
                // Αποθηκεύουμε το JWT token στο localStorage
                localStorage.setItem("userToken", response.credential);
    
                // Αποθηκεύουμε το status loggedIn
                setLoggedIn(true);
    
                // Ανάλογα με τον τύπο χρήστη κάνουμε την πλοήγηση
                if (provider) {
                    navigate("/provider");
                } else if (admin) {
                    navigate("/admin");
                } else {
                    onClose();
                }
            } catch (error) {
                console.error("Error storing the token:", error);
                setGoogleSignInError("Something went wrong with Google login. Please try again.");
            }
        } else {
            setGoogleSignInError("Something went wrong with Google login. Please try again.");
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
            <div className="login-modal-overlay">
                <div className="login-modal-content">
                    <button className="close-btn" onClick={onClose}>X</button>

                    <h2>Login</h2>

                    <div ref={googleSignInButtonRef}></div>
                    {googleSignInError && <p style={{ color: "red" }}>{googleSignInError}</p>}

                    <div className="register-section">
                        <p>Δεν έχετε λογαριασμό;<a onClick={handleRegisterTravel}> Δημιουργήστε</a></p>
                    </div>
                </div>
            </div>
        )
    );
}

export default LoginModal;
