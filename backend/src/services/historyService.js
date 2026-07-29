const EmailHistory = require('../models/EmailHistory');
const AppError = require('../utils/AppError');

class HistoryService {
  /**
   * Get paginated email history with optional filters.
   * @param {object} query - { page, limit, status, search, role }
   * @returns {Promise<{records: object[], total: number, page: number, totalPages: number}>}
   */
  async getHistory(query = {}) {
    const { page = 1, limit = 20, status, search, role } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status && ['success', 'failed'].includes(status)) filter.status = status;
    if (role) filter.role = { $regex: role, $options: 'i' };
    if (search) {
      filter.$or = [
        { hrEmail: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const [records, total] = await Promise.all([
      EmailHistory.find(filter)
        .sort({ sentAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      EmailHistory.countDocuments(filter),
    ]);

    return {
      records,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  }

  /**
   * Get a single history entry by ID.
   * @param {string} historyId
   * @returns {Promise<EmailHistory>}
   */
  async getById(historyId) {
    const entry = await EmailHistory.findById(historyId);
    if (!entry) throw new AppError('History entry not found.', 404);
    return entry;
  }

  /**
   * Delete a history entry.
   * @param {string} historyId
   */
  async delete(historyId) {
    const entry = await EmailHistory.findByIdAndDelete(historyId);
    if (!entry) throw new AppError('History entry not found.', 404);
  }

  /**
   * Get dashboard statistics.
   * @returns {Promise<object>}
   */
  async getDashboardStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalStats, todayStats, recentActivity] = await Promise.all([
      EmailHistory.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            success: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
            failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
          },
        },
      ]),
      EmailHistory.aggregate([
        { $match: { sentAt: { $gte: todayStart } } },
        {
          $group: {
            _id: null,
            todayTotal: { $sum: 1 },
            todaySuccess: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
          },
        },
      ]),
      EmailHistory.find({})
        .sort({ sentAt: -1 })
        .limit(20)
        .select('companyName role hrEmail status sentAt')
        .lean(),
    ]);

    const stats = totalStats[0] || { total: 0, success: 0, failed: 0 };
    const today = todayStats[0] || { todayTotal: 0, todaySuccess: 0 };
    const successPercentage = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;

    return {
      totalEmails: stats.total,
      successCount: stats.success,
      failedCount: stats.failed,
      successPercentage,
      todayEmails: today.todayTotal,
      todaySuccess: today.todaySuccess,
      recentActivity,
    };
  }
}

module.exports = new HistoryService();
