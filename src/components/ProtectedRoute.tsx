import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
    children: React.ReactNode;
    roles?: ("ADMIN" | "SELLER")[];
}

const ProtectedRoute: React.FC<Props> = ({
    children,
    roles
}) => {

    const {
        user,
        isAuthenticated
    } = useAuth();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        roles &&
        user &&
        !roles.includes(user.role)
    ) {
        return (
            <Navigate
                to="/profile"
                replace
            />
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;