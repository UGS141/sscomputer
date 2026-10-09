import dotenv from 'dotenv';
dotenv.config();

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import mongoose from 'mongoose';
import { Student } from '../server/models/Student.js';

async function cleanupQAStudent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas for QA cleanup.');

    const deleted = await Student.deleteMany({ name: { $regex: /UGS QA TEST STUDENT/i } });
    console.log(`Cleaned up ${deleted.deletedCount} QA test student document(s) from MongoDB Atlas.`);

  } catch (err) {
    console.error('Cleanup error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

cleanupQAStudent();
