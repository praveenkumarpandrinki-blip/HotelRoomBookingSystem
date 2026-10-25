import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, BedDouble, Search } from 'lucide-react';
import { getTodayDateString, getTomorrowDateString } from '../utils/bookingHelpers';

export default function SearchForm({
  initialType = '',
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = '2',
  onSearchSubmit,
  className = ''
}) {
  const navigate = useNavigate();
  const todayStr = getTodayDateString();

  const [roomType, setRoomType] = useState(initialType);
  const [checkIn, setCheckIn] = useState(initialCheckIn || todayStr);
  const [checkOut, setCheckOut] = useState(initialCheckOut || getTomorrowDateString(initialCheckIn || todayStr));
  const [guests, setGuests] = useState(initialGuests);

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    // If checkOut is now <= newCheckIn, adjust checkOut to day after newCheckIn
    if (checkOut <= newCheckIn) {
      setCheckOut(getTomorrowDateString(newCheckIn));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearchSubmit) {
      onSearchSubmit({ roomType, checkIn, checkOut, guests });
    } else {
      const params = new URLSearchParams();
      if (roomType) params.set('type', roomType);
      if (checkIn) params.set('checkIn', checkIn);
      if (checkOut) params.set('checkOut', checkOut);
      if (guests) params.set('guests', guests);

      navigate(`/rooms?${params.toString()}`);
    }
  };

  return (
    <form className={`search-floating-card ${className}`} onSubmit={handleSubmit}>
      <div className="search-form-grid">
        {/* Room Type / Experience */}
        <div className="search-field">
          <label htmlFor="search-room-type" className="search-field-label">
            <BedDouble className="w-3.5 h-3.5 text-amber-600" />
            <span>Room Type</span>
          </label>
          <select
            id="search-room-type"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="form-control"
          >
            <option value="">All Categories</option>
            <option value="Standard">Standard Rooms</option>
            <option value="Deluxe">Deluxe Rooms</option>
            <option value="Family Room">Family Rooms</option>
          </select>
        </div>

        {/* Check-In Date */}
        <div className="search-field">
          <label htmlFor="search-check-in" className="search-field-label">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Check-In Date</span>
          </label>
          <input
            id="search-check-in"
            type="date"
            min={todayStr}
            value={checkIn}
            onChange={handleCheckInChange}
            className="form-control"
            required
          />
        </div>

        {/* Check-Out Date */}
        <div className="search-field">
          <label htmlFor="search-check-out" className="search-field-label">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Check-Out Date</span>
          </label>
          <input
            id="search-check-out"
            type="date"
            min={getTomorrowDateString(checkIn)}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="form-control"
            required
          />
        </div>

        {/* Guests */}
        <div className="search-field">
          <label htmlFor="search-guests" className="search-field-label">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>Guests</span>
          </label>
          <select
            id="search-guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="form-control"
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="6">6+ Guests (Family)</option>
          </select>
        </div>

        {/* Search Submit Button */}
        <div>
          <button
            type="submit"
            className="btn btn-gold btn-block"
            style={{ height: '44px' }}
          >
            <Search className="w-4 h-4" />
            <span>Search Rooms</span>
          </button>
        </div>
      </div>
    </form>
  );
}
