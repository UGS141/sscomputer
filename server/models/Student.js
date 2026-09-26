import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    course: { type: String, required: true },
    batch: { type: String, required: true },
    admissionDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['Enquiry', 'Registered', 'Active', 'Completed', 'Alumni'],
      default: 'Active',
    },
    grade: { type: String },
    certificatesIssued: [{ type: String }],
  },
  { timestamps: true }
);

export const Student = mongoose.model('Student', studentSchema);
