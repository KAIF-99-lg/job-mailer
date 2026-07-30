const logger = require('../utils/logger');

const createTransporter = () => ({ apiKey: process.env.BREVO_API_KEY });

const verifyTransporter = async () => {
  logger.info(`Brevo API transporter initialized. Key present: ${!!process.env.BREVO_API_KEY}`);
};

module.exports = { createTransporter, verifyTransporter };
