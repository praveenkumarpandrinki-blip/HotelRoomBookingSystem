import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Please provide room name'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Please provide room type'],
      enum: ['Standard', 'Deluxe', 'Executive Suite', 'Family Room', 'Luxury Suite'],
      default: 'Deluxe'
    },
    price: {
      type: Number,
      required: [true, 'Please provide room price per night in INR'],
      min: [100, 'Price must be at least ₹100']
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 10
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify maximum guest capacity'],
      min: [1, 'Capacity must be at least 1 guest'],
      default: 2
    },
    bedType: {
      type: String,
      default: '1 Plush King Bed'
    },
    size: {
      type: String,
      default: '450 sq ft'
    },
    featured: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    image: {
      type: String,
      required: [true, 'Please provide a primary room image URL']
    },
    images: {
      type: [String],
      default: []
    },
    shortDescription: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Please provide room description']
    },
    facilities: {
      type: [String],
      default: ['High-Speed Wi-Fi', 'Air Conditioning', 'Smart TV', 'Complimentary Breakfast']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual id property that defaults to roomId or _id
roomSchema.virtual('id').get(function () {
  return this.roomId || this._id.toString();
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
