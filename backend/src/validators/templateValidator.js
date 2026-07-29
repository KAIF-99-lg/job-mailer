const { body } = require('express-validator');

const createTemplateValidator = [
  body('roleName').trim().notEmpty().withMessage('Role name is required.').isLength({ max: 100 }),
  body('subject').trim().notEmpty().withMessage('Subject is required.').isLength({ max: 200 }),
  body('body').trim().notEmpty().withMessage('Email body is required.'),
];

const updateTemplateValidator = [
  body('roleName').optional().trim().notEmpty().withMessage('Role name cannot be empty.').isLength({ max: 100 }),
  body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty.').isLength({ max: 200 }),
  body('body').optional().trim().notEmpty().withMessage('Email body cannot be empty.'),
];

module.exports = { createTemplateValidator, updateTemplateValidator };
