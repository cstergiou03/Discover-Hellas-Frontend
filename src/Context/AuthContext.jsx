import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Προσθήκη του loading state
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = sessionStorage.getItem("userToken");

        // console.log("Stored Token:", storedToken); // Για debugging

        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);
                // console.log("Decoded Token:", decodedToken);

                // Ελέγχουμε αν το token έχει λήξει
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    console.warn("Token expired");
                    sessionStorage.removeItem("userToken");
                    sessionStorage.setItem("loggedIn", false);
                    setUser(null);
                    navigate("/"); // Ανακατεύθυνση αν το token είναι ληγμένο
                } else {
                    setUser(decodedToken); // Αν το token είναι έγκυρο
                }
            } catch (error) {
                console.error("Invalid token:", error);
                sessionStorage.removeItem("userToken");
                setUser(null);
                navigate("/"); // Αν το token είναι άκυρο
            }
        } else {
            setUser(null); // Αν δεν υπάρχει token
        }

        setLoading(false); // Ολοκλήρωση της διαδικασίας φόρτωσης
    }, [navigate]); // Εκτελείται μόνο όταν γίνεται ανανέωση

    const login = (token) => {
        sessionStorage.setItem("userToken", token); // Αποθήκευση του token στο sessionStorage
        const decodedToken = jwtDecode(token);
        setUser(decodedToken); // Ενημέρωση του χρήστη στο AuthContext
        console.log("Decoded Token:", decodedToken.role);

        // Redirect με βάση τον ρόλο
        if (decodedToken.role === "REGISTERED") {
            // navigate("/"); // Στην αρχική σελίδα για χρήστες "REGISTERED"
        } else if (decodedToken.role === "PROVIDER") {
            navigate("/provider"); // Στη σελίδα του παρόχου για χρήστες "PROVIDER"
        } else if (decodedToken.role === "ADMIN") {
            navigate("/admin"); // Στη σελίδα διαχείρισης για χρήστες "ADMIN"
        }
    };

    const logout = () => {
        sessionStorage.removeItem("userToken"); // Αφαίρεση του token από το sessionStorage
        setUser(null); // Ενημέρωση του χρήστη στην κατάσταση του AuthContext
        navigate("/"); // Επιστροφή στην αρχική σελίδα
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {loading ? (
                <div>Loading...</div> // Εμφανίζουμε ένα loading indicator ενώ περιμένουμε
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
