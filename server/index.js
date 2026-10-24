import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { connectDB } from './config/db.js';
import { authenticateToken, authorizeRoles } from './middleware/auth.js';

// Models
import { AdminUser } from './models/AdminUser.js';
import { Course } from './models/Course.js';
import { Batch } from './models/Batch.js';
import { Lead } from './models/Lead.js';
import { Student } from './models/Student.js';
import { Trainer } from './models/Trainer.js';
import { BlogPost } from './models/BlogPost.js';
import { CertificateRecord } from './models/CertificateRecord.js';
import { SiteSettings } from './models/SiteSettings.js';
import { HeroContent } from './models/HeroContent.js';
import { Announcement } from './models/Announcement.js';
import { FloatingSkill } from './models/FloatingSkill.js';
import { AuditLog } from './models/AuditLog.js';
import { Enrollment } from './models/Enrollment.js';
import { Session } from './models/Session.js';
import { Attendance } from './models/Attendance.js';
import { ModuleProgress } from './models/ModuleProgress.js';
import {
  generateCourseSessions,
  generateBatchSessions,
  calculateEnrollmentAttendance,
  calculateEnrollmentProgress,
  evaluateCourseCompletion,
  initializeStudentModuleProgress,
  formatDateStr,
} from './services/academicService.js';
import {
  processLeadNotifications,
  retryLeadNotifications,
  getEmailProviderStatus,
} from './services/emailService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://sscomputerinstitute.com',
  'https://www.sscomputerinstitute.com',
  'https://sscomputer.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (typeof origin === 'string' && origin.endsWith('.vercel.app')) ||
        process.env.NODE_ENV !== 'production'
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Security Cache Control (Prevent browser & proxy caching of protected API responses)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// In-Memory Rate Limiter Middleware (Zero-Dependency, Sliding Window)
const createRateLimiter = ({ windowMs = 60 * 1000, maxHits = 10, message = 'Too many requests. Please try again later.' }) => {
  const requests = new Map();
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    const userRequests = (requests.get(ip) || []).filter((time) => time > windowStart);
    if (userRequests.length >= maxHits) {
      return res.status(429).json({ success: false, message });
    }

    userRequests.push(now);
    requests.set(ip, userRequests);
    next();
  };
};

const loginLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, maxHits: 10, message: 'Too many login attempts. Please try again in 15 minutes.' });
const leadLimiter = createRateLimiter({ windowMs: 60 * 1000, maxHits: 15, message: 'Too many enquiry submissions. Please wait a minute before trying again.' });
const certVerifyLimiter = createRateLimiter({ windowMs: 60 * 1000, maxHits: 20, message: 'Rate limit exceeded for certificate verification. Please wait a minute.' });

// Helper for Logging Audit
const logAudit = async (user, action, moduleName, details) => {
  try {
    await AuditLog.create({
      user,
      action,
      module: moduleName,
      details,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Audit Log Error:', err.message);
  }
};

// ----------------------------------------------------
// HEALTH CHECK ENDPOINT
// ----------------------------------------------------
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const statusCode = dbStatus === 'connected' ? 200 : 503;
  res.status(statusCode).json({
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------------------
// AUTHENTICATION APIs
// ----------------------------------------------------
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      console.error('FATAL: JWT_SECRET environment variable is missing or shorter than 32 characters.');
      return res.status(500).json({ success: false, message: 'Server security configuration error.' });
    }

    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '24h' });

    await logAudit(user.name, 'LOGIN', 'Auth', `Admin user "${user.name}" logged in successfully.`);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ----------------------------------------------------
// COURSES APIs
// ----------------------------------------------------
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching courses.' });
  }
});

app.get('/api/courses/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching course details.' });
  }
});

app.post('/api/courses', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    const courseData = req.body;
    const course = await Course.findOneAndUpdate(
      { slug: courseData.slug },
      courseData,
      { upsert: true, new: true, runValidators: true }
    );
    await logAudit(req.user.name, 'SAVE_COURSE', 'Courses', `Saved course "${course.title}".`);
    res.json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/courses/:slug', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    await Course.findOneAndDelete({ slug: req.params.slug });
    await logAudit(req.user.name, 'DELETE_COURSE', 'Courses', `Deleted course "${req.params.slug}".`);
    res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting course.' });
  }
});

// ----------------------------------------------------
// BATCHES APIs
// ----------------------------------------------------
// ----------------------------------------------------
// BATCHES APIs
// ----------------------------------------------------
app.get('/api/batches', async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseSlug) filter.courseSlug = req.query.courseSlug;
    if (req.query.status) filter.status = req.query.status;

    const batches = await Batch.find(filter).sort({ createdAt: -1 });

    // Enrich batches with live enrollment counts and session counts
    const enrichedBatches = await Promise.all(
      batches.map(async (b) => {
        const [activeCount, totalSessions, completedSessions] = await Promise.all([
          Enrollment.countDocuments({ batchId: b.id, status: 'Active' }),
          Session.countDocuments({ batchId: b.id }),
          Session.countDocuments({ batchId: b.id, status: 'Completed' }),
        ]);

        const batchObj = b.toObject();
        batchObj.enrolledCount = activeCount;
        batchObj.filledSeats = activeCount;
        batchObj.totalSessions = totalSessions;
        batchObj.completedSessions = completedSessions;
        batchObj.upcomingSessions = Math.max(0, totalSessions - completedSessions);
        return batchObj;
      })
    );

    res.json({ success: true, batches: enrichedBatches });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching batches: ' + err.message });
  }
});

app.get('/api/batches/:id', async (req, res) => {
  try {
    const batch = await Batch.findOne({ id: req.params.id });
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    const [course, enrollments, sessions] = await Promise.all([
      Course.findOne({ slug: batch.courseSlug }),
      Enrollment.find({ batchId: batch.id }).sort({ createdAt: -1 }),
      Session.find({ batchId: batch.id }).sort({ date: 1, startTime: 1 }),
    ]);

    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enr) => {
        const enrObj = enr.toObject();
        try {
          const stats = await calculateEnrollmentAttendance(enr.id);
          enrObj.attendancePercentage = stats.attendancePercentage;
          enrObj.sessionsPresent = stats.present;
          enrObj.sessionsLate = stats.late;
          enrObj.sessionsAbsent = stats.absent;
          enrObj.eligibleSessions = stats.eligibleScheduledSessions;
        } catch (_) {}
        return enrObj;
      })
    );

    const batchObj = batch.toObject();
    batchObj.enrolledCount = enrollments.filter((e) => e.status === 'Active').length;
    batchObj.completedSessions = sessions.filter((s) => s.status === 'Completed' || s.attendanceFinalized).length;
    batchObj.totalSessions = sessions.length;

    res.json({
      success: true,
      batch: batchObj,
      course,
      enrollments: enrichedEnrollments,
      sessions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching batch details: ' + err.message });
  }
});

