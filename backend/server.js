require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/database');
const { verifyTransporter } = require('./src/config/mailer');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Verify email transporter (non-blocking)
  verifyTransporter();

  server = app.listen(PORT, () => {
    logger.info(`JobMailer AI server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = (signal) => {
  logger.warn(`${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ─── Unhandled Rejections & Exceptions ───────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  shutdown('uncaughtException');
});

startServer();
