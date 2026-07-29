const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  sendSuccess(res, 201, 'Registration successful.', { user, token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);
  sendSuccess(res, 200, 'Login successful.', { user, token });
});

const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'Profile fetched.', { user: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  sendSuccess(res, 200, 'Profile updated successfully.', { user });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, currentPassword, newPassword);
  sendSuccess(res, 200, 'Password changed successfully.');
});

module.exports = { register, login, getMe, updateProfile, changePassword };
