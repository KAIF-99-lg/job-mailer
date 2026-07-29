const { createTransporter } = require('../config/mailer');
const { getProfile } = require('../config/profile');
const EmailHistory = require('../models/EmailHistory');
const { generateGreeting, replaceTemplateVariables, generateSubject, sleep } = require('../utils/templateHelpers');
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
    const { hrName, company, role } = params;
    const profile = getProfile();
    const greeting = generateGreeting(hrName, company);

    const variables = {
      greeting,
      hrName: hrName || '',
      company: company || '',
      role: role || '',
      candidateName: profile.name || '',
      phone: profile.phone || '',
      email: profile.email || '',
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      leetcode: profile.leetcode || '',
      portfolio: profile.portfolio || '',
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
    const { hrEmails, role, company, hrName, subject, bodyTemplate, delayMs } = params;
    const profile = getProfile();

    const finalBody = this.buildEmailBody(bodyTemplate, { hrName, company, role });
    const finalSubject = generateSubject(role, profile.name, subject);

    const results = [];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < hrEmails.length; i++) {
      const recipientEmail = hrEmails[i];

      const mailOptions = {
        from: `"${profile.name}" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: finalSubject,
        text: finalBody,
        attachments: [
          {
            filename: profile.resumeFileName,
            path: profile.resumePath,
          },
        ],
      };

      const { success, error } = await this.sendWithRetry(mailOptions);

      // Save to history
      const historyEntry = await EmailHistory.create({
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
  async retryFromHistory(historyEntry) {
    const profile = getProfile();
    const mailOptions = {
      from: `"${profile.name}" <${process.env.EMAIL_USER}>`,
      to: historyEntry.hrEmail,
      subject: historyEntry.subject,
      text: historyEntry.body,
      attachments: [
        {
          filename: profile.resumeFileName,
          path: profile.resumePath,
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
