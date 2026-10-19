import mongoose from 'mongoose';

const moduleProgressSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    enrollmentId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    courseSlug: { type: String, required: true, index: true },
    moduleIndex: { type: Number, required: true },
    moduleTitle: { type: String, required: true },
    isRequired: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Needs Revision'],
      default: 'Not Started',
      index: true,
    },
    completedAt: { type: Date },
    assessedBy: { type: String },
    assessmentScore: { type: Number },
    assessmentPassed: { type: Boolean },
    attempts: { type: Number, default: 0 },
    remarks: { type: String },
  },
  { timestamps: true }
);

// Unique module progress record per enrollment and module
moduleProgressSchema.index({ enrollmentId: 1, moduleIndex: 1 }, { unique: true });

export const ModuleProgress = mongoose.model('ModuleProgress', moduleProgressSchema);
