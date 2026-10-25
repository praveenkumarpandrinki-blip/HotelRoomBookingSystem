import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  User,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import FormInput from '../components/FormInput';
import BookingSummary from '../components/BookingSummary';
import { roomsAPI, bookingsAPI } from '../services/api';
import { INITIAL_ROOMS } from '../data/rooms';
import {
  calculateNights,
  calculateBookingTotal,
  getTodayDateString,
  getTomorrowDateString,
  isValidEmail,
  isValidPhone,
  formatCurrency,
  formatDisplayDate
} from '../utils/bookingHelpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { success, warning, error: toastError } = useToast();

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const todayStr = getTodayDateString();

  // Booking Form State
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '');
  const [checkInDate, setCheckInDate] = useState(todayStr);
  const [checkOutDate, setCheckOutDate] = useState(getTomorrowDateString(todayStr));
  const [guestsCount, setGuestsCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Sync current user fields if logged in
  useEffect(() => {
    if (currentUser) {
      if (!guestName) setGuestName(currentUser.name || '');
      if (!guestEmail) setGuestEmail(currentUser.email || '');
      if (!guestPhone) setGuestPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Load room details from backend
  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) {
        setLoadingRoom(false);
        return;
      }
      setLoadingRoom(true);
      try {
        const data = await roomsAPI.getById(roomId);
        if (data && data.room) {
          setRoom(data.room);
          if (data.room.capacity && guestsCount > data.room.capacity) {
            setGuestsCount(data.room.capacity);
          }
        } else {
          const fallback = INITIAL_ROOMS.find((r) => r.id === roomId || r.roomId === roomId);
          if (fallback) setRoom(fallback);
        }
      } catch (err) {
        console.warn('Room fetch from API failed, using fallback:', err.message);
        const fallback = INITIAL_ROOMS.find((r) => r.id === roomId || r.roomId === roomId);
        if (fallback) setRoom(fallback);
      } finally {
        setLoadingRoom(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  // Handle check-in change
  const handleCheckInChange = (e) => {
    const val = e.target.value;
    setCheckInDate(val);
    if (errors.dates) setErrors((prev) => ({ ...prev, dates: '' }));
    if (errors.overlap) setErrors((prev) => ({ ...prev, overlap: '' }));
    if (checkOutDate <= val) {
      setCheckOutDate(getTomorrowDateString(val));
    }
  };

  const handleCheckOutChange = (e) => {
    const val = e.target.value;
    setCheckOutDate(val);
    if (errors.dates) setErrors((prev) => ({ ...prev, dates: '' }));
    if (errors.overlap) setErrors((prev) => ({ ...prev, overlap: '' }));
  };

  // Calculations
  const nights = useMemo(() => {
    return calculateNights(checkInDate, checkOutDate);
  }, [checkInDate, checkOutDate]);

  const priceBreakdown = useMemo(() => {
    return calculateBookingTotal(room?.price || 0, nights);
  }, [room, nights]);

  // Client-side Validation
  const validate = () => {
    const errs = {};

    if (!guestName.trim()) {
      errs.name = 'Primary guest name is required.';
    }

    if (!guestEmail.trim()) {
      errs.email = 'Email address is required.';
    } else if (!isValidEmail(guestEmail)) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!guestPhone.trim()) {
      errs.phone = 'Contact phone number is required.';
    } else if (!isValidPhone(guestPhone)) {
      errs.phone = 'Please provide a valid 10-digit phone number.';
    }

    if (!checkInDate || !checkOutDate) {
      errs.dates = 'Please select both check-in and check-out dates.';
    } else if (checkOutDate <= checkInDate) {
      errs.dates = 'Check-out date must be strictly after check-in date.';
    } else if (nights < 1) {
      errs.dates = 'Minimum duration of stay is 1 night.';
    }

    if (room && Number(guestsCount) > room.capacity) {
      errs.guests = `This room accommodates a maximum of ${room.capacity} guests.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      warning('Please correct the validation errors in the booking form.');
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, overlap: '' }));

    const bookingPayload = {
      roomId: room.id || room.roomId || room._id,
      roomName: room.name,
      roomImage: room.image,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      checkInDate,
      checkOutDate,
      numberOfNights: nights,
      numberOfGuests: Number(guestsCount),
      specialRequests: specialRequests.trim()
    };

    try {
      // Call backend API (handles overlapping booking prevention in MongoDB)
      const res = await bookingsAPI.create(bookingPayload);
      if (res && res.booking) {
        setConfirmedBooking(res.booking);
        success(`Booking confirmed! Reference: ${res.booking.bookingReference}`);
      } else {
        toastError(res.message || 'Booking confirmation failed.');
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to complete reservation. Please try again.';
      toastError(errorMsg);
      // If error is due to overlapping dates, highlight it right on the date fields
      if (errorMsg.toLowerCase().includes('already reserved')) {
        setErrors((prev) => ({ ...prev, overlap: errorMsg }));
      } else {
        setErrors((prev) => ({ ...prev, general: errorMsg }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingRoom) {
    return (
      <div className="section section-cream" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--primary-green)' }}>
          <Loader2 className="w-10 h-10 animate-spin" style={{ margin: '0 auto 1rem auto' }} />
          <p>Preparing reservation details...</p>
        </div>
      </div>
    );
  }

  // If room not found
  if (!room) {
    return (
      <div className="section section-cream" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container container-narrow">
          <div className="empty-state">
            <h2 className="empty-state-title">Select a Room to Reserve</h2>
            <p style={{ maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              Please pick an accommodation from our catalog first to begin the booking process.
            </p>
            <Link to="/rooms" className="btn btn-primary">
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Available Rooms</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Confirmation Screen View ---
  if (confirmedBooking) {
    return (
      <div className="section section-cream" style={{ minHeight: '80vh', padding: '4rem 0' }}>
        <div className="container container-narrow" style={{ maxWidth: '640px' }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '4.5rem',
              height: '4.5rem',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="badge badge-confirmed" style={{ fontSize: '0.85rem', marginBottom: '0.75rem', padding: '0.35rem 0.85rem' }}>
              Booking Confirmed
            </span>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary-green-dark)', marginBottom: '0.5rem' }}>
              We Look Forward to Welcoming You
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
              Your reservation has been registered in the database. A confirmation has been logged.
            </p>

            {/* Reference Card */}
            <div style={{
              backgroundColor: 'var(--bg-cream)',
              border: '1px dashed var(--accent-gold-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Booking Reference
                </span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--primary-green-dark)', fontFamily: 'monospace' }}>
                  {confirmedBooking.bookingReference}
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Room</span>
                  <strong>{confirmedBooking.roomName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Guest</span>
                  <strong>{confirmedBooking.guestName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Stay Period</span>
                  <strong>{formatDisplayDate(confirmedBooking.checkInDate)} &rarr; {formatDisplayDate(confirmedBooking.checkOutDate)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Total Amount</span>
                  <strong style={{ color: 'var(--primary-green)', fontSize: '1.05rem' }}>{formatCurrency(confirmedBooking.totalAmount)}</strong>
                </div>
              </div>
            </div>

            {/* Next Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/my-bookings" className="btn btn-primary">
                <span>View in My Bookings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/" className="btn btn-outline">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Booking Form Screen ---
  return (
    <div className="section-cream" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to={`/rooms/${room.id || room.roomId || room._id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--primary-green)',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Room Details</span>
          </Link>
        </div>

        <div className="section-header" style={{ textAlign: 'left', margin: '0 0 2rem 0', maxWidth: 'none' }}>
          <span className="section-subtitle" style={{ justifyContent: 'flex-start' }}>
            Instant Reservation
          </span>
          <h1 className="section-title">Complete Your Booking</h1>
          <p className="section-desc">
            Provide your stay dates and guest details. Your reservation will be securely created in MongoDB.
          </p>
        </div>

        {/* Overlapping Booking Alert Message */}
        {errors.overlap && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #f87171',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            color: '#991b1b'
          }}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ marginTop: '0.15rem' }} />
            <div>
              <strong>Dates Unavailable (Overlapping Booking Detected):</strong>
              <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{errors.overlap}</div>
            </div>
          </div>
        )}

        <div className="booking-process-grid">
          {/* Left: Guest Details and Date Pickers */}
          <form onSubmit={handleSubmit}>
            {/* 1. Dates Selection Box */}
            <div className="booking-box">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar className="w-5 h-5 text-emerald-700" />
                <span>1. Choose Dates & Guests</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="booking-checkin" className="form-label">
                    Check-In Date <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="booking-checkin"
                    type="date"
                    min={todayStr}
                    value={checkInDate}
                    onChange={handleCheckInChange}
                    className="form-control"
                    required
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Check-in after 2:00 PM
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="booking-checkout" className="form-label">
                    Check-Out Date <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="booking-checkout"
                    type="date"
                    min={getTomorrowDateString(checkInDate)}
                    value={checkOutDate}
                    onChange={handleCheckOutChange}
                    className="form-control"
                    required
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Check-out before 11:00 AM
                  </small>
                </div>
              </div>

              {errors.dates && (
                <div className="form-error" style={{ marginBottom: '1rem' }}>
                  {errors.dates}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="booking-guests-count" className="form-label">
                  Number of Guests (Max {room.capacity} for this room) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  id="booking-guests-count"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="form-control"
                >
                  {[...Array(room.capacity || 2)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
                {errors.guests && <div className="form-error">{errors.guests}</div>}
              </div>
            </div>

            {/* 2. Guest Information Box */}
            <div className="booking-box">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User className="w-5 h-5 text-emerald-700" />
                <span>2. Primary Guest Information</span>
              </h2>

              {!isAuthenticated && (
                <div style={{
                  backgroundColor: 'var(--bg-cream)',
                  border: '1px solid var(--accent-gold-border)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.25rem',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Have an account? Sign in for instant autofill.</span>
                  <Link to="/login" className="btn btn-outline btn-sm">
                    Sign In
                  </Link>
                </div>
              )}

              <FormInput
                label="Full Name"
                id="booking-guest-name"
                name="name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Ananya Deshmukh"
                icon={User}
                required
                error={errors.name}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <FormInput
                  label="Email Address"
                  id="booking-guest-email"
                  name="email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="e.g. ananya@example.com"
                  icon={Mail}
                  required
                  error={errors.email}
                  helperText="Booking confirmation will be recorded here."
                />

                <FormInput
                  label="Phone Number"
                  id="booking-guest-phone"
                  name="phone"
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  icon={Phone}
                  required
                  error={errors.phone}
                  helperText="For arrival & concierge coordination."
                />
              </div>

              <FormInput
                label="Special Requests & Preferences"
                id="booking-special-requests"
                name="specialRequests"
                as="textarea"
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Quiet high-floor room, late check-in around 7 PM, extra feather pillows..."
                helperText="Special requests are subject to availability upon check-in."
              />
            </div>

            {/* 3. Payment Method: Pay at Property */}
            <div className="booking-box" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CreditCard className="w-5 h-5 text-amber-600" />
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Payment Method: Pay at Property</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                Simple confirmation flow for college project evaluation. No real payments are collected.
                You can settle during check-in via cash, card, or UPI.
              </p>

              <button
                type="submit"
                className="btn btn-gold btn-block btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying & Confirming Reservation...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Reservation • {formatCurrency(priceBreakdown.totalAmount)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right: Booking Summary Sidebar */}
          <aside>
            <BookingSummary
              room={room}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              nights={nights}
              guests={guestsCount}
              priceBreakdown={priceBreakdown}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
