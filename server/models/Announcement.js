import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    ctaText: { type: String, required: true },
    ctaUrl: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
