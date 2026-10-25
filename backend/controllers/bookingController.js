import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import mongoose from 'mongoose';

/**
 * Helper to calculate number of nights between two YYYY-MM-DD dates
 */
const calculateNights = (checkInStr, checkOutStr) => {
  const start = new Date(checkInStr);
  const end = new Date(checkOutStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

/**
 * @desc    Create a new room booking (with overlapping dates validation)
 * @route   POST /api/bookings
 * @access  Public (or Private with optionalAuth)
 */
export const createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests
    } = req.body;

    // 1. Basic Field Validation
    if (!roomId || !checkInDate || !checkOutDate || !guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: roomId, checkInDate, checkOutDate, guestName, guestEmail, and guestPhone.'
      });
    }

    // 2. Validate Dates
    const today = new Date().toISOString().split('T')[0];
    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past.'
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after the check-in date.'
      });
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    if (nights < 1) {
      return res.status(400).json({
        success: false,
        message: 'Minimum duration of stay is 1 night.'
      });
    }

    // 3. Find Room to verify existence, capacity, and current price
    let room = null;
    if (mongoose.Types.ObjectId.isValid(roomId)) {
      room = await Room.findById(roomId);
    }
    if (!room) {
      room = await Room.findOne({ roomId: roomId });
    }

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'The requested room could not be found in our catalog.'
      });
    }

    const guests = Number(numberOfGuests) || 1;
    if (guests > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `This room accommodates a maximum of ${room.capacity} guests.`
      });
    }

    // 4. Overlap Prevention: Check for existing active confirmed bookings for this room
    // Overlap condition: (existingCheckIn < requestedCheckOut) AND (existingCheckOut > requestedCheckIn)
    const normalizedRoomIdentifier = room.roomId || room._id.toString();
    const overlappingBooking = await Booking.findOne({
      $or: [
        { room: room._id },
        { roomId: normalizedRoomIdentifier },
        { roomId: roomId }
      ],
      status: 'Confirmed',
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate }
    });

    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        message: `This room is already reserved from ${overlappingBooking.checkInDate} to ${overlappingBooking.checkOutDate}. Please choose alternative dates or explore another suite.`
      });
    }

    // 5. Calculate billing breakdown
    const pricePerNight = room.price;
    const subtotal = pricePerNight * nights;
    const taxAmount = Math.round(subtotal * 0.12); // 12% GST
    const totalAmount = subtotal + taxAmount;

    // Generate unique booking reference
    const reference = 'BK-' + Math.floor(100000 + Math.random() * 900000);

    // 6. Create booking
    const booking = await Booking.create({
      bookingReference: reference,
      room: room._id,
      roomId: normalizedRoomIdentifier,
      roomName: room.name,
      roomImage: room.image,
      user: req.user ? req.user._id : null,
      guestName: guestName.trim(),
      guestEmail: guestEmail.toLowerCase().trim(),
      guestPhone: guestPhone.trim(),
      checkInDate,
      checkOutDate,
      numberOfNights: nights,
      numberOfGuests: guests,
      roomPricePerNight: pricePerNight,
      subtotal,
      taxAmount,
      totalAmount,
      specialRequests: specialRequests ? specialRequests.trim() : '',
      status: 'Confirmed'
    });

    res.status(201).json({
      success: true,
      message: `Reservation confirmed! Your booking reference is ${reference}.`,
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get bookings of the logged-in user
 * @route   GET /api/bookings/my
 * @access  Private (or authenticated guest)
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const userEmail = req.user.email.toLowerCase().trim();

    // Find bookings either linked by userId or matching the user's email
    const bookings = await Booking.find({
      $or: [{ user: req.user._id }, { guestEmail: userEmail }]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a booking (by user or admin)
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    let booking = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      booking = await Booking.findById(id);
    }
    if (!booking) {
      booking = await Booking.findOne({ bookingReference: id });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking reservation '${id}' was not found.`
      });
    }

    // Check authorization: User must own the booking OR be an administrator
    const isOwner =
      (booking.user && booking.user.toString() === req.user._id.toString()) ||
      booking.guestEmail.toLowerCase() === req.user.email.toLowerCase();

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking.'
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({
      success: true,
      message: `Booking reference ${booking.bookingReference} has been successfully cancelled.`,
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings (Admin only)
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { bookingReference: searchRegex },
        { guestName: searchRegex },
        { guestEmail: searchRegex },
        { roomName: searchRegex }
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update booking status (Admin only)
 * @route   PATCH /api/admin/bookings/:id/status
 * @access  Private/Admin
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Confirmed', 'Completed', or 'Cancelled'."
      });
    }

    let booking = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      booking = await Booking.findById(id);
    }
    if (!booking) {
      booking = await Booking.findOne({ bookingReference: id });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking reservation '${id}' was not found.`
      });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      message: `Booking ${booking.bookingReference} status updated to ${status}.`,
      booking
    });
  } catch (error) {
    next(error);
  }
};
