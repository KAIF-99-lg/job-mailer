const { createTransporter } = require('../config/mailer');
const { getProfile } = require('../config/profile');
const EmailHistory = require('../models/EmailHistory');
const Resume = require('../models/Resume');
const AppError = require('../utils/AppError');
const { generateGreeting, replaceTemplateVariables, generateSubject, sleep } = require('../utils/templateHelpers');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = createTransporter();
  }

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

  async sendWithRetry(mailOptions) {
    try {
      const resend = createTransporter();
      const { error } = await resend.emails.send({
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text,
        attachments: mailOptions.attachments.map(a => ({
          filename: a.filename,
          content: a.content,
        })),
      });
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (error) {
      logger.error(`Email send failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async sendBulk(params) {
    const { hrEmails, role, company, hrName, subject, bodyTemplate, userId, delayMs } = params;
    const profile = getProfile();

    // Fetch resume from MongoDB
    const resume = await Resume.findOne({ userId });
    if (!resume || !resume.fileData) {
      throw new AppError('No resume found. Please upload your resume first.', 400);
    }

    const finalBody = this.buildEmailBody(bodyTemplate, { hrName, company, role });
    const finalSubject = generateSubject(role, profile.name, subject);

    const results = [];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < hrEmails.length; i++) {
      const recipientEmail = hrEmails[i];

      const mailOptions = {
        from: `"${profile.name}" <onboarding@resend.dev>`,
        to: recipientEmail,
        subject: finalSubject,
        text: finalBody,
        attachments: [
          {
            filename: resume.originalName,
            content: resume.fileData,
          },
        ],
      };

      const { success, error } = await this.sendWithRetry(mailOptions);

      let historyId = null;
      try {
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
        historyId = historyEntry._id;
      } catch (historyError) {
        logger.warn(`History save skipped for ${recipientEmail}: ${historyError.message}`);
      }

      results.push({
        email: recipientEmail,
        status: success ? 'success' : 'failed',
        ...(historyId && { historyId }),
        ...(error && { error }),
      });

      if (success) successCount++;
      else failedCount++;

      if (i < hrEmails.length - 1) {
        await sleep(Math.max(0, delayMs));
      }
    }

    return { results, successCount, failedCount };
  }

  async retryFromHistory(historyEntry, userId) {
    const profile = getProfile();
    const resume = await Resume.findOne({ userId });
    if (!resume || !resume.fileData) {
      throw new AppError('No resume found. Please upload your resume first.', 400);
    }

    const mailOptions = {
      from: `"${profile.name}" <onboarding@resend.dev>`,
      to: historyEntry.hrEmail,
      subject: historyEntry.subject,
      text: historyEntry.body,
      attachments: [
        {
          filename: resume.originalName,
          content: resume.fileData,
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
