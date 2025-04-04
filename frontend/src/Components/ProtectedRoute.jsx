import React from 'react';
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, isLoggedIn, allowedRoles, userRole }) => {
  const location = useLocation();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // Check if token exists
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Role-based access control
  if (allowedRoles && userRole) {
    const hasAllowedRole = allowedRoles.includes(userRole);
    
    if (!hasAllowedRole) {
      // Specific redirect based on current role
      switch(userRole) {
        case 'user':
          return <Navigate to="/book-a-pro" replace />;
        case 'serviceProvider':
          return <Navigate to="/service-provide-dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  // If all checks pass, render children
  return children;
};

export default ProtectedRoute;