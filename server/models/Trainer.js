import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    bio: { type: String, required: true },
    specialization: [{ type: String }],
    avatarText: { type: String, required: true },
    gradient: { type: String, default: 'from-[#087F78] to-[#12A77A]' },
  },
  { timestamps: true }
);

export const Trainer = mongoose.model('Trainer', trainerSchema);
