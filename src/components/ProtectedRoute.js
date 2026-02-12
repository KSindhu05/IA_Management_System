import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to legitimate dashboard if logged in but unauthorized for this page
        // Or to a 403 page.
        // For simplicity, redirect to login (or home).
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
