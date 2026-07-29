const express = require('express');
const router = express.Router();

const { sendMail } = require('../controllers/mailController');
const validate = require('../middleware/validate');
const { mailLimiter } = require('../middleware/rateLimiter');
const { sendMailValidator } = require('../validators/mailValidator');

router.post('/send', mailLimiter, sendMailValidator, validate, sendMail);

module.exports = router;
