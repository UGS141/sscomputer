import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    courseSlug: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    enrollmentId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    studentName: { type: String, required: true },
    sessionDate: { type: String, required: true }, // YYYY-MM-DD
    status: {
      type: String,
      enum: ['Present', 'Late', 'Absent', 'Excused', 'Not Marked'],
      default: 'Not Marked',
      index: true,
    },
    markedBy: { type: String, default: 'Admin' },
    markedAt: { type: Date, default: Date.now },
    remarks: { type: String },
    correctionHistory: [
      {
        previousStatus: { type: String },
        newStatus: { type: String },
        changedBy: { type: String },
        changedAt: { type: Date, default: Date.now },
        reason: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate attendance records for the same session and enrollment
attendanceSchema.index({ sessionId: 1, enrollmentId: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
