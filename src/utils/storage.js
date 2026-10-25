import { INITIAL_ROOMS } from '../data/rooms';

const STORAGE_KEYS = {
  ROOMS: 'hotel_rooms_data_v1',
  BOOKINGS: 'hotel_bookings_data_v1',
  USERS: 'hotel_users_data_v1',
  CURRENT_USER: 'hotel_current_user_v1'
};

// Initial default users for demonstration
export const INITIAL_USERS = [
  {
    id: "user-demo-1",
    name: "Ananya Deshmukh",
    email: "guest@example.com",
    phone: "+91 98765 43210",
    password: "Password@123",
    role: "user"
  },
  {
    id: "user-admin-1",
    name: "Aurelia Management",
    email: "admin@grandaurelia.com",
    phone: "+91 98765 00000",
    password: "Admin@123",
    role: "admin"
  }
];

// Initial demo bookings so demo user has immediate visible data in My Bookings
export const INITIAL_BOOKINGS = [
  {
    bookingReference: "BK-849201",
    roomId: "room-102",
    roomName: "Deluxe Garden View Room",
    roomImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    guestName: "Ananya Deshmukh",
    guestEmail: "guest@example.com",
    guestPhone: "+91 98765 43210",
    checkInDate: "2026-11-10",
    checkOutDate: "2026-11-13",
    numberOfNights: 3,
    numberOfGuests: 2,
    roomPricePerNight: 4800,
    subtotal: 14400,
    taxAmount: 1728,
    totalAmount: 16128,
    specialRequests: "High floor and late check-in around 6 PM.",
    status: "Confirmed",
    createdAt: "2026-10-20T14:30:00Z"
  }
];

// Helper to safely get item from localStorage
function safeGet(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

// Helper to safely set item in localStorage
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Initialize all storage on app startup without overwriting existing modified data
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
    safeSet(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    safeSet(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }
  // Set default demo user logged in initially for friendly first run, if not set
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    safeSet(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }
}

// --- ROOMS STORAGE API ---
export function getStoredRooms() {
  const rooms = safeGet(STORAGE_KEYS.ROOMS, null);
  if (!rooms || rooms.length === 0) {
    safeSet(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    return INITIAL_ROOMS;
  }
  return rooms;
}

export function getStoredRoomById(id) {
  const rooms = getStoredRooms();
  return rooms.find(r => r.id === id) || null;
}

export function saveStoredRoom(roomData) {
  const rooms = getStoredRooms();
  const newRoom = {
    ...roomData,
    id: roomData.id || `room-${Date.now()}`,
    rating: Number(roomData.rating) || 4.5,
    reviewsCount: Number(roomData.reviewsCount) || 1,
    price: Number(roomData.price),
    capacity: Number(roomData.capacity),
    isAvailable: roomData.isAvailable !== false,
    facilities: Array.isArray(roomData.facilities)
      ? roomData.facilities
      : (typeof roomData.facilities === 'string'
          ? roomData.facilities.split(',').map(f => f.trim()).filter(Boolean)
          : []),
    images: roomData.images && roomData.images.length > 0
      ? roomData.images
      : [roomData.image || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"]
  };

  const updated = [newRoom, ...rooms];
  safeSet(STORAGE_KEYS.ROOMS, updated);
  return newRoom;
}

export function updateStoredRoom(id, updatedFields) {
  const rooms = getStoredRooms();
  const index = rooms.findIndex(r => r.id === id);
  if (index === -1) return null;

  const facilities = Array.isArray(updatedFields.facilities)
    ? updatedFields.facilities
    : (typeof updatedFields.facilities === 'string'
        ? updatedFields.facilities.split(',').map(f => f.trim()).filter(Boolean)
        : rooms[index].facilities);

  const updatedRoom = {
    ...rooms[index],
    ...updatedFields,
    price: Number(updatedFields.price !== undefined ? updatedFields.price : rooms[index].price),
    capacity: Number(updatedFields.capacity !== undefined ? updatedFields.capacity : rooms[index].capacity),
    facilities
  };

  rooms[index] = updatedRoom;
  safeSet(STORAGE_KEYS.ROOMS, rooms);
  return updatedRoom;
}

export function deleteStoredRoom(id) {
  const rooms = getStoredRooms();
  const filtered = rooms.filter(r => r.id !== id);
  safeSet(STORAGE_KEYS.ROOMS, filtered);
  return true;
}

export function resetRoomsToDefault() {
  safeSet(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
  return INITIAL_ROOMS;
}

// --- BOOKINGS STORAGE API ---
export function getStoredBookings() {
  return safeGet(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
}

export function saveStoredBooking(bookingData) {
  const bookings = getStoredBookings();
  const reference = 'BK-' + Math.floor(100000 + Math.random() * 900000);
  const newBooking = {
    ...bookingData,
    bookingReference: reference,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  const updated = [newBooking, ...bookings];
  safeSet(STORAGE_KEYS.BOOKINGS, updated);
  return newBooking;
}

export function updateStoredBookingStatus(bookingReference, newStatus) {
  const bookings = getStoredBookings();
  const index = bookings.findIndex(b => b.bookingReference === bookingReference);
  if (index === -1) return null;

  bookings[index] = {
    ...bookings[index],
    status: newStatus
  };
  safeSet(STORAGE_KEYS.BOOKINGS, bookings);
  return bookings[index];
}

// --- USERS & AUTH STORAGE API ---
export function getStoredUsers() {
  return safeGet(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export function registerStoredUser(userData) {
  const users = getStoredUsers();
  const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
    role: 'user'
  };

  users.push(newUser);
  safeSet(STORAGE_KEYS.USERS, users);
  safeSet(STORAGE_KEYS.CURRENT_USER, newUser);
  return newUser;
}

export function loginStoredUser(email, password) {
  const users = getStoredUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password. Please verify your credentials.');
  }

  safeSet(STORAGE_KEYS.CURRENT_USER, user);
  return user;
}

export function getStoredCurrentUser() {
  return safeGet(STORAGE_KEYS.CURRENT_USER, null);
}

export function clearStoredCurrentUser() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (err) {
    console.error('Error clearing current user:', err);
  }
}
