import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    courseSlug: { type: String, required: true, index: true },
    courseTitle: { type: String },
    sessionNumber: { type: Number, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:MM
    endTime: { type: String, required: true },   // HH:MM
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled',
      index: true,
    },
    isHoliday: { type: Boolean, default: false },
    cancellationReason: { type: String },
    rescheduledToDate: { type: String },
    attendanceFinalized: { type: Boolean, default: false },
    attendanceFinalizedAt: { type: Date },
    attendanceFinalizedBy: { type: String },
  },
  { timestamps: true }
);

sessionSchema.index({ courseSlug: 1, date: 1, startTime: 1 }, { unique: true });

export const Session = mongoose.model('Session', sessionSchema);
