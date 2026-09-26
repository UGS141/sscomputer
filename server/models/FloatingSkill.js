import mongoose from 'mongoose';

const floatingSkillSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, required: true },
    accentColor: { type: String, required: true },
    dotColor: { type: String, required: true },
    badgeBg: { type: String, required: true },
    positionClass: { type: String, required: true },
    mobileVisible: { type: Boolean, default: false },
    duration: { type: String, default: '6.0s' },
    delay: { type: String, default: '0s' },
    depthScale: { type: String, default: 'scale-100' },
  },
  { timestamps: true }
);

export const FloatingSkill = mongoose.model('FloatingSkill', floatingSkillSchema);
