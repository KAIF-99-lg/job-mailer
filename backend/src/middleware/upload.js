const multer = require('multer');
const AppError = require('../utils/AppError');

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const fileFilter = async (req, file) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new AppError('Only PDF, DOC, and DOCX files are allowed.', 400);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = upload;
