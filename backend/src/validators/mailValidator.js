const { body } = require('express-validator');

const sendMailValidator = [
  body('role').trim().notEmpty().withMessage('Role is required.'),

  body('hrEmails')
    .isArray({ min: 1, max: 5 })
    .withMessage('Provide between 1 and 5 HR emails.')
    .custom((emails) => {
      // Validate each email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const email of emails) {
        if (!emailRegex.test(email)) {
          throw new Error(`Invalid email format: ${email}`);
        }
      }
      // Check for duplicates
      const unique = new Set(emails.map((e) => e.toLowerCase()));
      if (unique.size !== emails.length) {
        throw new Error('Duplicate emails are not allowed.');
      }
      return true;
    }),

  body('companyName').optional().trim().isLength({ max: 100 }).withMessage('Company name too long.'),
  body('hrName').optional().trim().isLength({ max: 100 }).withMessage('HR name too long.'),
  body('subject').optional().trim().isLength({ max: 200 }).withMessage('Subject too long.'),
];

module.exports = { sendMailValidator };