// Get attendance records for a batch
app.get('/api/batches/:id/attendance', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const batch = await Batch.findOne({ id: req.params.id });
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    const filter = { batchId: batch.id };
    if (req.query.sessionId) filter.sessionId = req.query.sessionId;
    if (req.query.date) filter.sessionDate = req.query.date;

    const records = await Attendance.find(filter).sort({ sessionDate: -1, createdAt: -1 });
    res.json({ success: true, attendance: records });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching batch attendance: ' + err.message });
  }
});

app.post('/api/batches', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    const batchData = { ...req.body };
    if (!batchData.id) {
      const count = await Batch.countDocuments();
      batchData.id = `BAT-${(count + 1).toString().padStart(2, '0')}`;
    }

    if (!batchData.courseSlug) {
      return res.status(400).json({ success: false, message: 'courseSlug is required.' });
    }

    const course = await Course.findOne({ slug: batchData.courseSlug });
    if (!course) {
      return res.status(404).json({ success: false, message: `Course "${batchData.courseSlug}" not found.` });
    }

    batchData.courseName = course.title;
    batchData.category = course.categoryName || batchData.category;
    batchData.capacity = Number(batchData.capacity) || Number(batchData.totalSeats) || 20;
    batchData.totalSeats = batchData.capacity;
    batchData.name = batchData.name || `${course.title} - ${batchData.timing || 'Batch'}`;

    const batch = await Batch.findOneAndUpdate(
      { id: batchData.id },
      batchData,
      { upsert: true, new: true, runValidators: true }
    );

    // Auto-generate timetable sessions if requested
    let sessionGenResult = null;
    if (req.body.autoGenerateSessions && batch.startDate) {
      try {
        sessionGenResult = await generateBatchSessions(batch, course);
      } catch (genErr) {
        console.warn('Could not auto-generate sessions for batch:', genErr.message);
      }
    }

    await logAudit(req.user.name, 'SAVE_BATCH', 'Batches', `Saved batch "${batch.name}" (${batch.id}) for course "${course.title}".`);
    res.json({ success: true, batch, sessionGenResult });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.put('/api/batches/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    const batch = await Batch.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    await logAudit(req.user.name, 'UPDATE_BATCH', 'Batches', `Updated batch "${batch.name || batch.id}".`);
    res.json({ success: true, batch });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/batches/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    const batch = await Batch.findOneAndDelete({ id: req.params.id });
    if (batch) {
      await Session.deleteMany({ batchId: batch.id });
      await logAudit(req.user.name, 'DELETE_BATCH', 'Batches', `Deleted batch "${req.params.id}".`);
    }
    res.json({ success: true, message: 'Batch deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting batch.' });
  }
});

// Generate Scheduled Sessions for Batch
app.post('/api/batches/:id/generate-sessions', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const batch = await Batch.findOne({ id: req.params.id });
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    const course = await Course.findOne({ slug: batch.courseSlug });
    const result = await generateBatchSessions(batch, course);
    if (!result.success) {
      return res.status(400).json(result);
    }

    await logAudit(
      req.user.name,
      'GENERATE_BATCH_SESSIONS',
      'Academics',
      `Generated ${result.newCreatedCount} sessions for batch "${batch.name || batch.id}".`
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating batch sessions: ' + err.message });
  }
});

