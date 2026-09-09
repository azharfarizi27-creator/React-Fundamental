import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isKitchen, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="w-8 h-8 border-4 border-[#fbb710] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is Kitchen and trying to access dashboard/POS/reports/tables/menus
  if (allowedRoles && allowedRoles.length > 0) {
    const role = user?.role || 'Cashier';
    if (!allowedRoles.includes(role)) {
      // If user is Kitchen, send to their workspace /kitchen
      if (isKitchen) {
        return <Navigate to="/kitchen" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};
export default ProtectedRoute;
