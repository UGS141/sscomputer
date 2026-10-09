import dotenv from 'dotenv';
dotenv.config();

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import mongoose from 'mongoose';
import { Lead } from '../server/models/Lead.js';

async function cleanupQALeads() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas for QA lead cleanup.');

    const deleted = await Lead.deleteMany({ name: { $regex: /UGS QA TEST LEAD TO DELETE/i } });
    console.log(`Cleaned up ${deleted.deletedCount} QA test lead document(s) from MongoDB Atlas.`);

  } catch (err) {
    console.error('Cleanup error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

cleanupQALeads();
