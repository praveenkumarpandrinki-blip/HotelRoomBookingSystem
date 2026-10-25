import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Bed, Maximize2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/bookingHelpers';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";

export default function RoomCard({ room }) {
  const [imgSrc, setImgSrc] = useState(room.image || FALLBACK_IMAGE);

  const handleImageError = () => {
    setImgSrc(FALLBACK_IMAGE);
  };

  return (
    <article className="room-card">
      <div className="room-card-img-wrap">
        <img
          src={imgSrc}
          alt={room.name}
          className="room-card-img"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="room-card-badge">
          <span className="badge badge-green">{room.type}</span>
        </div>
        <div className="room-card-price-pill">
          <span>{formatCurrency(room.price)}</span>
          <small>/ night</small>
        </div>
      </div>

      <div className="room-card-body">
        <div className="room-card-header">
          <h3 className="room-card-title">{room.name}</h3>
          <div className="room-rating-pill" title={`${room.rating} out of 5 stars (${room.reviewsCount} reviews)`}>
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{room.rating}</span>
          </div>
        </div>

        <p className="room-card-desc">{room.shortDescription || room.description}</p>

        <div className="room-card-meta">
          <div className="room-card-meta-item" title="Max Guests">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Up to {room.capacity} Guests</span>
          </div>
          {room.bedType && (
            <div className="room-card-meta-item" title="Bedding">
              <Bed className="w-4 h-4 text-emerald-700" />
              <span>{room.bedType}</span>
            </div>
          )}
          {room.size && (
            <div className="room-card-meta-item" title="Room Size">
              <Maximize2 className="w-4 h-4 text-emerald-700" />
              <span>{room.size}</span>
            </div>
          )}
        </div>

        {room.facilities && room.facilities.length > 0 && (
          <div className="room-card-amenities">
            {room.facilities.slice(0, 3).map((facility, idx) => (
              <span key={idx} className="room-amenity-chip">
                {facility}
              </span>
            ))}
            {room.facilities.length > 3 && (
              <span className="room-amenity-chip" style={{ color: 'var(--accent-gold-dark)' }}>
                +{room.facilities.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="room-card-footer">
          <Link
            to={`/rooms/${room.id}`}
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
          >
            View Details
          </Link>
          <Link
            to={`/book/${room.id}`}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
