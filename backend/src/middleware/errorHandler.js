const logger = require('../utils/logger');

/**
 * Handle Mongoose CastError (invalid ObjectId).
 */
const handleCastError = (err) => {
  return { message: `Invalid ${err.path}: ${err.value}.`, statusCode: 400 };
};

/**
 * Handle Mongoose duplicate key error.
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return { message: `${field} already exists. Please use a different value.`, statusCode: 409 };
};

/**
 * Handle Mongoose validation errors.
 */
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return { message: messages.join(' '), statusCode: 400 };
};

/**
 * Handle JWT errors.
 */
const handleJWTError = () => ({ message: 'Invalid token. Please log in again.', statusCode: 401 });
const handleJWTExpiredError = () => ({ message: 'Token expired. Please log in again.', statusCode: 401 });

/**
 * Centralized error middleware — must be registered last in app.js.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Transform known error types
  if (err.name === 'CastError') ({ message, statusCode } = handleCastError(err));
  if (err.code === 11000) ({ message, statusCode } = handleDuplicateKeyError(err));
  if (err.name === 'ValidationError') ({ message, statusCode } = handleValidationError(err));
  if (err.name === 'JsonWebTokenError') ({ message, statusCode } = handleJWTError());
  if (err.name === 'TokenExpiredError') ({ message, statusCode } = handleJWTExpiredError());

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} — ${err.stack || err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
