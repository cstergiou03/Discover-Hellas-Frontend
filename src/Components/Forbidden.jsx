import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // Εισάγουμε το AuthContext για να πάρουμε τον ρόλο του χρήστη

function Forbidden() {
    const navigate = useNavigate();
    const { user } = useAuth(); // Λαμβάνουμε τον χρήστη από το AuthContext

    // Λογική για να αποφασίσουμε που να στείλουμε τον χρήστη
    const redirectToProperPage = () => {
        if (user) {
            if (user.role === "ADMIN") {
                navigate("/admin"); // Αν είναι admin, πηγαίνουμε στο /admin
            } else if (user.role === "PROVIDER") {
                navigate("/provider"); // Αν είναι provider, πηγαίνουμε στο /provider
            } else {
                navigate("/"); // Αν είναι απλός χρήστης, πηγαίνουμε στην αρχική σελίδα
            }
        } else {
            navigate("/"); // Αν δεν υπάρχει χρήστης (ίσως δεν έχει συνδεθεί), τον στέλνουμε στην αρχική
        }
    };

    return (
        <div>
            <h1>Access Forbidden</h1>
            <p>You do not have permission to access this page.</p>
            <button onClick={redirectToProperPage}>
                Go to My Page
            </button>
        </div>
    );
}

export default Forbidden;
