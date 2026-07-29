const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/apiResponse');

/**
 * General API rate limiter.
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 429, 'Too many requests. Please try again later.');
  },
});

/**
 * Stricter limiter for auth routes.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 429, 'Too many login attempts. Please try again in 15 minutes.');
  },
});

/**
 * Email sending limiter — prevent abuse.
 */
const mailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 429, 'Email sending limit reached. Please try again in an hour.');
  },
});

module.exports = { apiLimiter, authLimiter, mailLimiter };
