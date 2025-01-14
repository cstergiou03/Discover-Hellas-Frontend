import "../Style/registerPanel.css";
import Header from "./Header";
import logo from "../../src/assets/logo2.png";
import { useState, useEffect, useRef } from "react";

function RegisterPanel() {
    const [isProvider, setIsProvider] = useState(false);
    const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
    const googleSignUpButtonRef = useRef(null);

    useEffect(() => {
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
            initializeGoogleSignUp();
        }
    }, []);

    const initializeGoogleSignUp = () => {
        if (isGoogleScriptLoaded && googleSignUpButtonRef.current) {
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

    const handleGoogleSignUp = (response) => {
        console.log("Google Sign-Up Response:", response);

        if (response.credential) {
            console.log("JWT Token for Sign-Up:", response);

            try {
                // Εδώ μπορείς να διαχειριστείς την εγγραφή
                console.log("User registered successfully!");
            } catch (error) {
                console.error("Error during Google Sign-Up:", error);
            }
        } else {
            console.error("Something went wrong with Google Sign-Up.");
        }
    };

    useEffect(() => {
        if (isGoogleScriptLoaded) {
            initializeGoogleSignUp();
        }
    }, [isGoogleScriptLoaded]);

    const handleToggleChange = () => {
        setIsProvider(!isProvider);
    };

    return (
        <div className="register-panel-container">
            <Header />
            <div className="panel-container">
                <img src={logo} alt="Logo" />
                <div className="register-form-container">
                    <h2>Εγγραφή</h2>

                    <div className="toggle-switch">
                        <label>Θέλετε να γίνεται πάροχος;</label>
                        <div
                            className={`switch ${isProvider ? "active" : ""}`}
                            onClick={handleToggleChange}
                        >
                            <div className="slider"></div>
                        </div>
                    </div>

                    <div ref={googleSignUpButtonRef}></div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPanel;