// Add Existing Students directly into Batch
app.post('/api/batches/:id/enroll', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const batch = await Batch.findOne({ id: req.params.id });
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    const course = await Course.findOne({ slug: batch.courseSlug });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Associated course not found.' });
    }

    const { studentIds, applicableFee, discount, feeStatus, notes } = req.body;
    const rawIds = Array.isArray(studentIds) ? studentIds : [];

    if (rawIds.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one student must be selected.' });
    }

    // Capacity Check
    const currentActiveEnrolled = await Enrollment.countDocuments({ batchId: batch.id, status: 'Active' });
    const batchCap = batch.capacity || batch.totalSeats || 20;
    if (currentActiveEnrolled + rawIds.length > batchCap) {
      return res.status(400).json({
        success: false,
        message: `Batch capacity exceeded. Current: ${currentActiveEnrolled}/${batchCap}. Cannot add ${rawIds.length} more students.`,
      });
    }

    const students = await Student.find({
      $or: [{ studentId: { $in: rawIds } }, { id: { $in: rawIds } }],
    });

    const createdEnrollments = [];
    const skippedStudents = [];

    const feeAmount = typeof applicableFee === 'number' ? applicableFee : (course.price || 0);
    const discountAmount = typeof discount === 'number' ? discount : 0;
    const finalFee = Math.max(0, feeAmount - discountAmount);

    for (const student of students) {
      // 1. Check if already enrolled in this exact batch
      const alreadyInBatch = await Enrollment.findOne({
        studentId: student.studentId,
        batchId: batch.id,
        status: { $ne: 'Withdrawn' },
      });

      if (alreadyInBatch) {
        skippedStudents.push({
          studentId: student.studentId,
          name: student.name,
          reason: `Already enrolled in batch "${batch.name || batch.id}"`,
        });
        continue;
      }

      // 2. Check if actively enrolled in another batch of the same course
      const inAnotherBatch = await Enrollment.findOne({
        studentId: student.studentId,
        courseSlug: batch.courseSlug,
        batchId: { $ne: batch.id },
        status: 'Active',
      });

      if (inAnotherBatch) {
        skippedStudents.push({
          studentId: student.studentId,
          name: student.name,
          reason: `Already actively enrolled in another batch ("${inAnotherBatch.batchName || inAnotherBatch.batchId}"). Please use Transfer Workflow.`,
        });
        continue;
      }

      const enrollmentId = `ENR-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
      const enrollment = await Enrollment.create({
        id: enrollmentId,
        studentId: student.studentId,
        studentName: student.name,
        studentPhone: student.phone,
        studentEmail: student.email,
        courseSlug: course.slug,
        courseTitle: course.title,
        batchId: batch.id,
        batchName: batch.name || batch.id,
        applicableFee: finalFee,
        discount: discountAmount,
        feeStatus: feeStatus || 'Paid',
        notes: notes || '',
        status: 'Active',
      });

      await initializeStudentModuleProgress(enrollment, course);
      createdEnrollments.push(enrollment);

      await logAudit(
        req.user.name,
        'ENROLL_BATCH_STUDENT',
        'Academics',
        `Enrolled student "${student.name}" (${student.studentId}) in batch "${batch.name || batch.id}" of course "${course.title}".`
      );
    }

    // Update filled seats counter on batch
    batch.filledSeats = await Enrollment.countDocuments({ batchId: batch.id, status: 'Active' });
    await batch.save();

    res.json({
      success: true,
      message: `Enrolled ${createdEnrollments.length} student(s) into batch "${batch.name || batch.id}". ${skippedStudents.length} student(s) skipped.`,
      enrolledCount: createdEnrollments.length,
      skippedCount: skippedStudents.length,
      enrollments: createdEnrollments,
      skipped: skippedStudents,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error enrolling students into batch: ' + err.message });
  }
});

// ----------------------------------------------------
// LEADS & CRM APIs
// ----------------------------------------------------
app.get('/api/leads', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching leads.' });
  }
});

app.post('/api/leads', leadLimiter, async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
      return res.status(400).json({ success: false, message: 'A valid name (2 to 100 characters) is required.' });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 8 || phone.length > 20) {
      return res.status(400).json({ success: false, message: 'A valid phone number (8 to 20 digits) is required.' });
    }

    const latestLead = await Lead.findOne().sort({ createdAt: -1 });
    let nextNumber = 1001;
    if (latestLead && latestLead.id && latestLead.id.startsWith('LEAD-')) {
      const parsed = parseInt(latestLead.id.replace('LEAD-', ''), 10);
      if (!isNaN(parsed)) {
        nextNumber = parsed + 1;
      }
    }
    const count = await Lead.countDocuments();
    if (nextNumber <= 1000 + count) {
      nextNumber = 1001 + count;
    }
    const leadId = `LEAD-${nextNumber}`;
    const newLead = await Lead.create({
      id: leadId,
      ...req.body,
      status: 'New',
      timeline: [
        {
          id: `t-${Date.now()}`,
          title: 'Enquiry Received',
          description: `Received via ${req.body.source || 'Website'}.`,
          timestamp: new Date().toISOString(),
          type: 'system',
        },
      ],
    });

    await logAudit('Visitor', 'NEW_ENQUIRY', 'CRM', `New enquiry from ${newLead.name} (${newLead.phone}).`);

    // 1. Instantly respond to visitor (< 50ms) so website enquiry form submission is instantaneous!
    res.json({
      success: true,
      lead: newLead,
      message: 'Thank you for your enquiry! We will contact you shortly.',
    });

    // 2. Trigger transactional email notifications (Internal Team Alert + Lead Confirmation)
    // Runs asynchronously in background after lead is saved in DB. Provider errors are caught and recorded.
    (async () => {
      try {
        const emailResults = await processLeadNotifications(newLead);
        const timelineUpdates = [];

        if (emailResults.teamNotification) {
          if (emailResults.teamNotification.status === 'sent') {
            timelineUpdates.push({
              id: `t-${Date.now()}-tn-sent`,
              title: 'Team Notification Sent',
              description: `Notification email sent to consultancy team (${emailResults.teamNotification.recipient}).`,
              timestamp: new Date().toISOString(),
              type: 'system',
            });
          } else if (emailResults.teamNotification.status === 'failed') {
            timelineUpdates.push({
              id: `t-${Date.now()}-tn-err`,
              title: 'Team Notification Failed',
              description: `Email delivery failed: ${emailResults.teamNotification.error || 'Provider failure'}`,
              timestamp: new Date().toISOString(),
              type: 'system',
            });
          }
        }

        if (emailResults.leadConfirmation) {
          if (emailResults.leadConfirmation.status === 'sent') {
            timelineUpdates.push({
              id: `t-${Date.now()}-lc-sent`,
              title: 'Lead Confirmation Sent',
              description: `Confirmation email dispatched to candidate (${emailResults.leadConfirmation.recipient}).`,
              timestamp: new Date().toISOString(),
              type: 'system',
            });
          } else if (emailResults.leadConfirmation.status === 'failed') {
            timelineUpdates.push({
              id: `t-${Date.now()}-lc-err`,
              title: 'Lead Confirmation Failed',
              description: `Confirmation email failed: ${emailResults.leadConfirmation.error || 'Provider failure'}`,
              timestamp: new Date().toISOString(),
              type: 'system',
            });
          }
        }

        const updateFields = { emailDelivery: emailResults };
        const mongoUpdate = { $set: updateFields };
        if (timelineUpdates.length > 0) {
          mongoUpdate.$push = { timeline: { $each: timelineUpdates, $position: 0 } };
        }
        await Lead.findByIdAndUpdate(newLead._id, mongoUpdate);
      } catch (emailErr) {
        console.error('[LeadEmailNotification] Background error processing notifications:', emailErr);
      }
    })();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Retry Email Notifications for an Existing Lead (Idempotent: skips already sent emails)
app.post('/api/leads/:id/retry-email', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const lead = await Lead.findOne({ id: req.params.id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead enquiry record not found.' });
    }

    const emailResults = await retryLeadNotifications(lead);
    const timelineUpdates = [];

    if (emailResults.teamNotification?.status === 'sent' && lead.emailDelivery?.teamNotification?.status !== 'sent') {
      timelineUpdates.push({
        id: `t-${Date.now()}-tn-retry`,
        title: 'Team Notification Sent (Retry)',
        description: `Notification dispatched to ${emailResults.teamNotification.recipient}.`,
        timestamp: new Date().toISOString(),
        type: 'system',
      });
    }

    if (emailResults.leadConfirmation?.status === 'sent' && lead.emailDelivery?.leadConfirmation?.status !== 'sent') {
      timelineUpdates.push({
        id: `t-${Date.now()}-lc-retry`,
        title: 'Lead Confirmation Sent (Retry)',
        description: `Confirmation email dispatched to ${emailResults.leadConfirmation.recipient}.`,
        timestamp: new Date().toISOString(),
        type: 'system',
      });
    }

    lead.emailDelivery = emailResults;
    if (timelineUpdates.length > 0) {
      lead.timeline.unshift(...timelineUpdates);
    }
    await lead.save();

    await logAudit(req.user.name, 'RETRY_LEAD_EMAIL', 'CRM', `Retried email notifications for lead "${lead.id}".`);

    res.json({
      success: true,
      lead,
      emailDelivery: lead.emailDelivery,
      message: 'Email notification retry processed.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Check Email Provider Configuration Status
app.get('/api/email/status', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), (req, res) => {
  const status = getEmailProviderStatus();
  res.json({ success: true, status });
});

app.put('/api/leads/:id/status', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const { status, noteText } = req.body;
    const lead = await Lead.findOne({ id: req.params.id });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });

    lead.status = status;
    lead.timeline.unshift({
      id: `t-${Date.now()}`,
      title: 'Status Change',
      description: `Status changed to ${status}${noteText ? `: ${noteText}` : ''}`,
      timestamp: new Date().toISOString(),
      type: 'status_change',
    });
    if (noteText) {
      lead.notes.unshift({
        id: `n-${Date.now()}`,
        text: noteText,
        author: req.user.name,
        timestamp: new Date().toISOString(),
      });
    }

    await lead.save();
    await logAudit(req.user.name, 'UPDATE_LEAD', 'CRM', `Lead "${lead.id}" updated to ${status}.`);
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating lead status.' });
  }
});

app.delete('/api/leads/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ id: req.params.id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead enquiry record not found.' });
    }
    await logAudit(req.user.name, 'DELETE_LEAD', 'CRM', `Deleted lead enquiry "${lead.id}" (${lead.name}).`);
    res.json({ success: true, message: 'Lead enquiry record deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting lead enquiry.' });
  }
});

// ----------------------------------------------------
// CERTIFICATE VERIFICATION APIs
// ----------------------------------------------------
app.get('/api/certificates/verify/:certNumber', certVerifyLimiter, async (req, res) => {
  try {
    const cert = await CertificateRecord.findOne({ certificateNumber: req.params.certNumber.trim().toUpperCase() });
    if (!cert) {
      return res.json({
        valid: false,
        errorMessage: `No record found for Certificate No: "${req.params.certNumber}". Please verify the number on your official certificate or contact SSCI administration.`,
      });
    }
    res.json({
      valid: cert.status === 'Valid',
      certificateNumber: cert.certificateNumber,
      studentName: cert.studentName,
      courseName: cert.courseName,
      issueDate: cert.issueDate,
      completionStatus: cert.completionStatus,
      grade: cert.grade,
      verificationCode: cert.verificationCode,
    });
  } catch (err) {
    res.status(500).json({ valid: false, errorMessage: 'Verification server error.' });
  }
});

app.get('/api/certificates', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const certificates = await CertificateRecord.find().sort({ createdAt: -1 });
    res.json({ success: true, certificates });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching certificates.' });
  }
});

app.post('/api/certificates', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const cert = await CertificateRecord.create(req.body);
    await logAudit(req.user.name, 'ISSUE_CERTIFICATE', 'Certificates', `Issued certificate "${cert.certificateNumber}" to ${cert.studentName}.`);
    res.json({ success: true, certificate: cert });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// WEBSITE CMS APIs
// ----------------------------------------------------
app.get('/api/website/hero', async (req, res) => {
  try {
    const hero = await HeroContent.findOne().sort({ createdAt: -1 });
    res.json({ success: true, hero });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching hero content.' });
  }
});

app.put('/api/website/hero', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    const hero = await HeroContent.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    await logAudit(req.user.name, 'UPDATE_HERO', 'Website', 'Updated homepage hero text and CTAs.');
    res.json({ success: true, hero });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating hero content.' });
  }
});

app.get('/api/website/settings', async (req, res) => {
  try {
    const settings = await SiteSettings.findOne().sort({ createdAt: -1 });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching site settings.' });
  }
});

app.put('/api/website/settings', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    await logAudit(req.user.name, 'UPDATE_SETTINGS', 'Website', 'Updated site NAP and contact settings.');
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating site settings.' });
  }
});

// ----------------------------------------------------
// BLOG APIs
// ----------------------------------------------------
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching blog posts.' });
  }
});

app.post('/api/blog', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    const postData = req.body;
    const post = await BlogPost.findOneAndUpdate(
      { slug: postData.slug },
      postData,
      { upsert: true, new: true, runValidators: true }
    );
    await logAudit(req.user.name, 'SAVE_BLOG', 'Blog', `Saved blog post "${post.title}".`);
    res.json({ success: true, post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/blog/:slug', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    await BlogPost.findOneAndDelete({ slug: req.params.slug });
    await logAudit(req.user.name, 'DELETE_BLOG', 'Blog', `Deleted blog post "${req.params.slug}".`);
    res.json({ success: true, message: 'Blog post deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting blog post.' });
  }
});

// ----------------------------------------------------
// TRAINERS APIs
// ----------------------------------------------------
app.get('/api/trainers', async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json({ success: true, trainers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching trainers.' });
  }
});

app.post('/api/trainers', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    const trainerData = req.body;
    const trainer = await Trainer.findOneAndUpdate(
      { id: trainerData.id },
      trainerData,
      { upsert: true, new: true, runValidators: true }
    );
    await logAudit(req.user.name, 'SAVE_TRAINER', 'Trainers', `Saved trainer "${trainer.name}".`);
    res.json({ success: true, trainer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/trainers/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    await Trainer.findOneAndDelete({ id: req.params.id });
    await logAudit(req.user.name, 'DELETE_TRAINER', 'Trainers', `Deleted trainer "${req.params.id}".`);
    res.json({ success: true, message: 'Trainer deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting trainer.' });
  }
});

// ----------------------------------------------------
// STUDENTS APIs
// ----------------------------------------------------
app.get('/api/students', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    const allEnrollments = await Enrollment.find({ status: { $ne: 'Withdrawn' } });

    const enrollmentMap = {};
    for (const enr of allEnrollments) {
      if (!enrollmentMap[enr.studentId]) {
        enrollmentMap[enr.studentId] = [];
      }
      enrollmentMap[enr.studentId].push(enr);
    }

    const enrichedStudents = students.map((std) => {
      const stdObj = std.toObject();
      const stdEnrollments = enrollmentMap[std.studentId] || [];
      stdObj.enrollments = stdEnrollments;
      stdObj.activeCoursesCount = stdEnrollments.length;
      stdObj.enrolledCourses = stdEnrollments.map((e) => ({
        id: e.id,
        courseSlug: e.courseSlug,
        courseTitle: e.courseTitle,
        batchId: e.batchId,
        batchName: e.batchName,
        status: e.status,
        attendancePercentage: e.attendancePercentage || 0,
        learningProgressPercentage: e.learningProgressPercentage || 0,
      }));

      // Calculate average attendance & learning progress across their active enrollments
      if (stdEnrollments.length > 0) {
        const sumAtt = stdEnrollments.reduce((sum, e) => sum + (e.attendancePercentage || 0), 0);
        const sumProg = stdEnrollments.reduce((sum, e) => sum + (e.learningProgressPercentage || 0), 0);
        stdObj.averageAttendancePercentage = Math.round(sumAtt / stdEnrollments.length);
        stdObj.averageLearningProgressPercentage = Math.round(sumProg / stdEnrollments.length);
      } else {
        stdObj.averageAttendancePercentage = 0;
        stdObj.averageLearningProgressPercentage = 0;
      }

      return stdObj;
    });

    res.json({ success: true, students: enrichedStudents });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching students: ' + err.message });
  }
});

app.get('/api/students/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const student = await Student.findOne({
      $or: [{ id: req.params.id }, { studentId: req.params.id }]
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    const [enrollments, certificates] = await Promise.all([
      Enrollment.find({ studentId: student.studentId }).sort({ createdAt: -1 }),
      CertificateRecord.find({ studentName: student.name }).sort({ createdAt: -1 }),
    ]);

    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enr) => {
        const enrObj = enr.toObject();
        try {
          const stats = await calculateEnrollmentAttendance(enr.id);
          enrObj.attendancePercentage = stats.attendancePercentage;
          enrObj.sessionsPresent = stats.present;
          enrObj.sessionsLate = stats.late;
          enrObj.sessionsAbsent = stats.absent;
          enrObj.eligibleSessions = stats.eligibleScheduledSessions;
        } catch (_) {}
        return enrObj;
      })
    );

    res.json({
      success: true,
      student,
      enrollments: enrichedEnrollments,
      certificates,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching student details: ' + err.message });
  }
});

app.post('/api/students', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const studentData = req.body;
    if (!studentData.name || typeof studentData.name !== 'string' || studentData.name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'A valid student name is required.' });
    }
    if (!studentData.phone || typeof studentData.phone !== 'string' || studentData.phone.trim().length < 8) {
      return res.status(400).json({ success: false, message: 'A valid phone number is required.' });
    }
    if (!studentData.course || typeof studentData.course !== 'string') {
      return res.status(400).json({ success: false, message: 'Course selection is required.' });
    }

    if (!studentData.studentId) {
      const count = await Student.countDocuments();
      studentData.studentId = `SSCI-STD-2026-${(count + 1).toString().padStart(2, '0')}`;
    }
    if (!studentData.id) {
      studentData.id = `STD-${Date.now().toString().slice(-4)}`;
    }

    const student = await Student.findOneAndUpdate(
      { $or: [{ studentId: studentData.studentId }, { id: studentData.id }] },
      studentData,
      { upsert: true, new: true, runValidators: true }
    );
    await logAudit(req.user.name, 'SAVE_STUDENT', 'Students', `Saved student "${student.name}" (${student.studentId}).`);
    res.json({ success: true, student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.put('/api/students/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'email', 'course', 'batch', 'admissionDate', 'status', 'grade', 'certificatesIssued'];
    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (updates.name && (typeof updates.name !== 'string' || updates.name.trim().length < 2)) {
      return res.status(400).json({ success: false, message: 'Student name must be at least 2 characters.' });
    }

    const student = await Student.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { studentId: req.params.id }] },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }
    await logAudit(req.user.name, 'UPDATE_STUDENT', 'Students', `Updated student record for "${student.name}" (${student.studentId}).`);
    res.json({ success: true, student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/students/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      $or: [{ id: req.params.id }, { studentId: req.params.id }]
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }
    await logAudit(req.user.name, 'DELETE_STUDENT', 'Students', `Deleted student record for "${student.name}" (${student.studentId}).`);
    res.json({ success: true, message: 'Student record deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting student record.' });
  }
});

// ----------------------------------------------------
// ENROLLMENT & ACADEMIC MANAGEMENT APIs
// ----------------------------------------------------

// List enrollments (filter by courseSlug, studentId, status)
app.get('/api/enrollments', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseSlug) filter.courseSlug = req.query.courseSlug;
    if (req.query.studentId) filter.studentId = req.query.studentId;
    if (req.query.status) filter.status = req.query.status;

    const enrollments = await Enrollment.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching enrollments: ' + err.message });
  }
});

// Single enrollment details with student, course, and module progress
app.get('/api/enrollments/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ id: req.params.id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found.' });
    }

    const [student, course, moduleProgress] = await Promise.all([
      Student.findOne({ studentId: enrollment.studentId }),
      Course.findOne({ slug: enrollment.courseSlug }),
      ModuleProgress.find({ enrollmentId: enrollment.id }).sort({ moduleIndex: 1 }),
    ]);

    res.json({
      success: true,
      enrollment,
      student,
      course,
      moduleProgress,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching enrollment details: ' + err.message });
  }
});

// Create Enrollment (Single or Bulk Students)
app.post('/api/enrollments', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const { courseSlug, studentIds, studentId, applicableFee, discount, feeStatus, notes } = req.body;

    if (!courseSlug) {
      return res.status(400).json({ success: false, message: 'courseSlug is required.' });
    }

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return res.status(404).json({ success: false, message: `Course "${courseSlug}" not found.` });
    }

    // Support single studentId or array of studentIds
    const rawIds = Array.isArray(studentIds) ? studentIds : (studentId ? [studentId] : []);
    if (rawIds.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one student must be selected for enrollment.' });
    }

    const students = await Student.find({
      $or: [{ studentId: { $in: rawIds } }, { id: { $in: rawIds } }],
    });

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'No matching student records found for the provided IDs.' });
    }

    const existingEnrollments = await Enrollment.find({
      courseSlug,
      studentId: { $in: students.map((s) => s.studentId) },
    });
    const alreadyEnrolledIds = new Set(existingEnrollments.map((e) => e.studentId));

    const createdEnrollments = [];
    const skippedStudents = [];

    const feeAmount = typeof applicableFee === 'number' ? applicableFee : (course.price || 0);
    const discountAmount = typeof discount === 'number' ? discount : 0;
    const finalFee = Math.max(0, feeAmount - discountAmount);

    for (const student of students) {
      if (alreadyEnrolledIds.has(student.studentId)) {
        skippedStudents.push({
          studentId: student.studentId,
          name: student.name,
          reason: 'Already enrolled in this course',
        });
        continue;
      }

      const enrollmentId = `ENR-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
      const enrollment = await Enrollment.create({
        id: enrollmentId,
        studentId: student.studentId,
        studentName: student.name,
        studentPhone: student.phone,
        studentEmail: student.email,
        courseSlug: course.slug,
        courseTitle: course.title,
        applicableFee: finalFee,
        discount: discountAmount,
        feeStatus: feeStatus || 'Paid',
        notes: notes || '',
        status: 'Active',
      });

      // Initialize module progress records for this enrollment
      await initializeStudentModuleProgress(enrollment, course);

      createdEnrollments.push(enrollment);

      await logAudit(
        req.user.name,
        'ENROLL_STUDENT',
        'Academics',
        `Enrolled student "${student.name}" (${student.studentId}) in course "${course.title}".`
      );
    }

    res.json({
      success: true,
      message: `Enrolled ${createdEnrollments.length} student(s). ${skippedStudents.length} student(s) were skipped (already enrolled).`,
      enrolledCount: createdEnrollments.length,
      skippedCount: skippedStudents.length,
      enrollments: createdEnrollments,
      skipped: skippedStudents,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error enrolling students: ' + err.message });
  }
});

