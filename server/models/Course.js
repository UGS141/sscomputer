import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    level: { type: String, required: true },
    duration: { type: String, required: true },
    mode: { type: String, default: 'Practical Lab' },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    targetAudience: [{ type: String }],
    learningOutcomes: [{ type: String }],
    skillsLearned: [{ type: String }],
    tools: [{ type: String }],
    modules: [
      {
        title: { type: String, required: true },
        topics: [{ type: String }],
        description: { type: String },
        isRequired: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
        practicalTasks: [{ type: String }],
        hasAssessment: { type: Boolean, default: false },
        passingScore: { type: Number, default: 70 },
      },
    ],
    certificationName: { type: String, required: true },
    projects: [{ type: String }],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Completed', 'Archived'],
      default: 'Active',
      index: true,
    },
    schedule: {
      startDate: { type: String }, // YYYY-MM-DD
      endDate: { type: String },   // YYYY-MM-DD
      weekdays: [{ type: String }], // e.g. ['Monday', 'Wednesday', 'Friday']
      dailyStartTime: { type: String, default: '10:00' }, // HH:MM
      dailyEndTime: { type: String, default: '12:00' },   // HH:MM
      sessionDurationMinutes: { type: Number, default: 120 },
      holidays: [{ type: String }], // array of ISO dates YYYY-MM-DD
      timezone: { type: String, default: 'Asia/Kolkata' },
    },
    minAttendancePercentage: { type: Number, default: 80 },
    courseFee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', courseSchema);
