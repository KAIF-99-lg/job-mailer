const Resume = require('../models/Resume');
const AppError = require('../utils/AppError');

class ResumeService {
  async uploadResume(file, userId) {
    await Resume.deleteOne({ userId });

    const resume = await Resume.create({
      userId,
      originalName: file.originalname,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      path: '',
      fileData: file.buffer,
    });

    return resume;
  }

  async getResume(userId) {
    const resume = await Resume.findOne({ userId }).lean();
    if (!resume) throw new AppError('No resume found. Please upload your resume.', 404);
    return resume;
  }

  async deleteResume(userId) {
    const resume = await Resume.findOne({ userId });
    if (!resume) throw new AppError('No resume found.', 404);
    await resume.deleteOne();
  }
}

module.exports = new ResumeService();
