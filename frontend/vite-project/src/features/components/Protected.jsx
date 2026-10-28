import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../auth/hooks/useAuth.jsx"

const Protected = ({ children }) => {

    const { loading, user } = useAuth();
       console.log("Protected user:", user);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <Navigate to="/register" replace />;
    }

    return children;
};

export default Protected;