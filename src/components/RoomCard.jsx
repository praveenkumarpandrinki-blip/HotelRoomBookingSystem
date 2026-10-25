import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

export default function RoomCard({ room }) {
  const roomId = room.roomId || room.id || room._id;

  return (
    <div className="room-card">
      <img
        src={room.image || DEFAULT_IMAGE}
        alt={room.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DEFAULT_IMAGE;
        }}
      />
      <div className="room-card-content">
        <h3 className="room-card-title">{room.name}</h3>
        <span className="room-card-type">{room.type}</span>
        <p className="room-card-desc">{room.shortDescription || room.description}</p>

        <div className="room-card-info">
          <span>Capacity: {room.capacity} Guests</span>
          <span className="room-card-price">₹{room.price} / night</span>
        </div>

        <Link to={`/book/${roomId}`} className="btn btn-primary" style={{ marginTop: 'auto' }}>
          Book Now
        </Link>
      </div>
    </div>
  );
}
