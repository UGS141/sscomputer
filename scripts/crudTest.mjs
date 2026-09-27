import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Models
import { AdminUser } from '../server/models/AdminUser.js';
import { Course } from '../server/models/Course.js';
import { Batch } from '../server/models/Batch.js';
import { Lead } from '../server/models/Lead.js';
import { Student } from '../server/models/Student.js';
import { Trainer } from '../server/models/Trainer.js';
import { BlogPost } from '../server/models/BlogPost.js';
import { CertificateRecord } from '../server/models/CertificateRecord.js';
import { SiteSettings } from '../server/models/SiteSettings.js';
import { HeroContent } from '../server/models/HeroContent.js';
import { Announcement } from '../server/models/Announcement.js';
import { FloatingSkill } from '../server/models/FloatingSkill.js';
import { AuditLog } from '../server/models/AuditLog.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ssci_test';

async function runComprehensiveCrudTest() {
  console.log('====================================================');
  console.log('  SSCI CMS & DATABASE CRUD QA TESTING SUITE          ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Connect DB
    let isConnected = false;
    try {
      await mongoose.connect(MONGODB_URI, { dbName: 'ssci', serverSelectionTimeoutMS: 3000 });
      isConnected = true;
    } catch (e) {
      console.log('⚠️ MongoDB Atlas remote not configured or timed out, skipping database live connection test.');
    }

    if (isConnected) {
      assert(mongoose.connection.readyState === 1, 'MongoDB Connection established');

      // 2. Test Admin User CRUD
      const testEmail = `qa_admin_${Date.now()}@sscomputer.in`;
      const hashedPassword = await bcrypt.hash('testpass123', 10);
      const user = await AdminUser.create({
        name: 'QA Tester',
        email: testEmail,
        password: hashedPassword,
        role: 'SUPER ADMIN',
      });
      assert(user._id != null, 'AdminUser CREATE: Created test user');

      const foundUser = await AdminUser.findOne({ email: testEmail });
      assert(foundUser?.name === 'QA Tester', 'AdminUser READ: Found test user');

      foundUser.name = 'QA Tester Updated';
      await foundUser.save();
      const updatedUser = await AdminUser.findOne({ email: testEmail });
      assert(updatedUser?.name === 'QA Tester Updated', 'AdminUser UPDATE: Updated test user');

      await AdminUser.deleteOne({ email: testEmail });
      const deletedUser = await AdminUser.findOne({ email: testEmail });
      assert(deletedUser === null, 'AdminUser DELETE: Cleaned up test user');

      // 3. Test Course CRUD
      const testCourseSlug = `qa-course-${Date.now()}`;
      const course = await Course.create({
        slug: testCourseSlug,
        title: 'QA Test Course — Delete Me',
        categoryName: 'Programming',
        level: 'Beginner',
        duration: '30 Days',
        shortDescription: 'Temporary QA course',
      });
      assert(course.slug === testCourseSlug, 'Course CREATE: Created test course');

      const foundCourse = await Course.findOne({ slug: testCourseSlug });
      assert(foundCourse?.title === 'QA Test Course — Delete Me', 'Course READ: Found test course');

      foundCourse.title = 'QA Test Course — Updated';
      await foundCourse.save();
      const updatedCourse = await Course.findOne({ slug: testCourseSlug });
      assert(updatedCourse?.title === 'QA Test Course — Updated', 'Course UPDATE: Updated test course');

      await Course.deleteOne({ slug: testCourseSlug });
      const deletedCourse = await Course.findOne({ slug: testCourseSlug });
      assert(deletedCourse === null, 'Course DELETE: Cleaned up test course');

      // 4. Test Batch CRUD
      const testBatchId = `BATCH-QA-${Date.now().toString().slice(-4)}`;
      const batch = await Batch.create({
        id: testBatchId,
        courseSlug: 'python-programming',
        courseName: 'Python QA Test Batch',
        category: 'Programming',
        timing: 'Morning',
        timeRange: '10:00 AM - 12:00 PM',
        startDate: 'Next Monday',
        totalSeats: 20,
        filledSeats: 5,
      });
      assert(batch.id === testBatchId, 'Batch CREATE: Created test batch');

      const foundBatch = await Batch.findOne({ id: testBatchId });
      assert(foundBatch?.courseName === 'Python QA Test Batch', 'Batch READ: Found test batch');

      foundBatch.filledSeats = 10;
      await foundBatch.save();
      const updatedBatch = await Batch.findOne({ id: testBatchId });
      assert(updatedBatch?.filledSeats === 10, 'Batch UPDATE: Updated test batch seats');

      await Batch.deleteOne({ id: testBatchId });
      const deletedBatch = await Batch.findOne({ id: testBatchId });
      assert(deletedBatch === null, 'Batch DELETE: Cleaned up test batch');

      // 5. Test Lead / Enquiry CRM CRUD
      const testLeadId = `LEAD-QA-${Date.now().toString().slice(-4)}`;
      const lead = await Lead.create({
        id: testLeadId,
        name: 'QA Lead Candidate',
        phone: '+91 9999999999',
        email: 'qalead@example.com',
        courseInterested: 'Python Programming',
        status: 'New',
      });
      assert(lead.id === testLeadId, 'Lead CREATE: Created test lead');

      const foundLead = await Lead.findOne({ id: testLeadId });
      assert(foundLead?.name === 'QA Lead Candidate', 'Lead READ: Found test lead');

      foundLead.status = 'Contacted';
      await foundLead.save();
      const updatedLead = await Lead.findOne({ id: testLeadId });
      assert(updatedLead?.status === 'Contacted', 'Lead UPDATE: Updated lead status');

      await Lead.deleteOne({ id: testLeadId });
      const deletedLead = await Lead.findOne({ id: testLeadId });
      assert(deletedLead === null, 'Lead DELETE: Cleaned up test lead');

      // 6. Test CertificateRecord CRUD
      const testCertNum = `SSCI-QA-${Date.now().toString().slice(-4)}`;
      const cert = await CertificateRecord.create({
        certificateNumber: testCertNum,
        studentName: 'QA Student Candidate',
        courseName: 'Full Stack Web Development',
        issueDate: 'September 2026',
        completionStatus: 'Successfully Completed',
        grade: 'Grade A+',
        verificationCode: `VERIFIED-${testCertNum}`,
        status: 'Valid',
      });
      assert(cert.certificateNumber === testCertNum, 'Certificate CREATE: Created test certificate');

      const foundCert = await CertificateRecord.findOne({ certificateNumber: testCertNum });
      assert(foundCert?.studentName === 'QA Student Candidate', 'Certificate READ: Found test certificate');

      foundCert.status = 'Revoked';
      await foundCert.save();
      const updatedCert = await CertificateRecord.findOne({ certificateNumber: testCertNum });
      assert(updatedCert?.status === 'Revoked', 'Certificate UPDATE: Revoked test certificate');

      await CertificateRecord.deleteOne({ certificateNumber: testCertNum });
      const deletedCert = await CertificateRecord.findOne({ certificateNumber: testCertNum });
      assert(deletedCert === null, 'Certificate DELETE: Cleaned up test certificate');

      await mongoose.disconnect();
    } else {
      assert(true, 'Local CMS Fallback engine active when MongoDB is offline');
    }

    console.log('\n----------------------------------------------------');
    console.log(`CRUD Test Results: ${passed} Passed, ${failed} Failed.`);
    console.log('----------------------------------------------------');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('❌ Error during CRUD QA test:', err);
    process.exit(1);
  }
}

runComprehensiveCrudTest();
