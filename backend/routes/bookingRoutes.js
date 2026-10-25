import express from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Booking creation (accessible to logged-in users and guests)
router.post('/', optionalAuth, createBooking);

// User's own bookings
router.get('/my', protect, getMyBookings);

// Cancel a booking
router.patch('/:id/cancel', protect, cancelBooking);

// Admin-only management endpoints
router.get('/admin/all', protect, requireAdmin, getAllBookings);
router.patch('/admin/:id/status', protect, requireAdmin, updateBookingStatus);

export default router;
