import React, { useState, useEffect, useMemo } from 'react';
import {
  BedDouble,
  CalendarCheck,
  CheckCircle,
  IndianRupee,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  RotateCcw,
  Shield,
  Loader2
} from 'lucide-react';
import FormInput from '../components/FormInput';
import ConfirmationModal from '../components/ConfirmationModal';
import { roomsAPI, bookingsAPI } from '../services/api';
import { formatCurrency, formatDisplayDate } from '../utils/bookingHelpers';
import { useToast } from '../context/ToastContext';

export default function AdminDashboard() {
  const { success, error: toastError, info } = useToast();

  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'bookings'
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [roomSearch, setRoomSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');

  // Add / Edit Room Modal
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    name: '',
    type: 'Deluxe',
    price: '',
    capacity: '2',
    bedType: '1 Plush King Bed',
    size: '450 sq ft',
    image: '',
    shortDescription: '',
    description: '',
    facilities: '',
    featured: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSavingRoom, setIsSavingRoom] = useState(false);

  // Delete Room Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data from Backend MongoDB APIs
  const refreshData = async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        roomsAPI.getAll(),
        bookingsAPI.getAll()
      ]);

      if (roomsRes && roomsRes.rooms) {
        setRooms(roomsRes.rooms);
      }
      if (bookingsRes && bookingsRes.bookings) {
        setBookings(bookingsRes.bookings);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err.message);
      toastError(err.message || 'Error fetching data from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Summary Metrics calculated from database records
  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed').length;
    const totalRevenue = bookings
      .filter((b) => b.status === 'Confirmed')
      .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

    return { totalRooms, totalBookings, confirmedBookings, totalRevenue };
  }, [rooms, bookings]);

  // Filtered lists
  const filteredRooms = useMemo(() => {
    if (!roomSearch.trim()) return rooms;
    const q = roomSearch.toLowerCase();
    return rooms.filter(
      (r) =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.type || '').toLowerCase().includes(q)
    );
  }, [rooms, roomSearch]);

  const filteredBookings = useMemo(() => {
    if (!bookingSearch.trim()) return bookings;
    const q = bookingSearch.toLowerCase();
    return bookings.filter(
      (b) =>
        (b.bookingReference || '').toLowerCase().includes(q) ||
        (b.guestName || '').toLowerCase().includes(q) ||
        (b.roomName || '').toLowerCase().includes(q)
    );
  }, [bookings, bookingSearch]);

  // Open Room Modal for Creating
  const handleOpenAddRoom = () => {
    setEditingRoomId(null);
    setRoomFormData({
      name: '',
      type: 'Deluxe',
      price: '',
      capacity: '2',
      bedType: '1 Plush King Bed',
      size: '450 sq ft',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      shortDescription: '',
      description: '',
      facilities: 'High-Speed Wi-Fi, Air Conditioning, 50-inch Smart TV, Rain Shower, Mini Bar, Complimentary Breakfast',
      featured: false
    });
    setFormErrors({});
    setIsRoomModalOpen(true);
  };

  // Open Room Modal for Editing
  const handleOpenEditRoom = (room) => {
    const identifier = room.id || room.roomId || room._id;
    setEditingRoomId(identifier);
    setRoomFormData({
      name: room.name,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      bedType: room.bedType || '',
      size: room.size || '',
      image: room.image || '',
      shortDescription: room.shortDescription || '',
      description: room.description || '',
      facilities: Array.isArray(room.facilities) ? room.facilities.join(', ') : (room.facilities || ''),
      featured: !!room.featured
    });
    setFormErrors({});
    setIsRoomModalOpen(true);
  };

  // Validate & Save Room Form
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!roomFormData.name.trim()) errs.name = 'Room name is required.';
    if (!roomFormData.price || Number(roomFormData.price) <= 0) errs.price = 'Valid price per night is required.';
    if (!roomFormData.capacity || Number(roomFormData.capacity) < 1) errs.capacity = 'Capacity must be at least 1 guest.';
    if (!roomFormData.description.trim()) errs.description = 'Room description is required.';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const payload = {
      ...roomFormData,
      price: Number(roomFormData.price),
      capacity: Number(roomFormData.capacity),
      facilities: roomFormData.facilities.split(',').map((f) => f.trim()).filter(Boolean)
    };

    setIsSavingRoom(true);
    try {
      if (editingRoomId) {
        const res = await roomsAPI.update(editingRoomId, payload);
        success(res.message || 'Room updated successfully in MongoDB!');
      } else {
        const res = await roomsAPI.create(payload);
        success(res.message || 'New room added successfully to MongoDB!');
      }
      setIsRoomModalOpen(false);
      await refreshData();
    } catch (err) {
      toastError(err.message || 'Failed to save room.');
    } finally {
      setIsSavingRoom(false);
    }
  };

  // Delete Room Trigger
  const handleOpenDelete = (room) => {
    setRoomToDelete(room);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;
    setIsDeleting(true);
    const identifier = roomToDelete.id || roomToDelete.roomId || roomToDelete._id;
    try {
      const res = await roomsAPI.delete(identifier);
      success(res.message || 'Room deleted from MongoDB database.');
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
      await refreshData();
    } catch (err) {
      toastError(err.message || 'Failed to delete room.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset to default sample catalog
  const handleResetCatalog = async () => {
    try {
      const res = await roomsAPI.resetCatalog();
      await refreshData();
      info(res.message || 'Rooms catalog restored to initial defaults in database.');
    } catch (err) {
      toastError(err.message || 'Failed to reset catalog.');
    }
  };

  // Update Booking Status
  const handleStatusChange = async (bookingRef, newStatus) => {
    try {
      const res = await bookingsAPI.updateStatus(bookingRef, newStatus);
      success(res.message || `Booking status updated to ${newStatus}.`);
      await refreshData();
    } catch (err) {
      toastError(err.message || 'Failed to update booking status.');
    }
  };

  return (
    <div className="section-cream" style={{ padding: '3rem 0 5rem 0', minHeight: '85vh' }}>
      <div className="container">
        {/* Top Disclaimer / Header */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <Shield className="w-5 h-5 text-amber-600" />
              <h1 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--primary-green-dark)' }}>
                Administrator Management Portal
              </h1>
              <span className="badge badge-gold">Express & MongoDB Connected</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Connected to local MongoDB database `hotel_booking`. Real-time room CRUD and booking status control.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleResetCatalog}
              title="Reset rooms back to sample catalog"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Catalog Defaults</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleOpenAddRoom}
            >
              <Plus className="w-4 h-4" />
              <span>Add New Room</span>
            </button>
          </div>
        </div>

        {/* 1. Statistics Cards */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-green-tint)', color: 'var(--primary-green)' }}>
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-title">Total Rooms</div>
              <div className="stat-value">{stats.totalRooms}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-title">Total Bookings</div>
              <div className="stat-value">{stats.totalBookings}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-title">Confirmed Stays</div>
              <div className="stat-value">{stats.confirmedBookings}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}>
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <div className="stat-title">Confirmed Revenue</div>
              <div className="stat-value" style={{ fontSize: '1.45rem' }}>
                {formatCurrency(stats.totalRevenue)}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Admin Tabs */}
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            Manage Rooms ({rooms.length})
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Manage Bookings ({bookings.length})
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--primary-green)' }}>
            <Loader2 className="w-8 h-8 animate-spin" style={{ margin: '0 auto 1rem auto' }} />
            <p>Syncing dashboard with MongoDB...</p>
          </div>
        ) : (
          <>
            {/* --- TAB 1: ROOMS MANAGEMENT --- */}
            {activeTab === 'rooms' && (
              <div>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ position: 'relative', width: '320px' }}>
                    <Search className="w-4 h-4" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Filter rooms by title or type..."
                      value={roomSearch}
                      onChange={(e) => setRoomSearch(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>

                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Showing {filteredRooms.length} of {rooms.length} rooms
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Room</th>
                        <th>Category</th>
                        <th>Price / Night</th>
                        <th>Max Guests</th>
                        <th>Rating</th>
                        <th>Featured</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRooms.map((room) => {
                        const identifier = room.id || room.roomId || room._id;
                        return (
                          <tr key={identifier}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                <img
                                  src={room.image}
                                  alt={room.name}
                                  style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                  onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";
                                  }}
                                />
                                <div>
                                  <strong style={{ color: 'var(--primary-green-dark)', display: 'block' }}>{room.name}</strong>
                                  <small style={{ color: 'var(--text-muted)' }}>ID: {room.roomId || room._id}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-green">{room.type}</span>
                            </td>
                            <td>
                              <strong>{formatCurrency(room.price)}</strong>
                            </td>
                            <td>{room.capacity} Guests</td>
                            <td>
                              <span style={{ color: '#d97706', fontWeight: '700' }}>★ {room.rating}</span>
                            </td>
                            <td>
                              {room.featured ? (
                                <span className="badge badge-gold">Featured</span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Regular</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '0.35rem 0.65rem' }}
                                  onClick={() => handleOpenEditRoom(room)}
                                  title="Edit room"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '0.35rem 0.65rem', color: '#dc2626', borderColor: '#fca5a5' }}
                                  onClick={() => handleOpenDelete(room)}
                                  title="Delete room"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredRooms.length === 0 && (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                            No rooms match the search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- TAB 2: BOOKINGS MANAGEMENT --- */}
            {activeTab === 'bookings' && (
              <div>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ position: 'relative', width: '320px' }}>
                    <Search className="w-4 h-4" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Filter by ref, guest, or room..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>

                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Showing {filteredBookings.length} of {bookings.length} reservations
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ref ID</th>
                        <th>Room</th>
                        <th>Guest Information</th>
                        <th>Dates & Duration</th>
                        <th>Total Bill</th>
                        <th>Status</th>
                        <th>Status Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b) => (
                        <tr key={b.bookingReference || b._id}>
                          <td>
                            <strong style={{ fontFamily: 'monospace', color: 'var(--primary-green-dark)' }}>
                              {b.bookingReference}
                            </strong>
                          </td>
                          <td>
                            <strong>{b.roomName}</strong>
                          </td>
                          <td>
                            <div>{b.guestName}</div>
                            <small style={{ color: 'var(--text-muted)', display: 'block' }}>{b.guestEmail}</small>
                            <small style={{ color: 'var(--text-muted)', display: 'block' }}>{b.guestPhone}</small>
                          </td>
                          <td>
                            <div>{formatDisplayDate(b.checkInDate)} &rarr; {formatDisplayDate(b.checkOutDate)}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{b.numberOfNights} Nights &bull; {b.numberOfGuests} Guests</small>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--primary-green)' }}>{formatCurrency(b.totalAmount)}</strong>
                          </td>
                          <td>
                            <span className={`badge ${
                              b.status === 'Confirmed' ? 'badge-confirmed' :
                              b.status === 'Cancelled' ? 'badge-cancelled' : 'badge-pending'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.bookingReference || b._id, e.target.value)}
                              className="form-control"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8125rem', width: 'auto' }}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                            No bookings found matching filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- ADD / EDIT ROOM MODAL --- */}
      {isRoomModalOpen && (
        <div className="modal-backdrop" onClick={() => !isSavingRoom && setIsRoomModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '680px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                {editingRoomId ? 'Edit Room Details' : 'Add New Hotel Room'}
              </h3>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setIsRoomModalOpen(false)}
                disabled={isSavingRoom}
                style={{ border: 'none', cursor: 'pointer', padding: '0.35rem' }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom}>
              <div className="modal-body">
                <FormInput
                  label="Room Name"
                  id="room-modal-name"
                  name="name"
                  value={roomFormData.name}
                  onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                  placeholder="e.g. Royal Heritage Villa"
                  required
                  error={formErrors.name}
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <FormInput
                    label="Room Type"
                    id="room-modal-type"
                    name="type"
                    as="select"
                    value={roomFormData.type}
                    onChange={(e) => setRoomFormData({ ...roomFormData, type: e.target.value })}
                    required
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Family Room">Family Room</option>
                    <option value="Luxury Suite">Luxury Suite</option>
                  </FormInput>

                  <FormInput
                    label="Price per Night (₹)"
                    id="room-modal-price"
                    name="price"
                    type="number"
                    min="500"
                    step="100"
                    value={roomFormData.price}
                    onChange={(e) => setRoomFormData({ ...roomFormData, price: e.target.value })}
                    placeholder="e.g. 8500"
                    required
                    error={formErrors.price}
                  />

                  <FormInput
                    label="Max Capacity"
                    id="room-modal-capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    max="10"
                    value={roomFormData.capacity}
                    onChange={(e) => setRoomFormData({ ...roomFormData, capacity: e.target.value })}
                    required
                    error={formErrors.capacity}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <FormInput
                    label="Bedding Description"
                    id="room-modal-bed"
                    name="bedType"
                    value={roomFormData.bedType}
                    onChange={(e) => setRoomFormData({ ...roomFormData, bedType: e.target.value })}
                    placeholder="e.g. 1 King Size Bed"
                  />

                  <FormInput
                    label="Room Size"
                    id="room-modal-size"
                    name="size"
                    value={roomFormData.size}
                    onChange={(e) => setRoomFormData({ ...roomFormData, size: e.target.value })}
                    placeholder="e.g. 520 sq ft"
                  />
                </div>

                <FormInput
                  label="Primary Image URL"
                  id="room-modal-image"
                  name="image"
                  value={roomFormData.image}
                  onChange={(e) => setRoomFormData({ ...roomFormData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  helperText="Provide a valid Unsplash or hotel image URL."
                />

                <FormInput
                  label="Facilities (comma-separated)"
                  id="room-modal-facilities"
                  name="facilities"
                  value={roomFormData.facilities}
                  onChange={(e) => setRoomFormData({ ...roomFormData, facilities: e.target.value })}
                  placeholder="Wi-Fi, Air Conditioning, Balcony, Mini Bar..."
                  helperText="Separate each amenity by comma."
                />

                <FormInput
                  label="Room Description"
                  id="room-modal-desc"
                  name="description"
                  as="textarea"
                  rows={3}
                  value={roomFormData.description}
                  onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                  placeholder="Detailed architectural and comfort highlights of this room..."
                  required
                  error={formErrors.description}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="room-modal-featured"
                    checked={roomFormData.featured}
                    onChange={(e) => setRoomFormData({ ...roomFormData, featured: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)' }}
                  />
                  <label htmlFor="room-modal-featured" style={{ fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>
                    Feature this room on Home Page
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsRoomModalOpen(false)}
                  disabled={isSavingRoom}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isSavingRoom}
                >
                  {isSavingRoom ? 'Saving to Database...' : editingRoomId ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Room?"
        message={`Are you sure you want to delete room "${roomToDelete?.name}"? It will be permanently removed from MongoDB.`}
        confirmText={isDeleting ? 'Deleting...' : 'Yes, Delete Room'}
        cancelText="Cancel"
        isDanger={true}
        confirmLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setRoomToDelete(null);
        }}
      />
    </div>
  );
}
