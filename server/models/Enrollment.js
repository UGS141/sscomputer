import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    studentId: { type: String, required: true, index: true }, // e.g. SSCI-STD-2026-01
    studentName: { type: String, required: true },
    studentPhone: { type: String },
    studentEmail: { type: String },
    courseSlug: { type: String, required: true, index: true },
    courseTitle: { type: String, required: true },
    enrollmentDate: { type: String, default: () => new Date().toISOString() },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Withdrawn', 'Suspended'],
      default: 'Active',
      index: true,
    },
    applicableFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    feeStatus: {
      type: String,
      enum: ['Paid', 'Partial', 'Pending'],
      default: 'Paid',
    },
    attendancePercentage: { type: Number, default: 0 },
    learningProgressPercentage: { type: Number, default: 0 },
    completionEligible: { type: Boolean, default: false },
    completedAt: { type: Date },
    withdrawnAt: { type: Date },
    withdrawalReason: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// Compound unique index prevents enrolling the same student in the same course more than once
enrollmentSchema.index({ studentId: 1, courseSlug: 1 }, { unique: true });

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
