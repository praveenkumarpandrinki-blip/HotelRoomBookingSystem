import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX, Loader2 } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import RoomFilters from '../components/RoomFilters';
import { roomsAPI } from '../services/api';
import { INITIAL_ROOMS } from '../data/rooms';

export default function Rooms() {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read URL query params if user came from home search bar
  const initialTypeFromUrl = searchParams.get('type') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(initialTypeFromUrl);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [sortBy, setSortBy] = useState('recommended');

  // Fetch rooms from backend API
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await roomsAPI.getAll();
      if (data && data.rooms && data.rooms.length > 0) {
        setRooms(data.rooms);
      } else {
        setRooms(INITIAL_ROOMS);
      }
    } catch (err) {
      console.warn('Backend fetch failed, falling back to local dataset:', err.message);
      setRooms(INITIAL_ROOMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Update selectedType if URL param changes
  useEffect(() => {
    if (initialTypeFromUrl) {
      setSelectedType(initialTypeFromUrl);
    }
  }, [initialTypeFromUrl]);

  // Determine highest room price dynamically for slider ceiling
  const highestPriceInCatalog = useMemo(() => {
    if (!rooms.length) return 30000;
    const max = Math.max(...rooms.map((r) => r.price || 0));
    return Math.ceil(max / 1000) * 1000 + 2000;
  }, [rooms]);

  // Filter & sort logic
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        // Search term check
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = (room.name || '').toLowerCase().includes(term);
          const matchDesc = (room.description || '').toLowerCase().includes(term);
          const matchType = (room.type || '').toLowerCase().includes(term);
          if (!matchName && !matchDesc && !matchType) return false;
        }

        // Room Type check
        if (selectedType && room.type !== selectedType) {
          return false;
        }

        // Max price check
        if (room.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'rating-desc') {
          return b.rating - a.rating;
        }
        // Default: featured first, then rating
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [rooms, searchTerm, selectedType, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setMaxPrice(highestPriceInCatalog);
    setSortBy('recommended');
  };

  return (
    <div className="section-cream" style={{ minHeight: '80vh', padding: '3.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">Luxurious Stays</span>
          <h1 className="section-title">Rooms & Palatial Suites</h1>
          <p className="section-desc">
            Discover our collection of curated accommodations tailored for discerning leisure and corporate travelers.
          </p>
        </div>

        {/* Filter Bar */}
        <RoomFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          highestPossiblePrice={highestPriceInCatalog}
          lowestPossiblePrice={2000}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReset={handleResetFilters}
          totalResults={filteredRooms.length}
        />

        {/* Loading Indicator */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--primary-green)' }}>
            <Loader2 className="w-10 h-10 animate-spin" style={{ margin: '0 auto 1rem auto' }} />
            <p>Loading luxury rooms catalog...</p>
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="rooms-grid">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id || room.roomId || room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="empty-state-title">No Rooms Found</h3>
            <p style={{ maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              We could not find any rooms matching your current search or filter combination.
              Try adjusting your price range or clearing selected category filters.
            </p>
            <button
              type="button"
              className="btn btn-gold"
              onClick={handleResetFilters}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
