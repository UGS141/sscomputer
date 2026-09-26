import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    instituteName: { type: String, required: true },
    shortName: { type: String, required: true },
    tagline: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    workingHours: { type: String, required: true },
    googleMapsUrl: { type: String },
    social: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
