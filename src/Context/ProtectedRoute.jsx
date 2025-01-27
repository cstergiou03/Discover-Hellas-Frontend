import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowedRoles, disallowedRoles }) => {
    const { user } = useAuth();

    // console.log("User in ProtectedRoute:", user); // Για debugging
    // console.log("Allowed Roles:", allowedRoles);
    // console.log("Disallowed Roles:", disallowedRoles);

    // Αν δεν υπάρχει χρήστης, ανακατεύθυνση στην αρχική σελίδα
    if (!user) {
        console.warn("No user found, redirecting to home.");
        return <Navigate to="/" replace />;
    }

    // Αν υπάρχει disallowedRole και ο χρήστης έχει τον συγκεκριμένο ρόλο, πηγαίνουμε στην απαγορευμένη σελίδα
    if (disallowedRoles && disallowedRoles.includes(user.role)) {
        console.warn(`Access Denied: Role ${user.role} is not allowed here.`);
        return <Navigate to="/forbidden" replace />;
    }

    // Αν ο ρόλος του χρήστη δεν επιτρέπεται
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`Access Denied: Role ${user.role} not allowed.`);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
