const path = require('path');
const { createTransporter } = require('../config/mailer');
const EmailHistory = require('../models/EmailHistory');
const Resume = require('../models/Resume');

const HARDCODED_RESUME_PATH = path.resolve(__dirname, '../../../KAIF_RESUME.pdf');
const HARDCODED_RESUME_NAME = 'KAIF_RESUME.pdf';
const { generateGreeting, replaceTemplateVariables, generateSubject, sleep } = require('../utils/templateHelpers');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = createTransporter();
  }

  /**
   * Build the final email body by replacing all template variables.
   * @param {string} bodyTemplate - Raw template with {{variables}}
   * @param {object} params
   * @returns {string}
   */
  buildEmailBody(bodyTemplate, params) {
    const { hrName, company, role, user } = params;
    const greeting = generateGreeting(hrName, company);

    const variables = {
      greeting,
      hrName: hrName || '',
      company: company || '',
      role: role || '',
      candidateName: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      linkedin: user.linkedin || '',
      github: user.github || '',
      leetcode: user.leetcode || '',
    };

    return replaceTemplateVariables(bodyTemplate, variables);
  }

  /**
   * Send a single email with one retry on failure.
   * @param {object} mailOptions - Nodemailer mail options
   * @param {number} retryCount - Current retry attempt
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  async sendWithRetry(mailOptions, retryCount = 0) {
    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, error: null };
    } catch (error) {
      if (retryCount < 1) {
        logger.warn(`Email send failed. Retrying... (${error.message})`);
        await sleep(2000);
        return this.sendWithRetry(mailOptions, retryCount + 1);
      }
      logger.error(`Email send failed after retry: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send emails sequentially to multiple recipients with configurable delay.
   * Saves each result to EmailHistory.
   *
   * @param {object} params
   * @param {string[]} params.hrEmails
   * @param {string} params.role
   * @param {string} params.company
   * @param {string} params.hrName
   * @param {string} params.subject
   * @param {string} params.bodyTemplate
   * @param {object} params.user - Mongoose User document
   * @param {number} params.delayMs - Delay between emails in ms
   * @returns {Promise<{results: object[], successCount: number, failedCount: number}>}
   */
  async sendBulk(params) {
    const { hrEmails, role, company, hrName, subject, bodyTemplate, user, delayMs } = params;

    const finalBody = this.buildEmailBody(bodyTemplate, { hrName, company, role, user });
    const finalSubject = generateSubject(role, user.name, subject);

    const results = [];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < hrEmails.length; i++) {
      const recipientEmail = hrEmails[i];

      const mailOptions = {
        from: `"${user.name}" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: finalSubject,
        text: finalBody,
        attachments: [
          {
            filename: HARDCODED_RESUME_NAME,
            path: HARDCODED_RESUME_PATH,
          },
        ],
      };

      const { success, error } = await this.sendWithRetry(mailOptions);

      // Save to history
      const historyEntry = await EmailHistory.create({
        userId: user._id,
        companyName: company || '',
        role,
        hrEmail: recipientEmail,
        hrName: hrName || '',
        subject: finalSubject,
        body: finalBody,
        status: success ? 'success' : 'failed',
        errorMessage: error,
        retryCount: success ? 0 : 1,
        sentAt: new Date(),
      });

      results.push({
        email: recipientEmail,
        status: success ? 'success' : 'failed',
        historyId: historyEntry._id,
        ...(error && { error }),
      });

      if (success) successCount++;
      else failedCount++;

      // Delay between emails (skip after last one)
      if (i < hrEmails.length - 1) {
        await sleep(delayMs);
      }
    }

    return { results, successCount, failedCount };
  }

  /**
   * Retry a previously failed email from history.
   * @param {object} historyEntry - EmailHistory document
   * @param {object} user - User document
   * @returns {Promise<object>}
   */
  async retryFromHistory(historyEntry, user) {
    const mailOptions = {
      from: `"${user.name}" <${process.env.EMAIL_USER}>`,
      to: historyEntry.hrEmail,
      subject: historyEntry.subject,
      text: historyEntry.body,
      attachments: [
        {
          filename: HARDCODED_RESUME_NAME,
          path: HARDCODED_RESUME_PATH,
        },
      ],
    };

    const { success, error } = await this.sendWithRetry(mailOptions);

    historyEntry.status = success ? 'success' : 'failed';
    historyEntry.errorMessage = error;
    historyEntry.retryCount += 1;
    historyEntry.sentAt = new Date();
    await historyEntry.save();

    return { success, error, historyEntry };
  }
}

module.exports = new EmailService();
