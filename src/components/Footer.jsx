import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, Send, Heart, ShieldAlert } from 'lucide-react';
import { HOTEL_INFO } from '../data/rooms';
import { useToast } from '../context/ToastContext';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { success, warning } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      warning('Please enter a valid email address.');
      return;
    }
    success('Thank you for subscribing to Aurelia Privileges club!');
    setNewsletterEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="brand-icon" style={{ width: '2.25rem', height: '2.25rem' }}>
                <Hotel className="w-5 h-5" />
              </div>
              <span className="brand-title" style={{ color: '#ffffff', fontSize: '1.4rem' }}>
                {HOTEL_INFO.name}
              </span>
            </div>
            <p style={{ color: '#c2d4ce', fontSize: '0.875rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
              {HOTEL_INFO.description}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(197, 157, 95, 0.15)',
              border: '1px solid rgba(197, 157, 95, 0.3)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: '#dfb873'
            }}>
              <ShieldAlert className="w-4 h-4" />
              <span>College Internal Examination Project Demo</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Quick Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/rooms" className="footer-link">Rooms & Suites</Link></li>
              <li><Link to="/my-bookings" className="footer-link">My Bookings</Link></li>
              <li><Link to="/contact" className="footer-link">Contact & Location</Link></li>
              <li><Link to="/admin" className="footer-link">Demo Admin Portal</Link></li>
            </ul>
          </div>

          {/* Room Categories */}
          <div>
            <h4 className="footer-col-title">Accommodations</h4>
            <ul className="footer-links">
              <li><Link to="/rooms?type=Standard" className="footer-link">Standard Rooms</Link></li>
              <li><Link to="/rooms?type=Deluxe" className="footer-link">Deluxe Rooms</Link></li>
              <li><Link to="/rooms?type=Executive Suite" className="footer-link">Executive Suites</Link></li>
              <li><Link to="/rooms?type=Family Room" className="footer-link">Family Suites</Link></li>
              <li><Link to="/rooms?type=Luxury Suite" className="footer-link">Royal Villas</Link></li>
            </ul>
          </div>

          {/* Contact Details & Newsletter */}
          <div>
            <h4 className="footer-col-title">Contact & Concierge</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#c2d4ce' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin className="w-4 h-4 text-amber-400" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <span>{HOTEL_INFO.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone className="w-4 h-4 text-amber-400" style={{ flexShrink: 0 }} />
                <span>{HOTEL_INFO.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail className="w-4 h-4 text-amber-400" style={{ flexShrink: 0 }} />
                <span>{HOTEL_INFO.email}</span>
              </div>
            </div>

            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="email"
                placeholder="Join VIP Privileges..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '0.8125rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn btn-gold btn-sm"
                style={{ padding: '0.55rem 0.85rem' }}
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} The Grand Aurelia Palace & Suites. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400" fill="currentColor" />
            <span>for Frontend College Internal Assessment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
