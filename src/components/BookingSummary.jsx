import React from 'react';
import { Calendar, Users, Moon, ShieldCheck, Clock } from 'lucide-react';
import { formatCurrency, formatDisplayDate } from '../utils/bookingHelpers';
import { HOTEL_INFO } from '../data/rooms';

export default function BookingSummary({
  room,
  checkInDate,
  checkOutDate,
  nights,
  guests,
  priceBreakdown
}) {
  if (!room) return null;

  return (
    <div className="booking-sidebar-card">
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Reservation Summary</h3>

      {/* Room Brief */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center' }}>
        <img
          src={room.image}
          alt={room.name}
          style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
        />
        <div>
          <span className="badge badge-gold" style={{ fontSize: '0.7rem', marginBottom: '0.2rem' }}>
            {room.type}
          </span>
          <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--primary-green-dark)' }}>
            {room.name}
          </h4>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {formatCurrency(room.price)} / night
          </span>
        </div>
      </div>

      {/* Dates & Guests */}
      <div style={{ backgroundColor: 'var(--bg-cream)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar className="w-4 h-4 text-emerald-700" />
            Check-In:
          </span>
          <strong>{formatDisplayDate(checkInDate)}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar className="w-4 h-4 text-emerald-700" />
            Check-Out:
          </span>
          <strong>{formatDisplayDate(checkOutDate)}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Moon className="w-4 h-4 text-emerald-700" />
            Total Duration:
          </span>
          <strong>{nights} {nights === 1 ? 'Night' : 'Nights'}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Users className="w-4 h-4 text-emerald-700" />
            Guests:
          </span>
          <strong>{guests} {guests === 1 ? 'Guest' : 'Guests'}</strong>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="booking-summary-breakdown">
        <div className="breakdown-row">
          <span>{formatCurrency(priceBreakdown.pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
          <span>{formatCurrency(priceBreakdown.subtotal)}</span>
        </div>
        <div className="breakdown-row">
          <span>Goods & Services Tax (GST {priceBreakdown.taxRatePercentage}%)</span>
          <span>{formatCurrency(priceBreakdown.taxAmount)}</span>
        </div>
        <div className="breakdown-row total">
          <span>Total Amount</span>
          <span style={{ color: 'var(--primary-green)' }}>{formatCurrency(priceBreakdown.totalAmount)}</span>
        </div>
      </div>

      {/* Policies */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{HOTEL_INFO.cancellationPolicy}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Check-in: {HOTEL_INFO.checkInTime} | Check-out: {HOTEL_INFO.checkOutTime}</span>
        </div>
      </div>
    </div>
  );
}
