import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import { roomsAPI } from '../services/api';
import { INITIAL_ROOMS } from '../data/rooms';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
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

    fetchRooms();
  }, []);

  // Filter rooms based on the selected dropdown type
  const filteredRooms = selectedType === 'All'
    ? rooms
    : rooms.filter((room) => room.type === selectedType);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Available Rooms</h1>
        <p>Choose from our selection of rooms and suites</p>
      </div>

      <div className="filter-bar">
        <label htmlFor="roomTypeSelect"><strong>Filter by Type:</strong></label>
        <select
          id="roomTypeSelect"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Standard">Standard</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Family Room">Family Room</option>
        </select>
        <span>Showing {filteredRooms.length} room(s)</span>
      </div>

      {loading ? (
        <p>Loading rooms...</p>
      ) : filteredRooms.length === 0 ? (
        <p>No rooms found for the selected type.</p>
      ) : (
        <div className="room-grid">
          {filteredRooms.map((room) => (
            <RoomCard key={room.roomId || room.id || room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
