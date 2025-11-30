import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, userProfile, loading, isAdmin } = useAuth();

  // while auth loading, don't render anything (or show a spinner)
  if (loading) return null;

  if (!isAdmin()) {
    // not admin — redirect to login (if not signed in) or home
    if (!user) return <Navigate to="/login" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
