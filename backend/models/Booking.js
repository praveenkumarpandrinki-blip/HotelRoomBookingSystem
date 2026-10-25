import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    roomId: {
      type: String,
      required: [true, 'Room identifier is required']
    },
    roomName: {
      type: String,
      required: [true, 'Room name is required']
    },
    roomImage: {
      type: String,
      default: ''
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    guestName: {
      type: String,
      required: [true, 'Guest full name is required'],
      trim: true
    },
    guestEmail: {
      type: String,
      required: [true, 'Guest email address is required'],
      lowercase: true,
      trim: true
    },
    guestPhone: {
      type: String,
      required: [true, 'Guest contact number is required'],
      trim: true
    },
    checkInDate: {
      type: String, // YYYY-MM-DD
      required: [true, 'Check-in date is required']
    },
    checkOutDate: {
      type: String, // YYYY-MM-DD
      required: [true, 'Check-out date is required']
    },
    numberOfNights: {
      type: Number,
      required: [true, 'Number of nights is required'],
      min: [1, 'Stay duration must be at least 1 night']
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest must be specified']
    },
    roomPricePerNight: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    taxAmount: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    specialRequests: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Completed', 'Cancelled'],
      default: 'Confirmed'
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
