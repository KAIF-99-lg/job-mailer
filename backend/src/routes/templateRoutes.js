const express = require('express');
const router = express.Router();

const {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/templateController');
const validate = require('../middleware/validate');
const { createTemplateValidator, updateTemplateValidator } = require('../validators/templateValidator');

router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);
router.post('/', createTemplateValidator, validate, createTemplate);
router.put('/:id', updateTemplateValidator, validate, updateTemplate);
router.delete('/:id', deleteTemplate);

module.exports = router;
