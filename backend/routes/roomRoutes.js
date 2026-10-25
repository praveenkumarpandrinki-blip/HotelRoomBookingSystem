import express from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  resetRooms
} from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

// Admin-protected routes
router.post('/', protect, requireAdmin, createRoom);
router.put('/:id', protect, requireAdmin, updateRoom);
router.delete('/:id', protect, requireAdmin, deleteRoom);
router.post('/reset/catalog', protect, requireAdmin, resetRooms);

export default router;