// Update Enrollment Status (Active, Completed, Withdrawn, Suspended)
app.put('/api/enrollments/:id/status', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const { status, reason, notes } = req.body;
    const allowed = ['Active', 'Completed', 'Withdrawn', 'Suspended'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }

    const enrollment = await Enrollment.findOne({ id: req.params.id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found.' });
    }

    const prevStatus = enrollment.status;
    enrollment.status = status;
    if (notes) enrollment.notes = notes;

    if (status === 'Withdrawn') {
      enrollment.withdrawnAt = new Date();
      enrollment.withdrawalReason = reason || 'Administrative withdrawal';
    } else if (status === 'Completed') {
      enrollment.completedAt = new Date();
    } else if (status === 'Active') {
      enrollment.withdrawnAt = undefined;
      enrollment.withdrawalReason = undefined;
    }

    await enrollment.save();

    await logAudit(
      req.user.name,
      'UPDATE_ENROLLMENT_STATUS',
      'Academics',
      `Changed enrollment status for ${enrollment.studentName} in "${enrollment.courseTitle}" from ${prevStatus} to ${status}.`
    );

    res.json({ success: true, enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating enrollment status: ' + err.message });
  }
});

// Transfer Student Enrollment to another Batch
app.post('/api/enrollments/:id/transfer', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const { toBatchId, reason, effectiveDate } = req.body;
    if (!toBatchId) {
      return res.status(400).json({ success: false, message: 'Target batch (toBatchId) is required.' });
    }

    const enrollment = await Enrollment.findOne({ id: req.params.id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found.' });
    }

    if (enrollment.status === 'Withdrawn') {
      return res.status(400).json({ success: false, message: 'Cannot transfer a withdrawn enrollment.' });
    }

    if (enrollment.batchId === toBatchId) {
      return res.status(400).json({ success: false, message: 'Student is already enrolled in this batch.' });
    }

    const targetBatch = await Batch.findOne({ id: toBatchId });
    if (!targetBatch) {
      return res.status(404).json({ success: false, message: 'Target batch not found.' });
    }

    // Verify target batch belongs to the same course
    if (targetBatch.courseSlug !== enrollment.courseSlug) {
      return res.status(400).json({
        success: false,
        message: `Target batch belongs to course "${targetBatch.courseName || targetBatch.courseSlug}", but enrollment is for "${enrollment.courseTitle}". Transfers must be between batches of the same course.`,
      });
    }

    // Check capacity of target batch
    const currentActiveEnrolled = await Enrollment.countDocuments({ batchId: targetBatch.id, status: 'Active' });
    const targetCap = targetBatch.capacity || targetBatch.totalSeats || 20;
    if (currentActiveEnrolled >= targetCap) {
      return res.status(400).json({
        success: false,
        message: `Target batch "${targetBatch.name || targetBatch.id}" is at full capacity (${currentActiveEnrolled}/${targetCap}). Transfer cannot be completed.`,
      });
    }

    const oldBatchId = enrollment.batchId;
    const oldBatchName = enrollment.batchName || 'Unassigned';

    // Record transfer in history
    if (!enrollment.transferHistory) {
      enrollment.transferHistory = [];
    }
    enrollment.transferHistory.push({
      fromBatchId: oldBatchId || 'Unassigned',
      fromBatchName: oldBatchName,
      toBatchId: targetBatch.id,
      toBatchName: targetBatch.name || targetBatch.id,
      transferredAt: new Date(),
      effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
      reason: reason || 'Administrative transfer',
      transferredBy: req.user.name,
    });

    // Update enrollment batch reference
    enrollment.batchId = targetBatch.id;
    enrollment.batchName = targetBatch.name || targetBatch.id;
    await enrollment.save();

    // Update filled seats on old batch and target batch
    if (oldBatchId) {
      const oldBatch = await Batch.findOne({ id: oldBatchId });
      if (oldBatch) {
        oldBatch.filledSeats = await Enrollment.countDocuments({ batchId: oldBatch.id, status: 'Active' });
        await oldBatch.save();
      }
    }
    targetBatch.filledSeats = await Enrollment.countDocuments({ batchId: targetBatch.id, status: 'Active' });
    await targetBatch.save();

    // Recalculate attendance stats for this enrollment
    try {
      await calculateEnrollmentAttendance(enrollment.id);
    } catch (attErr) {
      console.warn('Attendance recalculation warning on transfer:', attErr.message);
    }

    await logAudit(
      req.user.name,
      'TRANSFER_STUDENT_BATCH',
      'Academics',
      `Transferred student "${enrollment.studentName}" from batch "${oldBatchName}" to batch "${targetBatch.name || targetBatch.id}" in course "${enrollment.courseTitle}".`
    );

    res.json({
      success: true,
      message: `Successfully transferred ${enrollment.studentName} to batch "${targetBatch.name || targetBatch.id}".`,
      enrollment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error processing batch transfer: ' + err.message });
  }
});

// Delete Enrollment
app.delete('/api/enrollments/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ id: req.params.id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found.' });
    }

    // Clean up dependent records
    await ModuleProgress.deleteMany({ enrollmentId: enrollment.id });
    await Attendance.deleteMany({ enrollmentId: enrollment.id });
    await Enrollment.findOneAndDelete({ id: enrollment.id });

    await logAudit(
      req.user.name,
      'DELETE_ENROLLMENT',
      'Academics',
      `Deleted enrollment for ${enrollment.studentName} from "${enrollment.courseTitle}".`
    );

    res.json({ success: true, message: 'Enrollment and associated academic records deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting enrollment: ' + err.message });
  }
});

