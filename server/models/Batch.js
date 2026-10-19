import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String }, // e.g. "Python Morning Batch"
    courseSlug: { type: String, required: true, index: true },
    courseName: { type: String, required: true },
    category: { type: String, default: 'Computer Essentials' },
    level: { type: String, default: 'Beginner' },
    duration: { type: String, default: '45 Days' },
    timing: { type: String, enum: ['Morning', 'Afternoon', 'Evening', 'Weekend', 'Custom'], default: 'Morning' },
    timeRange: { type: String, default: '10:00 AM - 12:00 PM' },
    startTime: { type: String, default: '10:00' }, // HH:MM
    endTime: { type: String, default: '12:00' },   // HH:MM
    startDate: { type: String, required: true },    // YYYY-MM-DD
    endDate: { type: String },                      // YYYY-MM-DD
    weekdays: [{ type: String }],                   // ['Monday', 'Wednesday', 'Friday']
    sessionDurationMinutes: { type: Number, default: 120 },
    timezone: { type: String, default: 'Asia/Kolkata' },
    room: { type: String, default: 'Lab 1' },
    mode: { type: String, default: 'Practical Lab' },
    totalSeats: { type: Number, default: 20 },
    capacity: { type: Number, default: 20 },
    filledSeats: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Draft', 'Upcoming', 'Active', 'Completed', 'Archived', 'Starting Soon', 'Open', 'Few Seats Left', 'Filling Fast'],
      default: 'Active',
      index: true,
    },
    trainerName: { type: String, default: 'Faculty Trainer' },
    holidays: [{ type: String }],
    notes: { type: String },
  },
  { timestamps: true }
);

export const Batch = mongoose.model('Batch', batchSchema);
