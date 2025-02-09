import "../Style/registerPanel.css";
import Header from "./Header";
import logo from "../../src/assets/logo2.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPanel() {
    const [isProvider, setIsProvider] = useState(false);
    const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
    const googleSignUpButtonRef = useRef(null);

    const navigate = useNavigate();

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

    const handleGoogleSignUp = async (response) => {
        console.log("Google Sign-Up Response:", response);
    
        if (response.credential) {
            const jwt_token = response.credential;
            const role = isProvider ? "PROVIDER" : "REGISTERED"; // Εναλλαγή ρόλου βάσει επιλογής
            const requestBody = {
                jwt_token,
                role,
            };
    
            try {
                const apiResponse = await fetch(
                    "https://discover-hellas-springboot-backend.onrender.com/api/user/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(requestBody),
                    }
                );
    
                const data = await apiResponse.json();
    
                if (apiResponse.ok) {
                    console.log("User registered successfully:", data);
    
                    // Αποθήκευση του jwt_token και loggedIn στο localStorage
                    localStorage.setItem("token", data.jwt_token);
                    localStorage.setItem("loggedIn", "true");
    
                    console.log("Token saved to localStorage:", data.jwt_token);
    
                    // Redirect στη ρίζα (/)
                    navigate("/");
                } else {
                    console.error("Registration failed:", data);
                }
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
