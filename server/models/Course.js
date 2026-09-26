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
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', courseSchema);