// ----------------------------------------------------
// SESSIONS & TIMETABLE APIs
// ----------------------------------------------------

// List sessions for a course
app.get('/api/courses/:slug/sessions', async (req, res) => {
  try {
    const sessions = await Session.find({ courseSlug: req.params.slug }).sort({ date: 1, startTime: 1 });
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching course sessions: ' + err.message });
  }
});

// Generate scheduled sessions from course schedule
app.post('/api/courses/:slug/generate-sessions', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ success: false, message: `Course "${req.params.slug}" not found.` });
    }

    const result = await generateCourseSessions(course);
    if (!result.success) {
      return res.status(400).json(result);
    }

    await logAudit(
      req.user.name,
      'GENERATE_SESSIONS',
      'Academics',
      `Generated ${result.newCreatedCount} sessions (${result.preservedCount} preserved) for course "${course.title}".`
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating sessions: ' + err.message });
  }
});

// Create single ad-hoc session
app.post('/api/courses/:slug/sessions', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ success: false, message: `Course "${req.params.slug}" not found.` });
    }

    const { title, date, startTime, endTime } = req.body;
    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'title, date, startTime, and endTime are required.' });
    }

    const count = await Session.countDocuments({ courseSlug: course.slug });
    const session = await Session.create({
      id: `SES-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      courseSlug: course.slug,
      courseTitle: course.title,
      sessionNumber: count + 1,
      title,
      date,
      startTime,
      endTime,
      status: req.body.status || 'Scheduled',
      isHoliday: Boolean(req.body.isHoliday),
    });

    await logAudit(
      req.user.name,
      'CREATE_SESSION',
      'Academics',
      `Added session #${session.sessionNumber} "${session.title}" (${date}) for course "${course.title}".`
    );

    res.json({ success: true, session });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error creating session: ' + err.message });
  }
});

