import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { connectDB } from './config/db.js';
import { authenticateToken } from './middleware/auth.js';

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
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Permissive CORS for public endpoints
      }
    },
    credentials: true,
  })
);

app.use(express.json());

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
  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------------------
// AUTHENTICATION APIs
// ----------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const secret = process.env.JWT_SECRET || 'SSCI_DEFAULT_PRODUCTION_JWT_SECRET';
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

app.post('/api/courses', authenticateToken, async (req, res) => {
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

app.delete('/api/courses/:slug', authenticateToken, async (req, res) => {
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

app.post('/api/batches', authenticateToken, async (req, res) => {
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

app.delete('/api/batches/:id', authenticateToken, async (req, res) => {
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
app.get('/api/leads', authenticateToken, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching leads.' });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const count = await Lead.countDocuments();
    const leadId = `LEAD-${1001 + count}`;
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

app.put('/api/leads/:id/status', authenticateToken, async (req, res) => {
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

// ----------------------------------------------------
// CERTIFICATE VERIFICATION APIs
// ----------------------------------------------------
app.get('/api/certificates/verify/:certNumber', async (req, res) => {
  try {
    const cert = await CertificateRecord.findOne({ certificateNumber: req.params.certNumber });
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

app.get('/api/certificates', authenticateToken, async (req, res) => {
  try {
    const certificates = await CertificateRecord.find().sort({ createdAt: -1 });
    res.json({ success: true, certificates });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching certificates.' });
  }
});

app.post('/api/certificates', authenticateToken, async (req, res) => {
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

app.put('/api/website/hero', authenticateToken, async (req, res) => {
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

// ----------------------------------------------------
// AUDIT LOGS APIs
// ----------------------------------------------------
app.get('/api/audit-logs', authenticateToken, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching audit logs.' });
  }
});

// ----------------------------------------------------
// START SERVER & CONNECT DATABASE
// ----------------------------------------------------
const startServer = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 SSCI Backend Express API listening on 0.0.0.0:${PORT}\n`);
  });
};

startServer();
