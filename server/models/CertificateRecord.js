import mongoose from 'mongoose';

const certificateRecordSchema = new mongoose.Schema(
  {
    certificateNumber: { type: String, required: true, unique: true, index: true },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    issueDate: { type: String, required: true },
    completionStatus: { type: String, required: true },
    grade: { type: String, required: true },
    verificationCode: { type: String, required: true },
    status: { type: String, enum: ['Valid', 'Revoked'], default: 'Valid', index: true },
  },
  { timestamps: true }
);

export const CertificateRecord = mongoose.model('CertificateRecord', certificateRecordSchema);
