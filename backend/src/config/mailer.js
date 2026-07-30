const { Resend } = require('resend');
const logger = require('../utils/logger');

let resendClient = null;

const createTransporter = () => {
  if (resendClient) return resendClient;
  resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
};

const verifyTransporter = async () => {
  logger.info('Resend email client initialized.');
};

module.exports = { createTransporter, verifyTransporter };
