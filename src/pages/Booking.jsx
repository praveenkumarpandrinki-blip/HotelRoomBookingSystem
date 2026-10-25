import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { roomsAPI, bookingsAPI } from '../services/api';
import { INITIAL_ROOMS } from '../data/rooms';
import { useAuth } from '../context/AuthContext';

export default function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [roomList, setRoomList] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(roomId || '');
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Today and tomorrow date strings
  const getToday = () => new Date().toISOString().split('T')[0];
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Form states
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '');
  const [checkInDate, setCheckInDate] = useState(getToday());
  const [checkOutDate, setCheckOutDate] = useState(getTomorrow());
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Load all rooms to populate dropdown and find current room
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await roomsAPI.getAll();
        const rooms = res?.rooms?.length ? res.rooms : INITIAL_ROOMS;
        setRoomList(rooms);

        // Pick room matching roomId from URL, or default to first room
        const matched = rooms.find((r) => (r.roomId || r.id || r._id) === selectedRoomId);
        if (matched) {
          setRoom(matched);
        } else if (rooms.length > 0) {
          setSelectedRoomId(rooms[0].roomId || rooms[0].id || rooms[0]._id);
          setRoom(rooms[0]);
        }
      } catch (err) {
        console.log('Error loading rooms:', err.message);
        setRoomList(INITIAL_ROOMS);
        const matched = INITIAL_ROOMS.find((r) => (r.roomId || r.id) === selectedRoomId) || INITIAL_ROOMS[0];
        setRoom(matched);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [roomId]);

  // Update room when dropdown changes
  const handleRoomSelectChange = (e) => {
    const newId = e.target.value;
    setSelectedRoomId(newId);
    const matched = roomList.find((r) => (r.roomId || r.id || r._id) === newId);
    if (matched) {
      setRoom(matched);
    }
  };

  // Calculate number of nights
  const calculateNights = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = end - start;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const nights = calculateNights();
  const pricePerNight = room?.price || 0;
  const totalPrice = nights * pricePerNight;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!room) {
      setError('Please select a room.');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        roomId: room.roomId || room.id || room._id,
        checkInDate,
        checkOutDate,
        numberOfGuests: Number(numberOfGuests),
        guestName,
        guestEmail,
        guestPhone,
        specialRequests
      };

      const result = await bookingsAPI.create(bookingData);
      if (result && result.booking) {
        setBookingSuccess(result.booking);
      } else {
        setError(result.message || 'Booking failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading booking details...</p>
      </div>
    );
  }

  // If successfully booked, show simple confirmation box
  if (bookingSuccess) {
    return (
      <div className="container">
        <div className="form-box" style={{ maxWidth: '600px' }}>
          <div className="alert alert-success">
            <h3>Booking Confirmed Successfully!</h3>
            <p>Thank you, <strong>{bookingSuccess.guestName}</strong>. Your room reservation is confirmed.</p>
          </div>

          <div style={{ marginTop: '20px', lineHeight: '1.8' }}>
            <p><strong>Booking Reference:</strong> {bookingSuccess.bookingReference}</p>
            <p><strong>Room:</strong> {bookingSuccess.roomName}</p>
            <p><strong>Check-In:</strong> {bookingSuccess.checkInDate}</p>
            <p><strong>Check-Out:</strong> {bookingSuccess.checkOutDate}</p>
            <p><strong>Nights:</strong> {bookingSuccess.numberOfNights}</p>
            <p><strong>Total Amount:</strong> ₹{bookingSuccess.totalAmount}</p>
            <p><strong>Status:</strong> <span className="status-badge status-confirmed">{bookingSuccess.status}</span></p>
          </div>

          <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
            <Link to="/my-bookings" className="btn btn-primary">
              View My Bookings
            </Link>
            <Link to="/rooms" className="btn btn-secondary">
              Book Another Room
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Book a Room</h1>
        <p>Complete the form below to reserve your room</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="booking-page-layout">
        {/* Left column: Booking Form */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="roomSelect">Select Room</label>
              <select
                id="roomSelect"
                value={selectedRoomId}
                onChange={handleRoomSelectChange}
              >
                {roomList.map((r) => {
                  const idVal = r.roomId || r.id || r._id;
                  return (
                    <option key={idVal} value={idVal}>
                      {r.name} - ₹{r.price}/night ({r.type})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="checkIn">Check-In Date</label>
                <input
                  id="checkIn"
                  type="date"
                  value={checkInDate}
                  min={getToday()}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkOut">Check-Out Date</label>
                <input
                  id="checkOut"
                  type="date"
                  value={checkOutDate}
                  min={checkInDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="guestCount">Number of Guests</label>
              <input
                id="guestCount"
                type="number"
                min="1"
                max={room?.capacity || 4}
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(e.target.value)}
                required
              />
              <small style={{ color: '#64748b' }}>Maximum capacity: {room?.capacity || 2} guests</small>
            </div>

            <div className="form-group">
              <label htmlFor="nameInput">Guest Full Name</label>
              <input
                id="nameInput"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter guest name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emailInput">Guest Email</label>
                <input
                  id="emailInput"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneInput">Phone Number</label>
                <input
                  id="phoneInput"
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="requestsInput">Special Requests (Optional)</label>
              <textarea
                id="requestsInput"
                rows="3"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Quiet room, ground floor, late check-in"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
              disabled={submitting}
            >
              {submitting ? 'Confirming Reservation...' : 'Confirm Booking'}
            </button>
          </form>
        </div>

        {/* Right column: Summary Card */}
        {room && (
          <div className="booking-summary-box">
            <h3>Booking Summary</h3>
            <img
              src={room.image}
              alt={room.name}
              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }}
            />
            <p><strong>{room.name}</strong></p>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '14px' }}>Type: {room.type}</p>

            <div className="summary-row">
              <span>Price per Night:</span>
              <span>₹{pricePerNight}</span>
            </div>
            <div className="summary-row">
              <span>Duration:</span>
              <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Estimated Total:</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