// Update session
app.put('/api/sessions/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const allowed = ['title', 'date', 'startTime', 'endTime', 'status', 'isHoliday', 'cancellationReason', 'rescheduledToDate'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const session = await Session.findOneAndUpdate({ id: req.params.id }, { $set: updates }, { new: true });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    await logAudit(
      req.user.name,
      'UPDATE_SESSION',
      'Academics',
      `Updated session #${session.sessionNumber} (${session.date}) in course "${session.courseSlug}".`
    );

    res.json({ success: true, session });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error updating session: ' + err.message });
  }
});

// Delete session
app.delete('/api/sessions/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const session = await Session.findOne({ id: req.params.id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    await Attendance.deleteMany({ sessionId: session.id });
    await Session.findOneAndDelete({ id: session.id });

    await logAudit(
      req.user.name,
      'DELETE_SESSION',
      'Academics',
      `Deleted session #${session.sessionNumber} (${session.date}) from "${session.courseSlug}".`
    );

    res.json({ success: true, message: 'Session deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting session: ' + err.message });
  }
});

// ----------------------------------------------------
// ATTENDANCE APIs
// ----------------------------------------------------

// Get attendance records for a course (or specific session/enrollment)
app.get('/api/courses/:slug/attendance', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const filter = { courseSlug: req.params.slug };
    if (req.query.sessionId) filter.sessionId = req.query.sessionId;
    if (req.query.enrollmentId) filter.enrollmentId = req.query.enrollmentId;
    if (req.query.date) filter.sessionDate = req.query.date;

    const records = await Attendance.find(filter).sort({ sessionDate: -1, createdAt: -1 });
    res.json({ success: true, attendance: records });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching attendance records: ' + err.message });
  }
});

