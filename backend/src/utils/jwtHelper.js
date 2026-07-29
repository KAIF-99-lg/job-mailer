const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

/**
 * Generate a signed JWT token for a user.
 * @param {string} userId - MongoDB user _id
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {object} Decoded payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Invalid or expired token.', 401);
  }
};

module.exports = { generateToken, verifyToken };
