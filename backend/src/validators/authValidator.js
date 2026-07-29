const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters.'),
  body('email').trim().isEmail().withMessage('Please provide a valid email.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid email.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

const updateProfileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty.').isLength({ max: 100 }),
  body('phone').optional().trim(),
  body('linkedin').optional().trim().isURL({ require_protocol: false }).withMessage('Invalid LinkedIn URL.'),
  body('github').optional().trim().isURL({ require_protocol: false }).withMessage('Invalid GitHub URL.'),
  body('leetcode').optional().trim().isURL({ require_protocol: false }).withMessage('Invalid LeetCode URL.'),
  body('preferredDelay').optional().isIn([3000, 5000, 10000]).withMessage('Delay must be 3000, 5000, or 10000 ms.'),
  body('theme').optional().isIn(['light', 'dark', 'system']).withMessage('Theme must be light, dark, or system.'),
];

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
];

module.exports = { registerValidator, loginValidator, updateProfileValidator, changePasswordValidator };