// Bulk mark attendance for a session
app.post('/api/courses/:slug/attendance', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const { sessionId, attendanceList } = req.body;
    if (!sessionId || !Array.isArray(attendanceList)) {
      return res.status(400).json({ success: false, message: 'sessionId and attendanceList array are required.' });
    }

    const session = await Session.findOne({ id: sessionId, courseSlug: req.params.slug });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found for this course.' });
    }

    const affectedEnrollmentIds = new Set();
    const updatedRecords = [];

    for (const item of attendanceList) {
      const { enrollmentId, status, remarks } = item;
      if (!enrollmentId || !status) continue;

      const allowedStatuses = ['Present', 'Late', 'Absent', 'Excused', 'Not Marked'];
      if (!allowedStatuses.includes(status)) continue;

      const enrollment = await Enrollment.findOne({ id: enrollmentId });
      if (!enrollment) continue;

      affectedEnrollmentIds.add(enrollmentId);

      let record = await Attendance.findOne({ sessionId: session.id, enrollmentId });
      if (record) {
        if (record.status !== status) {
          record.correctionHistory.push({
            previousStatus: record.status,
            newStatus: status,
            changedBy: req.user.name,
            changedAt: new Date(),
            reason: remarks || 'Status updated in attendance register',
          });
        }
        record.status = status;
        record.remarks = remarks || record.remarks;
        record.markedBy = req.user.name;
        record.markedAt = new Date();
        await record.save();
        updatedRecords.push(record);
      } else {
        record = await Attendance.create({
          id: `ATT-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
          courseSlug: req.params.slug,
          sessionId: session.id,
          enrollmentId,
          studentId: enrollment.studentId,
          studentName: enrollment.studentName,
          sessionDate: session.date,
          status,
          markedBy: req.user.name,
          remarks: remarks || '',
        });
        updatedRecords.push(record);
      }
    }

    // Finalize session attendance and conduct status
    session.attendanceFinalized = true;
    session.attendanceFinalizedAt = new Date();
    session.attendanceFinalizedBy = req.user.name;
    if (session.status === 'Scheduled') {
      session.status = 'Completed';
    }
    await session.save();

    // Recalculate attendance % for all affected enrollments using the exact formula
    for (const eid of affectedEnrollmentIds) {
      await calculateEnrollmentAttendance(eid);
    }

    await logAudit(
      req.user.name,
      'MARK_ATTENDANCE',
      'Academics',
      `Marked attendance for session #${session.sessionNumber} (${session.date}) in course "${req.params.slug}" (${updatedRecords.length} records).`
    );

    res.json({
      success: true,
      message: `Attendance marked for ${updatedRecords.length} student(s).`,
      session,
      updatedRecordsCount: updatedRecords.length,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error marking attendance: ' + err.message });
  }
});

// Course attendance summary with student metrics
app.get('/api/courses/:slug/attendance/summary', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const [enrollments, sessions] = await Promise.all([
      Enrollment.find({ courseSlug: course.slug, status: { $ne: 'Withdrawn' } }),
      Session.find({ courseSlug: course.slug, isHoliday: { $ne: true } }),
    ]);

    const scheduledSessions = sessions.filter((s) => s.status !== 'Cancelled');
    const conductedSessions = scheduledSessions.filter((s) => s.attendanceFinalized || s.status === 'Completed');

    const studentBreakdowns = [];
    for (const enr of enrollments) {
      const stats = await calculateEnrollmentAttendance(enr.id);
      studentBreakdowns.push({
        enrollmentId: enr.id,
        studentId: enr.studentId,
        studentName: enr.studentName,
        status: enr.status,
        attendancePercentage: stats.attendancePercentage,
        sessionsPresent: stats.present,
        sessionsLate: stats.late,
        sessionsAbsent: stats.absent,
        sessionsExcused: stats.excused,
        eligibleSessions: stats.eligibleScheduledSessions,
        isAtRisk: stats.attendancePercentage < (course.minAttendancePercentage || 75),
      });
    }

    res.json({
      success: true,
      courseSlug: course.slug,
      courseTitle: course.title,
      minAttendancePercentage: course.minAttendancePercentage || 75,
      totalScheduledSessions: scheduledSessions.length,
      conductedSessionsCount: conductedSessions.length,
      enrollmentsCount: enrollments.length,
      studentBreakdowns,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating attendance summary: ' + err.message });
  }
});

// ----------------------------------------------------
// MODULE PROGRESS & COMPLETION EVALUATION APIs
// ----------------------------------------------------

// Get module progress for an enrollment
app.get('/api/enrollments/:id/progress', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ id: req.params.id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found.' });
    }

    let progressRecords = await ModuleProgress.find({ enrollmentId: enrollment.id }).sort({ moduleIndex: 1 });
    if (progressRecords.length === 0) {
      const course = await Course.findOne({ slug: enrollment.courseSlug });
      if (course) {
        progressRecords = await initializeStudentModuleProgress(enrollment, course);
      }
    }

    res.json({
      success: true,
      enrollmentId: enrollment.id,
      progressRecords,
      learningProgressPercentage: enrollment.learningProgressPercentage,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching module progress: ' + err.message });
  }
});

// Update specific module progress
app.put('/api/enrollments/:id/progress/:moduleIndex', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const { status, assessmentScore, assessmentPassed, remarks } = req.body;
    const moduleIndex = parseInt(req.params.moduleIndex, 10);

    const enrollment = await Enrollment.findOne({ id: req.params.id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found.' });
    }

    let record = await ModuleProgress.findOne({ enrollmentId: enrollment.id, moduleIndex });
    if (!record) {
      const course = await Course.findOne({ slug: enrollment.courseSlug });
      const mod = course?.modules?.[moduleIndex];
      record = new ModuleProgress({
        id: `MP-${enrollment.id}-${moduleIndex}`,
        enrollmentId: enrollment.id,
        studentId: enrollment.studentId,
        courseSlug: enrollment.courseSlug,
        moduleIndex,
        moduleTitle: mod?.title || `Module ${moduleIndex + 1}`,
        isRequired: mod?.isRequired !== false,
      });
    }

    if (status) {
      record.status = status;
      if (status === 'Completed' && !record.completedAt) {
        record.completedAt = new Date();
      }
    }

    if (assessmentScore !== undefined) {
      record.assessmentScore = assessmentScore;
      record.attempts = (record.attempts || 0) + 1;
    }
    if (assessmentPassed !== undefined) {
      record.assessmentPassed = assessmentPassed;
    }
    if (remarks !== undefined) {
      record.remarks = remarks;
    }
    record.assessedBy = req.user.name;

    await record.save();

    // Recalculate learning progress & evaluate course completion policy
    const progressStats = await calculateEnrollmentProgress(enrollment.id);
    const completionEval = await evaluateCourseCompletion(enrollment.id);

    await logAudit(
      req.user.name,
      'UPDATE_MODULE_PROGRESS',
      'Academics',
      `Updated module #${moduleIndex + 1} (${record.moduleTitle}) for student ${enrollment.studentName} in "${enrollment.courseTitle}". Status: ${record.status}.`
    );

    res.json({
      success: true,
      module: record,
      learningProgressPercentage: progressStats.learningProgressPercentage,
      completionEvaluation: completionEval,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error updating module progress: ' + err.message });
  }
});

// Evaluate completion criteria
app.post('/api/enrollments/:id/evaluate-completion', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const evaluation = await evaluateCourseCompletion(req.params.id);
    res.json({ success: true, evaluation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error evaluating completion: ' + err.message });
  }
});

// Complete Course Enrollment
app.post('/api/enrollments/:id/complete', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { force, notes } = req.body;
    const enrollment = await Enrollment.findOne({ id: req.params.id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found.' });
    }

    const evaluation = await evaluateCourseCompletion(enrollment.id);

    if (!evaluation.eligible && !force) {
      return res.status(400).json({
        success: false,
        message: 'Student has not met completion criteria (attendance requirement or required syllabus modules). Pass force=true to override.',
        evaluation,
      });
    }

    enrollment.status = 'Completed';
    enrollment.completedAt = new Date();
    enrollment.completionEligible = true;
    if (notes) enrollment.notes = notes;
    await enrollment.save();

    await logAudit(
      req.user.name,
      'COMPLETE_ENROLLMENT',
      'Academics',
      `Graduated/completed course for student "${enrollment.studentName}" in "${enrollment.courseTitle}" (Attendance: ${evaluation.actualAttendancePercentage}%, Learning: ${evaluation.learningProgressPercentage}%).`
    );

    res.json({
      success: true,
      message: 'Course enrollment marked as Completed successfully.',
      enrollment,
      evaluation,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error completing enrollment: ' + err.message });
  }
});

// ----------------------------------------------------
// ACADEMIC REPORTS APIs
// ----------------------------------------------------
app.get('/api/reports/academics', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'COUNSELLOR'), async (req, res) => {
  try {
    const [courses, allEnrollments] = await Promise.all([
      Course.find(),
      Enrollment.find(),
    ]);

    const activeEnrollments = allEnrollments.filter((e) => e.status === 'Active');
    const completedEnrollments = allEnrollments.filter((e) => e.status === 'Completed');
    const withdrawnEnrollments = allEnrollments.filter((e) => e.status === 'Withdrawn');

    const avgAttendance = activeEnrollments.length > 0
      ? Math.round(activeEnrollments.reduce((sum, e) => sum + (e.attendancePercentage || 0), 0) / activeEnrollments.length)
      : 0;

    const avgProgress = activeEnrollments.length > 0
      ? Math.round(activeEnrollments.reduce((sum, e) => sum + (e.learningProgressPercentage || 0), 0) / activeEnrollments.length)
      : 0;

    // Identify at-risk students (active with attendance < 75%)
    const atRiskEnrollments = activeEnrollments.filter((e) => (e.attendancePercentage || 0) < 75);

    // Per-course breakdown
    const courseBreakdown = courses.map((course) => {
      const courseEnrs = allEnrollments.filter((e) => e.courseSlug === course.slug);
      const activeEnrs = courseEnrs.filter((e) => e.status === 'Active');
      const compEnrs = courseEnrs.filter((e) => e.status === 'Completed');
      const courseAvgAtt = activeEnrs.length > 0
        ? Math.round(activeEnrs.reduce((s, e) => s + (e.attendancePercentage || 0), 0) / activeEnrs.length)
        : 0;

      return {
        courseSlug: course.slug,
        title: course.title,
        status: course.status || 'Active',
        totalEnrollments: courseEnrs.length,
        activeEnrollments: activeEnrs.length,
        completedEnrollments: compEnrs.length,
        averageAttendance: courseAvgAtt,
      };
    });

    res.json({
      success: true,
      report: {
        totalCourses: courses.length,
        activeCourses: courses.filter((c) => c.status === 'Active' || !c.status).length,
        totalEnrollments: allEnrollments.length,
        activeEnrollments: activeEnrollments.length,
        completedEnrollments: completedEnrollments.length,
        withdrawnEnrollments: withdrawnEnrollments.length,
        averageAttendance: avgAttendance,
        averageProgress: avgProgress,
        atRiskCount: atRiskEnrollments.length,
        atRiskStudents: atRiskEnrollments.map((e) => ({
          enrollmentId: e.id,
          studentId: e.studentId,
          studentName: e.studentName,
          courseSlug: e.courseSlug,
          courseTitle: e.courseTitle,
          attendancePercentage: e.attendancePercentage,
          learningProgressPercentage: e.learningProgressPercentage,
        })),
        courseBreakdown,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error compiling academic report: ' + err.message });
  }
});

// ----------------------------------------------------
// FLOATING SKILLS APIs
// ----------------------------------------------------
app.get('/api/floating-skills', async (req, res) => {
  try {
    const skills = await FloatingSkill.find().sort({ createdAt: -1 });
    res.json({ success: true, skills });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching floating skills.' });
  }
});

app.post('/api/floating-skills', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    const skillData = req.body;
    const skill = await FloatingSkill.findOneAndUpdate(
      { id: skillData.id },
      skillData,
      { upsert: true, new: true, runValidators: true }
    );
    await logAudit(req.user.name, 'SAVE_FLOATING_SKILL', 'Website', `Saved floating skill "${skill.name}".`);
    res.json({ success: true, skill });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/floating-skills/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    await FloatingSkill.findOneAndDelete({ id: req.params.id });
    await logAudit(req.user.name, 'DELETE_FLOATING_SKILL', 'Website', `Deleted floating skill "${req.params.id}".`);
    res.json({ success: true, message: 'Floating skill deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting floating skill.' });
  }
});

// ----------------------------------------------------
// ANNOUNCEMENTS APIs
// ----------------------------------------------------
app.get('/api/announcement', async (req, res) => {
  try {
    const announcement = await Announcement.findOne().sort({ createdAt: -1 });
    res.json({ success: true, announcement });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching announcement.' });
  }
});

app.put('/api/announcement', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    const announcement = await Announcement.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    await logAudit(req.user.name, 'UPDATE_ANNOUNCEMENT', 'Website', 'Updated announcement banner.');
    res.json({ success: true, announcement });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating announcement.' });
  }
});

// ----------------------------------------------------
// AUDIT LOGS APIs
// ----------------------------------------------------
app.get('/api/audit-logs', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching audit logs.' });
  }
});

// Global Express Error Handler Middleware (H5)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Express Error:', err.stack || err.message || err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.',
  });
});

// Process Safety Net Handlers (H5)
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception thrown:', err);
});

// ----------------------------------------------------
// START SERVER & CONNECT DATABASE
// ----------------------------------------------------
const startServer = async () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    console.error('\n❌ FATAL ERROR: JWT_SECRET environment variable is missing or shorter than 32 characters. Server startup aborted.\n');
    process.exit(1);
  }

  const isConnected = await connectDB();
  if (!isConnected) {
    console.error('\n❌ FATAL ERROR: Database connection failed during boot. Server startup aborted.\n');
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 SSCI Backend Express API listening on 0.0.0.0:${PORT}\n`);
  });
};

startServer();

