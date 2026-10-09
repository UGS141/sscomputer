import dotenv from 'dotenv';
dotenv.config();

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import mongoose from 'mongoose';
import { Student } from '../server/models/Student.js';

async function testStudentCRUD() {
  try {
    console.log('\n--- 1. CONNECTING TO MONGODB ATLAS ---');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected successfully!');

    console.log('\n--- 2. TESTING CREATE (POST) STUDENT ---');
    const testId = `STD-QA-${Date.now().toString().slice(-4)}`;
    const testStudentId = `SSCI-STD-2026-QA-${Date.now().toString().slice(-4)}`;
    
    const newStudent = await Student.create({
      id: testId,
      studentId: testStudentId,
      name: 'UGS QA TEST STUDENT DELETE ME',
      phone: '+91 9998887770',
      email: 'qastudent@ssci.com',
      course: 'Python Programming',
      batch: 'Morning Batch (10:00 AM – 12:00 PM)',
      admissionDate: 'October 10, 2026',
      status: 'Active',
      grade: 'A+',
      certificatesIssued: [],
    });
    console.log('Created Student Document in DB:', newStudent.studentId);

    console.log('\n--- 3. TESTING READ (GET) STUDENT ---');
    const found = await Student.findOne({ studentId: testStudentId });
    if (!found) throw new Error('Student document not found after creation!');
    console.log('Fetched Student Document:', found.name, 'Status:', found.status);

    console.log('\n--- 4. TESTING UPDATE (PUT) STUDENT ---');
    found.name = 'UGS QA TEST STUDENT EDITED';
    found.status = 'Completed';
    found.grade = 'O Grade (Outstanding)';
    await found.save();

    const updated = await Student.findOne({ studentId: testStudentId });
    console.log('Updated Student Document:', updated.name, 'Status:', updated.status, 'Grade:', updated.grade);

    console.log('\n--- 5. TESTING DELETE (DELETE) STUDENT ---');
    await Student.findOneAndDelete({ studentId: testStudentId });
    const afterDelete = await Student.findOne({ studentId: testStudentId });
    if (afterDelete) throw new Error('Student record still exists after deletion!');
    console.log('SUCCESS! QA Test Student record deleted cleanly from MongoDB Atlas.');

  } catch (err) {
    console.error('TEST FAILED:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testStudentCRUD();
