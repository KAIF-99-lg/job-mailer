const express = require('express');
const router = express.Router();

const { uploadResume, getResume, deleteResume } = require('../controllers/resumeController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResume);
router.delete('/', protect, deleteResume);

module.exports = router;
