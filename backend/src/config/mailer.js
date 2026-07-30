const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

const createTransporter = () => {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_API_KEY,
    },
  });
  return transporter;
};

const verifyTransporter = async () => {
  logger.info('Brevo SMTP transporter initialized.');
};

module.exports = { createTransporter, verifyTransporter };
