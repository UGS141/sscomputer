import mongoose from 'mongoose';

const heroContentSchema = new mongoose.Schema(
  {
    badge: { type: String, required: true },
    title: { type: String, required: true },
    highlightText: { type: String, required: true },
    description: { type: String, required: true },
    primaryCtaText: { type: String, required: true },
    secondaryCtaText: { type: String, required: true },
  },
  { timestamps: true }
);

export const HeroContent = mongoose.model('HeroContent', heroContentSchema);
