import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Hotel Room Booking System
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/rooms">Rooms</NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink to="/my-bookings">My Bookings</NavLink>
              </li>
            )}
            {isAdmin && (
              <li>
                <NavLink to="/admin">Admin Bookings</NavLink>
              </li>
            )}

            {isAuthenticated ? (
              <li className="nav-user">
                <span>Welcome, {currentUser.name}</span>
                <button type="button" onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                  <NavLink to="/register">Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
