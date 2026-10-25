import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { roomsAPI } from '../services/api';
import { INITIAL_ROOMS } from '../data/rooms';

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await roomsAPI.getAll();
        if (response && response.rooms && response.rooms.length > 0) {
          setRooms(response.rooms);
        } else {
          setRooms(INITIAL_ROOMS);
        }
      } catch (err) {
        console.log('Using initial rooms data:', err.message);
        setRooms(INITIAL_ROOMS);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // Show a few featured room cards on home page (e.g. 3 rooms)
  const featuredRooms = rooms.slice(0, 3);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Welcome to Hotel Room Booking System</h1>
          <p>
            Browse our available rooms, book your stay easily, and manage your reservations in one place.
          </p>
          <Link to="/rooms" className="btn btn-primary">
            Browse All Rooms
          </Link>
        </div>
      </section>

      <section className="container">
        <div className="page-header">
          <h2>Featured Rooms</h2>
          <p>Check out our popular room options</p>
        </div>

        {loading ? (
          <p>Loading rooms...</p>
        ) : (
          <div className="room-grid">
            {featuredRooms.map((room) => (
              <RoomCard key={room.roomId || room.id || room._id} room={room} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/rooms" className="btn btn-secondary">
            View All Rooms &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
