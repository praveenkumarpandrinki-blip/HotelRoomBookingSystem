import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container">
        <div className="form-box" style={{ textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p style={{ margin: '15px 0', color: '#b91c1c' }}>
            Administrator access required to view this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
