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
app.get('/api/batches', async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.json({ success: true, batches });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching batches.' });
  }
});

app.post('/api/batches', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    const batchData = req.body;
    const batch = await Batch.findOneAndUpdate(
      { id: batchData.id },
      batchData,
      { upsert: true, new: true, runValidators: true }
    );
    await logAudit(req.user.name, 'SAVE_BATCH', 'Batches', `Saved batch "${batch.id}".`);
    res.json({ success: true, batch });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/batches/:id', authenticateToken, authorizeRoles('SUPER ADMIN', 'ADMIN', 'CONTENT MANAGER'), async (req, res) => {
  try {
    await Batch.findOneAndDelete({ id: req.params.id });
    await logAudit(req.user.name, 'DELETE_BATCH', 'Batches', `Deleted batch "${req.params.id}".`);
    res.json({ success: true, message: 'Batch deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting batch.' });
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
    res.json({ success: true, lead: newLead, message: 'Thank you for your enquiry! We will contact you shortly.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
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
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching students.' });
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
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching student details.' });
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

