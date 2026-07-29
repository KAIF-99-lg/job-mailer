const historyService = require('../services/historyService');
const emailService = require('../services/emailService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const getHistory = asyncHandler(async (req, res) => {
  const result = await historyService.getHistory(req.user._id, req.query);
  sendSuccess(res, 200, 'History fetched.', result);
});

const deleteHistory = asyncHandler(async (req, res) => {
  await historyService.delete(req.params.id, req.user._id);
  sendSuccess(res, 200, 'History entry deleted.');
});

const retryEmail = asyncHandler(async (req, res) => {
  const historyEntry = await historyService.getById(req.params.id, req.user._id);
  const { success, error, historyEntry: updated } = await emailService.retryFromHistory(historyEntry, req.user);

  const message = success ? 'Email resent successfully.' : 'Retry failed.';
  sendSuccess(res, 200, message, { entry: updated, success, ...(error && { error }) });
});

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await historyService.getDashboardStats(req.user._id);
  sendSuccess(res, 200, 'Dashboard data fetched.', stats);
});

module.exports = { getHistory, deleteHistory, retryEmail, getDashboard };
