import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { currentUser, isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingsAPI.getAll();
      if (res && res.bookings) {
        setBookings(res.bookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.log('Error fetching all bookings:', err.message);
      setError('Failed to fetch bookings from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllBookings();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  // Cancel a booking as admin
  const handleCancelBooking = async (id, refNumber) => {
    const confirmAction = window.confirm(`Admin confirmation: Are you sure you want to cancel booking ${refNumber}?`);
    if (!confirmAction) return;

    setMessage('');
    setError('');

    try {
      const res = await bookingsAPI.updateStatus(id, 'Cancelled');
      setMessage(res.message || `Booking ${refNumber} status changed to Cancelled.`);
      fetchAllBookings();
    } catch (err) {
      setError(err.message || 'Failed to cancel the booking.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <div className="form-box" style={{ textAlign: 'center' }}>
          <h2>Admin Access Required</h2>
          <p style={{ margin: '16px 0', color: '#b91c1c' }}>
            You must be logged in as an Administrator to view this page.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Demo Admin Account: <code>admin@grandaurelia.com</code> / <code>Admin@123</code>
          </p>
        </div>
      </div>
    );
  }

  // Filter bookings based on status
  const displayedBookings = filterStatus === 'All'
    ? bookings
    : bookings.filter((b) => b.status === filterStatus);

  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Admin - All Bookings</h1>
        <p>Logged in as: {currentUser.name} ({currentUser.email})</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-bar">
        <div>
          <strong>Total Bookings:</strong> {bookings.length} | <strong>Active:</strong> {confirmedCount}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchAllBookings}
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading database records...</p>
      ) : displayedBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="table-responsive">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Guest Name</th>
                <th>Contact</th>
                <th>Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedBookings.map((b) => (
                <tr key={b._id || b.bookingReference}>
                  <td><strong>{b.bookingReference}</strong></td>
                  <td>{b.guestName}</td>
                  <td>
                    <small>
                      {b.guestEmail}<br />{b.guestPhone}
                    </small>
                  </td>
                  <td>{b.roomName}</td>
                  <td>{b.checkInDate}</td>
                  <td>{b.checkOutDate}</td>
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
                        onClick={() => handleCancelBooking(b._id, b.bookingReference)}
                      >
                        Cancel Booking
                      </button>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Cancelled</span>
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
