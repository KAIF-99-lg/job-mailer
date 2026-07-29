const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

/**
 * Middleware to check express-validator results.
 * If validation fails, returns 422 with all error messages.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return sendError(res, 422, 'Validation failed.', messages);
  }
  next();
};

module.exports = validate;
