import dotenv from 'dotenv';
dotenv.config();

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import mongoose from 'mongoose';
import { Lead } from '../server/models/Lead.js';

async function testLead() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected successfully!');
    
    const count = await Lead.countDocuments();
    console.log('Current Lead count in DB:', count);

    const existingLeads = await Lead.find({}, 'id name phone email').sort({ createdAt: -1 }).limit(10);
    console.log('Recent 10 leads in DB:', JSON.stringify(existingLeads, null, 2));

  } catch (err) {
    console.error('ERROR OCCURRED IN LEAD CREATION:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testLead();
