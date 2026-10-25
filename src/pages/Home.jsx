import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Clock,
  ShieldCheck,
  ArrowRight,
  Wifi,
  Waves,
  UtensilsCrossed,
  Wind,
  Car,
  Dumbbell,
  Star
} from 'lucide-react';
import SearchForm from '../components/SearchForm';
import RoomCard from '../components/RoomCard';
import { roomsAPI } from '../services/api';
import { INITIAL_ROOMS, HOTEL_FACILITIES, TESTIMONIALS, HOTEL_INFO } from '../data/rooms';

// Map facility icon string to Lucide component
const FACILITY_ICONS = {
  Wifi: Wifi,
  Waves: Waves,
  UtensilsCrossed: UtensilsCrossed,
  Sparkles: Sparkles,
  Wind: Wind,
  Car: Car,
  Dumbbell: Dumbbell,
  Clock: Clock
};

export default function Home() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await roomsAPI.getAll();
        if (data && data.rooms && data.rooms.length > 0) {
          setRooms(data.rooms);
        }
      } catch (err) {
        console.warn('API fetch on home failed, using default showcase:', err.message);
      }
    };
    loadFeatured();
  }, []);

  // Select top 3 featured rooms
  const featuredRooms = useMemo(() => {
    const featured = rooms.filter((r) => r.featured);
    return featured.length >= 3 ? featured.slice(0, 3) : rooms.slice(0, 3);
  }, [rooms]);

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        <div className="hero-overlay" />
        <div className="container hero-content">
          <span className="hero-subtitle">
            Welcome to An Oasis of Serenity
          </span>
          <h1 className="hero-title">
            Experience Luxury Beyond <span>Imagination</span>
          </h1>
          <p className="hero-description">
            Immerse yourself in world-class coastal grandeur at {HOTEL_INFO.name}. 
            Handcrafted suites, Michelin-inspired dining, and holistic Ayurvedic sanctuaries.
          </p>
          <div className="hero-cta-group">
            <Link to="/rooms" className="btn btn-gold btn-lg">
              Explore Our Suites
            </Link>
            <Link to="/contact" className="btn btn-outline-gold btn-lg">
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Floating Search Form */}
      <div className="container">
        <SearchForm />
      </div>

      {/* 3. Featured Rooms Section */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Exquisite Accommodations</span>
            <h2 className="section-title">Featured Rooms & Suites</h2>
            <p className="section-desc">
              Each space is thoughtfully composed with artisanal materials, panoramic vistas, and plush amenities for seamless relaxation.
            </p>
          </div>

          <div className="rooms-grid">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id || room.roomId || room._id} room={room} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/rooms" className="btn btn-primary btn-lg">
              <span>View All Available Rooms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Hotel Facilities Section */}
      <section className="section section-surface">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Curated Experiences</span>
            <h2 className="section-title">World-Class Facilities</h2>
            <p className="section-desc">
              From heated infinity pools to bespoke spa treatments, our amenities ensure every moment of your stay is effortless.
            </p>
          </div>

          <div className="facilities-grid">
            {HOTEL_FACILITIES.map((facility) => {
              const IconComp = FACILITY_ICONS[facility.icon] || Sparkles;
              return (
                <div key={facility.id} className="facility-card">
                  <div className="facility-icon-wrap">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="facility-title">{facility.title}</h3>
                  <p className="facility-desc">{facility.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="section section-cream">
        <div className="container">
          <div className="why-us-grid">
            <div className="why-us-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80"
                alt="Hotel Architecture"
                className="why-us-img-main"
              />
              <div className="why-us-floating-card">
                <div className="why-us-floating-number">4.9/5</div>
                <div className="why-us-floating-label">Guest Satisfaction</div>
              </div>
            </div>

            <div>
              <span className="section-subtitle" style={{ justifyContent: 'flex-start' }}>
                Why Guests Choose Us
              </span>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                Unmatched Hospitality Rooted in Heritage
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                At {HOTEL_INFO.name}, we believe true luxury lies in thoughtful attention to detail. 
                Whether arranging sunset yacht excursions or tailoring dietary preferences, our staff 
                is dedicated to perfecting your stay.
              </p>

              <ul className="why-us-list">
                <li className="why-us-item">
                  <div className="why-us-item-icon">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Best Coastal Luxury Resort 2025</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Recognized for exceptional guest services and sustainable heritage hospitality.
                    </p>
                  </div>
                </li>

                <li className="why-us-item">
                  <div className="why-us-item-icon">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>24/7 Dedicated Butler & Concierge</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Immediate assistance for airport transfers, reservations, and private in-room dining.
                    </p>
                  </div>
                </li>

                <li className="why-us-item">
                  <div className="why-us-item-icon">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Flexible Free Cancellation</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Enjoy complete peace of mind with 24-hour complimentary booking cancellation.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="section section-surface">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Guest Reflections</span>
            <h2 className="section-title">What Our Guests Say</h2>
            <p className="section-desc">
              Discover real experiences from travelers who have made The Grand Aurelia their haven.
            </p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div>
                  <div className="testimonial-stars">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="testimonial-quote">"{t.comment}"</p>
                </div>

                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-loc">{t.location} &bull; Stayed in {t.stayedRoom}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className="section section-dark" style={{ textAlign: 'center' }}>
        <div className="container container-narrow">
          <span className="section-subtitle" style={{ color: 'var(--accent-gold)' }}>
            Plan Your Getaway
          </span>
          <h2 className="section-title" style={{ color: '#ffffff', marginBottom: '1.25rem' }}>
            Ready for an Unforgettable Escape?
          </h2>
          <p className="section-desc" style={{ color: '#c9d8d3', marginBottom: '2.5rem' }}>
            Book direct today to receive complimentary breakfast, high-speed Wi-Fi, and priority suite upgrade vouchers.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/rooms" className="btn btn-gold btn-lg">
              Reserve Your Stay
            </Link>
            <Link to="/contact" className="btn btn-outline-gold btn-lg">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
