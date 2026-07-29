const emailService = require('../services/emailService');
const templateService = require('../services/templateService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * POST /api/mail/send
 * Validates, fetches template, sends emails sequentially, saves history.
 */
const sendMail = asyncHandler(async (req, res) => {
  const { role, hrEmails, companyName, hrName, subject, preferredDelay } = req.body;

  const template = await templateService.getByRole(role);
  const delayMs = preferredDelay ?? 0;

  const { results, successCount, failedCount } = await emailService.sendBulk({
    hrEmails,
    role,
    company: companyName,
    hrName,
    subject,
    bodyTemplate: template.body,
    delayMs,
  });

  const message =
    failedCount === 0
      ? `All ${successCount} email(s) sent successfully.`
      : `${successCount} sent, ${failedCount} failed.`;

  sendSuccess(res, 200, message, { results, successCount, failedCount });
});

module.exports = { sendMail };
