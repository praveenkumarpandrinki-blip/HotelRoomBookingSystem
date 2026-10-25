import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyBookings() {
  const { currentUser, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingsAPI.getMyBookings();
      if (res && res.bookings) {
        setBookings(res.bookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.log('Error loading bookings:', err.message);
      setError('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCancel = async (bookingId, reference) => {
    const confirmed = window.confirm(`Are you sure you want to cancel booking ${reference}?`);
    if (!confirmed) return;

    setMessage('');
    setError('');

    try {
      const res = await bookingsAPI.cancel(bookingId || reference);
      setMessage(res.message || `Booking ${reference} has been cancelled.`);
      // Refresh list
      loadBookings();
    } catch (err) {
      setError(err.message || 'Failed to cancel the booking.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="form-box" style={{ textAlign: 'center' }}>
          <h2>Sign In Required</h2>
          <p style={{ margin: '16px 0', color: '#64748b' }}>
            Please log in with your account to view and manage your reservations.
          </p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Reservations registered under {currentUser.email}</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading your reservations...</p>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <h3>No Bookings Found</h3>
          <p style={{ color: '#64748b', margin: '10px 0 20px 0' }}>You have not reserved any rooms yet.</p>
          <Link to="/rooms" className="btn btn-primary">
            Browse & Book Rooms
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Room Name</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Nights</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id || b.bookingReference}>
                  <td><strong>{b.bookingReference}</strong></td>
                  <td>{b.roomName}</td>
                  <td>{b.checkInDate}</td>
                  <td>{b.checkOutDate}</td>
                  <td>{b.numberOfNights}</td>
                  <td>₹{b.totalAmount}</td>
                  <td>
                    <span className={`status-badge status-${(b.status || 'confirmed').toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'Confirmed' ? (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(b._id, b.bookingReference)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
