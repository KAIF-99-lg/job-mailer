const User = require('../models/User');
const templateService = require('./templateService');
const { generateToken } = require('../utils/jwtHelper');
const AppError = require('../utils/AppError');

class AuthService {
  /**
   * Register a new user and seed default templates.
   * @param {object} data - { name, email, password }
   * @returns {Promise<{user: object, token: string}>}
   */
  async register(data) {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError('Email already registered.', 409);

    const user = await User.create({ name, email, password });

    // Seed default templates for new user
    await templateService.seedDefaultTemplates(user._id);

    const token = generateToken(user._id);
    return { user, token };
  }

  /**
   * Login with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{user: object, token: string}>}
   */
  async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) throw new AppError('Invalid email or password.', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password.', 401);

    const token = generateToken(user._id);
    return { user, token };
  }

  /**
   * Update user profile fields.
   * @param {string} userId
   * @param {object} updates
   * @returns {Promise<User>}
   */
  async updateProfile(userId, updates) {
    const allowedFields = ['name', 'phone', 'linkedin', 'github', 'leetcode', 'signature', 'preferredDelay', 'theme'];
    const filtered = {};
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) filtered[field] = updates[field];
    });

    const user = await User.findByIdAndUpdate(userId, filtered, { new: true, runValidators: true });
    if (!user) throw new AppError('User not found.', 404);
    return user;
  }

  /**
   * Change user password.
   * @param {string} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new AppError('User not found.', 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError('Current password is incorrect.', 400);

    user.password = newPassword;
    await user.save();
  }
}

module.exports = new AuthService();
