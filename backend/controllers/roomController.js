import Room from '../models/Room.js';
import { INITIAL_ROOMS } from '../utils/seedData.js';
import mongoose from 'mongoose';

/**
 * Helper to query a room either by custom string roomId or MongoDB ObjectId
 */
const findRoomByIdOrRoomId = async (idParam) => {
  if (mongoose.Types.ObjectId.isValid(idParam)) {
    const room = await Room.findById(idParam);
    if (room) return room;
  }
  return await Room.findOne({ roomId: idParam });
};

/**
 * @desc    Get all rooms with optional filtering, search, and sorting
 * @route   GET /api/rooms
 * @access  Public
 */
export const getAllRooms = async (req, res, next) => {
  try {
    const { type, maxPrice, search, sort } = req.query;

    const query = {};

    // Filter by type
    if (type && type.trim()) {
      query.type = type.trim();
    }

    // Filter by maxPrice
    if (maxPrice && !isNaN(Number(maxPrice))) {
      query.price = { $lte: Number(maxPrice) };
    }

    // Text search in name or description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { type: searchRegex }
      ];
    }

    // Sorting
    let sortOption = { featured: -1, rating: -1, createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating-desc') {
      sortOption = { rating: -1 };
    }

    const rooms = await Room.find(query).sort(sortOption);

    res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single room by ID or roomId
 * @route   GET /api/rooms/:id
 * @access  Public
 */
export const getRoomById = async (req, res, next) => {
  try {
    const room = await findRoomByIdOrRoomId(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Room with identifier '${req.params.id}' was not found.`
      });
    }

    res.json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new room
 * @route   POST /api/rooms
 * @access  Private/Admin
 */
export const createRoom = async (req, res, next) => {
  try {
    const {
      name,
      type,
      price,
      capacity,
      bedType,
      size,
      image,
      images,
      shortDescription,
      description,
      facilities,
      featured,
      isAvailable
    } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide room name, price, and description.'
      });
    }

    // Ensure facilities is an array
    const parsedFacilities = Array.isArray(facilities)
      ? facilities
      : typeof facilities === 'string'
      ? facilities.split(',').map((f) => f.trim()).filter(Boolean)
      : ['High-Speed Wi-Fi', 'Air Conditioning', 'Smart TV'];

    const newRoomId = `room-${Date.now()}`;
    const primaryImg = image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80';

    const room = await Room.create({
      roomId: newRoomId,
      name: name.trim(),
      type: type || 'Deluxe',
      price: Number(price),
      capacity: Number(capacity) || 2,
      bedType: bedType || '1 Plush King Bed',
      size: size || '450 sq ft',
      image: primaryImg,
      images: Array.isArray(images) && images.length > 0 ? images : [primaryImg],
      shortDescription: shortDescription || description.slice(0, 100),
      description: description.trim(),
      facilities: parsedFacilities,
      featured: !!featured,
      isAvailable: isAvailable !== false
    });

    res.status(201).json({
      success: true,
      message: 'New hotel room added successfully!',
      room
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update room details
 * @route   PUT /api/rooms/:id
 * @access  Private/Admin
 */
export const updateRoom = async (req, res, next) => {
  try {
    const room = await findRoomByIdOrRoomId(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Room with identifier '${req.params.id}' was not found.`
      });
    }

    const {
      name,
      type,
      price,
      capacity,
      bedType,
      size,
      image,
      images,
      shortDescription,
      description,
      facilities,
      featured,
      isAvailable
    } = req.body;

    if (name !== undefined) room.name = name.trim();
    if (type !== undefined) room.type = type;
    if (price !== undefined) room.price = Number(price);
    if (capacity !== undefined) room.capacity = Number(capacity);
    if (bedType !== undefined) room.bedType = bedType;
    if (size !== undefined) room.size = size;
    if (image !== undefined) room.image = image;
    if (images !== undefined) room.images = images;
    if (shortDescription !== undefined) room.shortDescription = shortDescription;
    if (description !== undefined) room.description = description;
    if (featured !== undefined) room.featured = featured;
    if (isAvailable !== undefined) room.isAvailable = isAvailable;

    if (facilities !== undefined) {
      room.facilities = Array.isArray(facilities)
        ? facilities
        : typeof facilities === 'string'
        ? facilities.split(',').map((f) => f.trim()).filter(Boolean)
        : room.facilities;
    }

    const updatedRoom = await room.save();

    res.json({
      success: true,
      message: 'Room details updated successfully!',
      room: updatedRoom
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a room
 * @route   DELETE /api/rooms/:id
 * @access  Private/Admin
 */
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await findRoomByIdOrRoomId(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Room with identifier '${req.params.id}' was not found.`
      });
    }

    await Room.findByIdAndDelete(room._id);

    res.json({
      success: true,
      message: `Room '${room.name}' has been successfully deleted.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset rooms catalog to default 8 luxury rooms
 * @route   POST /api/rooms/reset
 * @access  Private/Admin
 */
export const resetRooms = async (req, res, next) => {
  try {
    await Room.deleteMany();
    const rooms = await Room.insertMany(INITIAL_ROOMS);

    res.json({
      success: true,
      message: 'Rooms catalog has been reset to initial luxury defaults.',
      count: rooms.length,
      rooms
    });
  } catch (error) {
    next(error);
  }
};
