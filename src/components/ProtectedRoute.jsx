import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, switchDemoRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="section section-cream" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container container-narrow">
          <div className="empty-state" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="empty-state-icon" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="empty-state-title">Admin Access Required</h2>
            <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
              The Admin Dashboard is restricted to staff & management accounts. For this college project demonstration, you can switch immediately to the demo admin profile below.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-gold"
                onClick={() => switchDemoRole('admin')}
              >
                <Sparkles className="w-4 h-4" />
                <span>Switch to Demo Admin Profile</span>
              </button>
              <Link to="/" className="btn btn-outline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
