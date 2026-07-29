const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Resume = require('../models/Resume');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class ResumeService {
  /**
   * Save resume metadata and delete the previous file if it exists.
   * @param {object} file - Multer file object
   * @returns {Promise<Resume>}
   */
  async uploadResume(file) {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = `resume_${uniqueSuffix}${ext}`;
    const filePath = path.join(__dirname, '../../uploads', fileName);

    const [existing] = await Promise.all([
      Resume.findOne({}),
      fs.promises.writeFile(filePath, file.buffer),
    ]);

    if (existing) {
      this._deleteFile(existing.path);
      await existing.deleteOne();
    }

    const resume = await Resume.create({
      originalName: file.originalname,
      fileName,
      fileSize: file.size,
      mimeType: file.mimetype,
      path: filePath,
    });

    return resume;
  }

  /**
   * Get the active resume.
   * @returns {Promise<Resume>}
   */
  async getResume() {
    const resume = await Resume.findOne({}).lean();
    if (!resume) throw new AppError('No resume found. Please upload your resume.', 404);
    return resume;
  }

  /**
   * Delete resume file and DB record.
   */
  async deleteResume() {
    const resume = await Resume.findOne({});
    if (!resume) throw new AppError('No resume found.', 404);
    this._deleteFile(resume.path);
    await resume.deleteOne();
  }

  /**
   * Safely delete a file from disk.
   * @param {string} filePath
   */
  _deleteFile(filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    } catch (error) {
      logger.warn(`Failed to delete file: ${filePath} — ${error.message}`);
    }
  }
}

module.exports = new ResumeService();
