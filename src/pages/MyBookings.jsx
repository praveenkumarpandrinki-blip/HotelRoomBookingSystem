import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar,
  Users,
  Moon,
  Ban,
  ArrowRight,
  Loader2,
  LogIn
} from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { bookingsAPI } from '../services/api';
import { formatCurrency, formatDisplayDate } from '../utils/bookingHelpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function MyBookings() {
  const { currentUser, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingBookingRef, setCancellingBookingRef] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Load bookings from backend API
  const loadBookings = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await bookingsAPI.getMyBookings();
        if (res && res.bookings) {
          setBookings(res.bookings);
        } else {
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.warn('Failed to fetch user bookings from API:', err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [isAuthenticated, currentUser]);

  const handleOpenCancelModal = (ref) => {
    setCancellingBookingRef(ref);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBookingRef) return;
    setIsCancelling(true);
    try {
      const res = await bookingsAPI.cancel(cancellingBookingRef);
      success(res.message || `Booking ${cancellingBookingRef} has been cancelled successfully.`);
      setIsCancelModalOpen(false);
      setCancellingBookingRef(null);
      await loadBookings();
    } catch (err) {
      toastError(err.message || 'Failed to cancel reservation.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="section-cream" style={{ minHeight: '80vh', padding: '4rem 0' }}>
        <div className="container container-narrow">
          <div className="empty-state">
            <div className="empty-state-icon" style={{ backgroundColor: 'var(--primary-green-tint)', color: 'var(--primary-green)' }}>
              <LogIn className="w-8 h-8" />
            </div>
            <h2 className="empty-state-title">Sign In to View Your Reservations</h2>
            <p style={{ maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              Please sign in with your guest account to inspect your booking history and reservation vouchers.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary">
                Sign In Now
              </Link>
              <Link to="/rooms" className="btn btn-outline">
                Browse Rooms
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-cream" style={{ minHeight: '80vh', padding: '3.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">Reservation History</span>
          <h1 className="section-title">My Bookings</h1>
          <p className="section-desc">
            Review your past and upcoming reservations stored securely in MongoDB.
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--primary-green)' }}>
            <Loader2 className="w-10 h-10 animate-spin" style={{ margin: '0 auto 1rem auto' }} />
            <p>Fetching your reservations from the database...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Showing <strong>{bookings.length}</strong> {bookings.length === 1 ? 'reservation' : 'reservations'} for {currentUser?.name}
              </span>
              <Link to="/rooms" className="btn btn-outline btn-sm">
                + Book Another Room
              </Link>
            </div>

            {bookings.map((b) => (
              <div key={b.bookingReference || b._id} className="booking-card-item">
                {/* Room Image */}
                <div>
                  <img
                    src={b.roomImage || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"}
                    alt={b.roomName}
                    className="booking-item-img"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                </div>

                {/* Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <span className={`badge ${
                      b.status === 'Confirmed' ? 'badge-confirmed' :
                      b.status === 'Cancelled' ? 'badge-cancelled' : 'badge-pending'
                    }`}>
                      {b.status}
                    </span>
                    <span style={{ fontSize: '0.8125rem', fontFamily: 'monospace', color: 'var(--text-muted)', fontWeight: '600' }}>
                      Ref: {b.bookingReference}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-green-dark)', marginBottom: '0.65rem' }}>
                    {b.roomName}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar className="w-4 h-4 text-emerald-700" />
                      <span>{formatDisplayDate(b.checkInDate)} &rarr; {formatDisplayDate(b.checkOutDate)}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Moon className="w-4 h-4 text-emerald-700" />
                      <span>{b.numberOfNights} {b.numberOfNights === 1 ? 'Night' : 'Nights'}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Users className="w-4 h-4 text-emerald-700" />
                      <span>{b.numberOfGuests} {b.numberOfGuests === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                  </div>

                  {b.specialRequests && (
                    <div style={{ marginTop: '0.65rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      <em>Note: "{b.specialRequests}"</em>
                    </div>
                  )}
                </div>

                {/* Pricing & Actions */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Amount</span>
                    <strong style={{ fontSize: '1.35rem', color: 'var(--primary-green)', fontFamily: 'var(--font-serif)' }}>
                      {formatCurrency(b.totalAmount)}
                    </strong>
                  </div>

                  <div>
                    {b.status === 'Confirmed' ? (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                        onClick={() => handleOpenCancelModal(b.bookingReference)}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8125rem', color: '#991b1b', fontStyle: 'italic' }}>
                        Cancelled on record
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <h3 className="empty-state-title">No Bookings Found</h3>
            <p style={{ maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              You do not have any room reservations booked yet. Explore our luxury rooms and suites to reserve your serene escape.
            </p>
            <Link to="/rooms" className="btn btn-gold">
              <span>Explore Available Rooms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Booking Cancellation */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        title="Cancel Reservation?"
        message={`Are you sure you wish to cancel booking reference "${cancellingBookingRef}"? Free cancellation is guaranteed, and the booking will be updated in the database.`}
        confirmText={isCancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
        cancelText="Keep My Booking"
        isDanger={true}
        confirmLoading={isCancelling}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setIsCancelModalOpen(false);
          setCancellingBookingRef(null);
        }}
      />
    </div>
  );
}
