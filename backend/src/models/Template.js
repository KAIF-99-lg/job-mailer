const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, 'Role name is required.'],
      trim: true,
      maxlength: [100, 'Role name cannot exceed 100 characters.'],
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

// Compound index: one template per role per user
templateSchema.index({ roleName: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model('Template', templateSchema);
