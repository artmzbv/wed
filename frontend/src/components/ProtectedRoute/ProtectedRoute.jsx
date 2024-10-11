import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken'); // Check for the token

  // If token is not found, redirect to login page
  if (!token) {
    return <Navigate to="/admin" />;
  }

  return children; // Render the protected component if authenticated
};

export default ProtectedRoute;
