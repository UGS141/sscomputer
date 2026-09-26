import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['SUPER ADMIN', 'ADMIN', 'COUNSELLOR', 'CONTENT MANAGER', 'TRAINER', 'VIEWER'],
      default: 'SUPER ADMIN',
    },
    permissions: [{ type: String }],
    avatar: { type: String },
  },
  { timestamps: true }
);

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
