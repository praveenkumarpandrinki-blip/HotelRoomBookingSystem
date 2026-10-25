import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Hotel,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  CalendarCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { currentUser, isAuthenticated, isAdmin, logout, switchDemoRole } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    info('You have been logged out.');
    navigate('/');
  };

  const handleSwitchRole = (role) => {
    switchDemoRole(role);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    info(`Switched to demo ${role === 'admin' ? 'Admin' : 'Guest'} profile.`);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon">
            <Hotel className="w-5 h-5" />
          </div>
          <div className="brand-text">
            <span className="brand-title">The Grand Aurelia</span>
            <span className="brand-subtitle">Palace & Suites</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/rooms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Rooms & Suites
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                My Bookings
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Contact
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#c59d5f' }}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="user-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: isAdmin ? 'var(--accent-gold)' : 'var(--primary-green)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  {currentUser?.name?.charAt(0) || 'G'}
                </div>
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser?.name?.split(' ')[0]}
                </span>
                {isAdmin && <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>Admin</span>}
                <ChevronDown className="w-4 h-4" />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '250px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: '0.5rem',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--primary-green-dark)' }}>
                      {currentUser?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {currentUser?.email}
                    </div>
                  </div>

                  <div style={{ padding: '0.4rem 0' }}>
                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      className="btn-ghost"
                    >
                      <CalendarCheck className="w-4 h-4 text-emerald-600" />
                      My Bookings
                    </Link>

                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.5rem 0.85rem',
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                        className="btn-ghost"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSwitchRole('admin')}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.5rem 0.85rem',
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        className="btn-ghost"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Switch to Demo Admin
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleSwitchRole('user')}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.5rem 0.85rem',
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        className="btn-ghost"
                      >
                        <User className="w-4 h-4 text-blue-500" />
                        Switch to Demo Guest
                      </button>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.875rem',
                        color: '#dc2626',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      className="btn-ghost"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline btn-sm">
                Register
              </Link>
            </div>
          )}

          <Link to="/rooms" className="btn btn-gold btn-sm btn-book-now">
            Book Now
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/rooms" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              Rooms & Suites
            </Link>
          </li>
          <li>
            <Link to="/my-bookings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              My Bookings
            </Link>
          </li>
          <li>
            <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              Contact & Location
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className="mobile-nav-link"
                style={{ color: '#c59d5f' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            </li>
          )}
        </ul>

        {isAuthenticated ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Logged in as <strong>{currentUser?.name}</strong> ({currentUser?.role})
            </div>
            <button
              type="button"
              className="btn btn-outline btn-block"
              onClick={() => handleSwitchRole(isAdmin ? 'user' : 'admin')}
            >
              Switch to {isAdmin ? 'Demo Guest' : 'Demo Admin'}
            </button>
            <button
              type="button"
              className="btn btn-danger btn-block"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/login"
              className="btn btn-primary btn-block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-outline btn-block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
