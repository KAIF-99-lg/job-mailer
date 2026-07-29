const resumeService = require('../services/resumeService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded.', 400);
  const resume = await resumeService.uploadResume(req.file, req.user._id);
  sendSuccess(res, 201, 'Resume uploaded successfully.', { resume });
});

const getResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getResume(req.user._id);
  sendSuccess(res, 200, 'Resume fetched.', { resume });
});

const deleteResume = asyncHandler(async (req, res) => {
  await resumeService.deleteResume(req.user._id);
  sendSuccess(res, 200, 'Resume deleted successfully.');
});

module.exports = { uploadResume, getResume, deleteResume };
