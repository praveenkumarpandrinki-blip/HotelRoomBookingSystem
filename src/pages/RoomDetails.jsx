import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Users,
  Bed,
  Maximize2,
  CheckCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
  Loader2
} from 'lucide-react';
import { roomsAPI } from '../services/api';
import { INITIAL_ROOMS, HOTEL_INFO } from '../data/rooms';
import { formatCurrency } from '../utils/bookingHelpers';

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const data = await roomsAPI.getById(id);
        if (data && data.room) {
          setRoom(data.room);
          setSelectedImage(data.room.image || (data.room.images && data.room.images[0]));
        } else {
          // Fallback search
          const found = INITIAL_ROOMS.find((r) => r.id === id || r.roomId === id);
          if (found) {
            setRoom(found);
            setSelectedImage(found.image);
          }
        }
      } catch (err) {
        console.warn('API fetch failed, checking fallback dataset:', err.message);
        const found = INITIAL_ROOMS.find((r) => r.id === id || r.roomId === id);
        if (found) {
          setRoom(found);
          setSelectedImage(found.image);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="section section-cream" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--primary-green)' }}>
          <Loader2 className="w-10 h-10 animate-spin" style={{ margin: '0 auto 1rem auto' }} />
          <p>Loading suite details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="section section-cream" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container container-narrow">
          <div className="empty-state">
            <h2 className="empty-state-title">Room Not Found</h2>
            <p style={{ maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              The room you are looking for does not exist or may have been unlisted.
            </p>
            <Link to="/rooms" className="btn btn-primary">
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Rooms</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const galleryImages = room.images && room.images.length > 0 ? room.images : [room.image];
  const roomIdentifier = room.id || room.roomId || room._id;

  return (
    <div className="section-cream" style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/rooms"
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
            <span>Back to All Rooms</span>
          </Link>
        </div>

        {/* Room Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-green">{room.type}</span>
              <div className="room-rating-pill">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{room.rating} ({room.reviewsCount || 10} verified reviews)</span>
              </div>
            </div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-green-dark)' }}>{room.name}</h1>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nightly Rate</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: '700', color: 'var(--primary-green)' }}>
              {formatCurrency(room.price)}
              <span style={{ fontSize: '0.9rem', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', fontWeight: '400' }}> / night</span>
            </div>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="room-details-grid">
          {/* Left Column: Gallery & Description & Amenities */}
          <div>
            {/* Gallery Main */}
            <div className="room-gallery-main">
              <img
                src={selectedImage}
                alt={room.name}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>

            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="room-gallery-thumbs">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`room-gallery-thumb ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`${room.name} view ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Specifications Strip */}
            <div className="room-spec-grid">
              <div className="room-spec-item">
                <span className="room-spec-label">Capacity</span>
                <span className="room-spec-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Users className="w-4 h-4 text-emerald-700" />
                  Up to {room.capacity} Guests
                </span>
              </div>

              <div className="room-spec-item">
                <span className="room-spec-label">Bed Type</span>
                <span className="room-spec-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Bed className="w-4 h-4 text-emerald-700" />
                  {room.bedType || 'Plush King Bed'}
                </span>
              </div>

              <div className="room-spec-item">
                <span className="room-spec-label">Room Area</span>
                <span className="room-spec-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Maximize2 className="w-4 h-4 text-emerald-700" />
                  {room.size || '450 sq ft'}
                </span>
              </div>

              <div className="room-spec-item">
                <span className="room-spec-label">View</span>
                <span className="room-spec-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Scenic Resort / Ocean
                </span>
              </div>
            </div>

            {/* Overview / Story */}
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Room Overview</h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {room.description}
              </p>
              {room.shortDescription && room.shortDescription !== room.description && (
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                  {room.shortDescription}
                </p>
              )}
            </div>

            {/* Facilities & Amenities */}
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Features & Amenities</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Every reservation includes our curated selection of bespoke room appointments.
              </p>

              <div className="amenities-detailed-list">
                {room.facilities && room.facilities.map((fac, idx) => (
                  <div key={idx} className="amenity-detailed-item">
                    <CheckCircle className="w-4 h-4 text-emerald-600" style={{ flexShrink: 0 }} />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Rules & Policies */}
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Policies & Stay Rules</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', color: 'var(--primary-green-dark)', marginBottom: '0.35rem' }}>
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Check-in & Check-out</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Check-in: {HOTEL_INFO.checkInTime}<br />
                    Check-out: {HOTEL_INFO.checkOutTime}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', color: 'var(--primary-green-dark)', marginBottom: '0.35rem' }}>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Cancellation Policy</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {HOTEL_INFO.cancellationPolicy}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', color: 'var(--primary-green-dark)', marginBottom: '0.35rem' }}>
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>Identification</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Government-approved photo ID (Aadhaar, Passport, or Driving License) required at check-in.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Action Card */}
          <aside>
            <div className="booking-sidebar-card">
              <div className="price-display-header">
                <div>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>From</span>
                  <div className="price-main">{formatCurrency(room.price)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-gold">Best Rate Guaranteed</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Maximum Occupancy: <strong>{room.capacity} Guests</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Complimentary Gourmet Breakfast</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Free High-Speed Wi-Fi & Valet</span>
                </div>
              </div>

              <Link
                to={`/book/${roomIdentifier}`}
                className="btn btn-gold btn-block btn-lg"
                style={{ marginBottom: '1rem' }}
              >
                <span>Proceed to Reserve</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No advance payment required. Instant backend reservation.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
