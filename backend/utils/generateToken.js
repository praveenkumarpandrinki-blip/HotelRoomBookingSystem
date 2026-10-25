import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token
 */
const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'hotel_booking_secret_key_2026_jwt_token',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

export default generateToken;
