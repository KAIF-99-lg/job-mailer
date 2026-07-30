const logger = require('../utils/logger');

const createTransporter = () => ({ apiKey: process.env.BREVO_API_KEY });

const verifyTransporter = async () => {
  logger.info('Brevo API transporter initialized.');
};

module.exports = { createTransporter, verifyTransporter };
