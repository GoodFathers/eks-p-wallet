import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "super_admin" | "admin" | "visitor";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const RequireAuth = ({
  children,
  allowedRoles = ["super_admin", "admin", "visitor"],
}: RequireAuthProps) => {
  const { user, userRole, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to the login page but save the current location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has the required role
  if (!hasPermission(allowedRoles)) {
    // Redirect to unauthorized page or dashboard with limited access
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
