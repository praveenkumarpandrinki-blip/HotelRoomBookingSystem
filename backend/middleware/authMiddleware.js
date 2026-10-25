import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes: verifies JWT token and attaches user to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'hotel_booking_secret_key_2026_jwt_token'
      );

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User account not found or has been removed.'
        });
      }

      return next();
    } catch (error) {
      console.error('[Auth Error]:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or has expired.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no authentication token provided.'
    });
  }
};

/**
 * Optional authentication: attaches user if valid token exists, but doesn't reject if not
 */
export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'hotel_booking_secret_key_2026_jwt_token'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Ignore invalid token for optional auth
      req.user = null;
    }
  }
  next();
};
