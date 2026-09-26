import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    courseSlug: { type: String, required: true, index: true },
    courseName: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    duration: { type: String, required: true },
    timing: { type: String, enum: ['Morning', 'Afternoon', 'Evening', 'Weekend'], required: true },
    timeRange: { type: String, required: true },
    startDate: { type: String, required: true },
    mode: { type: String, default: 'Practical Lab' },
    totalSeats: { type: Number, default: 20 },
    filledSeats: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Starting Soon', 'Open', 'Few Seats Left', 'Filling Fast'],
      default: 'Starting Soon',
      index: true,
    },
    trainerName: { type: String, required: true },
  },
  { timestamps: true }
);

export const Batch = mongoose.model('Batch', batchSchema);
