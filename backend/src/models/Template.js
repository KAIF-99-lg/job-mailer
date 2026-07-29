const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, 'Role name is required.'],
      trim: true,
      maxlength: [100, 'Role name cannot exceed 100 characters.'],
      unique: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required.'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters.'],
    },
    body: {
      type: String,
      required: [true, 'Email body is required.'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Template', templateSchema);
