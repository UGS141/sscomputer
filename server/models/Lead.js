import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String },
    courseInterested: { type: String, default: 'General Enquiry' },
    preferredBatch: { type: String, default: 'Any Batch' },
    message: { type: String },
    source: {
      type: String,
      enum: ['Website', 'Course Page', 'Contact Form', 'WhatsApp', 'Phone', 'Manual', 'Instagram'],
      default: 'Website',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Interested', 'Follow-up', 'Converted', 'Not Interested', 'Closed'],
      default: 'New',
      index: true,
    },
    assignedTo: { type: String },
    followUpDate: { type: String },
    notes: [
      {
        id: { type: String },
        text: { type: String },
        author: { type: String },
        timestamp: { type: String },
      },
    ],
    timeline: [
      {
        id: { type: String },
        title: { type: String },
        description: { type: String },
        timestamp: { type: String },
        type: { type: String },
      },
    ],
    emailDelivery: {
      teamNotification: {
        status: {
          type: String,
          enum: ['pending', 'sent', 'failed', 'skipped'],
          default: 'pending',
        },
        recipient: { type: String },
        sentAt: { type: Date },
        error: { type: String },
        messageId: { type: String },
        attempts: { type: Number, default: 0 },
        lastAttemptAt: { type: Date },
        skippedReason: { type: String },
      },
      leadConfirmation: {
        status: {
          type: String,
          enum: ['pending', 'sent', 'failed', 'skipped'],
          default: 'pending',
        },
        recipient: { type: String },
        sentAt: { type: Date },
        error: { type: String },
        messageId: { type: String },
        attempts: { type: Number, default: 0 },
        lastAttemptAt: { type: Date },
        skippedReason: { type: String },
      },
    },
  },
  { timestamps: true }
);

export const Lead = mongoose.model('Lead', leadSchema);
