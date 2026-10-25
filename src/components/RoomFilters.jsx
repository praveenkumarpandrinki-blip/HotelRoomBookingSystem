import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '../utils/bookingHelpers';

export default function RoomFilters({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  maxPrice,
  setMaxPrice,
  highestPossiblePrice = 30000,
  lowestPossiblePrice = 2000,
  sortBy,
  setSortBy,
  onReset,
  totalResults
}) {
  return (
    <div className="filter-bar">
      <div className="filter-grid">
        {/* Search by Name */}
        <div>
          <label htmlFor="filter-search-input" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Search className="w-3.5 h-3.5 text-amber-600" />
            <span>Search by Room Name</span>
          </label>
          <input
            id="filter-search-input"
            type="text"
            placeholder="e.g. Ocean View, Presidential, Balcony..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>

        {/* Room Type */}
        <div>
          <label htmlFor="filter-room-type-select" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span>Room Type</span>
          </label>
          <select
            id="filter-room-type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-control"
          >
            <option value="">All Categories</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Executive Suite">Executive Suite</option>
            <option value="Family Room">Family Room</option>
            <option value="Luxury Suite">Luxury Suite</option>
          </select>
        </div>

        {/* Max Price Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label htmlFor="filter-price-range" className="form-label" style={{ margin: 0 }}>
              Max Price / Night
            </label>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-green)' }}>
              {formatCurrency(maxPrice)}
            </span>
          </div>
          <input
            id="filter-price-range"
            type="range"
            min={lowestPossiblePrice}
            max={highestPossiblePrice}
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
          />
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="filter-sort-select" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
            <span>Sort By</span>
          </label>
          <select
            id="filter-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-control"
          >
            <option value="recommended">Featured / Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Guest Rating: Highest</option>
          </select>
        </div>

        {/* Reset Button */}
        <div>
          <button
            type="button"
            onClick={onReset}
            className="btn btn-outline btn-block"
            title="Reset all filters"
            style={{ height: '44px' }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8125rem',
        color: 'var(--text-muted)'
      }}>
        <span>Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'room' : 'rooms'} matching your criteria</span>
        {(searchTerm || selectedType || maxPrice < highestPossiblePrice) && (
          <span style={{ color: 'var(--accent-gold-dark)', fontWeight: '600' }}>
            Filters applied
          </span>
        )}
      </div>
    </div>
  );
}
