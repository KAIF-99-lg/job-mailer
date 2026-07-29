const mongoose = require('mongoose');

const emailHistorySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      required: [true, 'Role is required.'],
      trim: true,
    },
    hrEmail: {
      type: String,
      required: [true, 'HR email is required.'],
      lowercase: true,
      trim: true,
    },
    hrName: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      required: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

emailHistorySchema.index({ sentAt: -1 });
emailHistorySchema.index({ status: 1 });

module.exports = mongoose.model('EmailHistory', emailHistorySchema);
