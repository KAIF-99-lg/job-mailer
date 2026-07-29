const express = require('express');
const router = express.Router();

const { uploadResume, getResume, deleteResume } = require('../controllers/resumeController');
const upload = require('../middleware/upload');

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResume);
router.delete('/', deleteResume);

module.exports = router;
