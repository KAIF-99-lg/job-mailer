const express = require('express');
const router = express.Router();

const { getHistory, deleteHistory, retryEmail, getDashboard } = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getHistory);
router.get('/dashboard', getDashboard);
router.delete('/:id', deleteHistory);
router.post('/retry/:id', retryEmail);

module.exports = router;
