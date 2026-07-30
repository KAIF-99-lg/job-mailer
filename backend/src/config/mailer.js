const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

const createTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 10,
  });

  return transporter;
};

const verifyTransporter = async () => {
  try {
    const t = createTransporter();
    await t.verify();
    logger.info('Email transporter verified successfully.');
  } catch (error) {
    logger.error(`Email transporter verification failed: ${error.message}`);
  }
};

module.exports = { createTransporter, verifyTransporter };
