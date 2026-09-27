import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';

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

// Import existing content datasets from pure JS seedData module
import { COURSES_DATA, UPCOMING_BATCHES, BLOG_POSTS, FACULTY_TRAINERS, SITE_CONFIG } from './seedData.js';

dotenv.config();

const seedDatabase = async () => {
  console.log('🚀 Initializing MongoDB Atlas Seed Process...');

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI || mongoURI.includes('YOUR_DATABASE_PASSWORD') || mongoURI.includes('<db_password>') || mongoURI.includes('<password>')) {
    console.error('\n❌ ACTION REQUIRED: Open the .env file in VS Code and replace YOUR_DATABASE_PASSWORD with your real MongoDB Atlas password.\n');
    process.exit(1);
  }

  const connected = await connectDB();
  if (!connected) {
    console.error('Seed aborted due to database connection failure.');
    process.exit(1);
  }

  try {
    // 1. Seed Admin User
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      const email = process.env.SEED_ADMIN_EMAIL || 'admin@sscomputer.in';
      const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
      if (!email || !password || password.length < 8) {
        console.error('\n❌ SEED ERROR: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (min 8 chars) environment variables are required to seed admin user.\n');
        process.exit(1);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await AdminUser.create({
        name: 'Sri Shanmukha Admin',
        email: email,
        password: hashedPassword,
        role: 'SUPER ADMIN',
        permissions: ['all'],
      });
      console.log(`✅ Admin User seeded: ${email}`);
    }

    // 2. Seed Courses
    const courseCount = await Course.countDocuments();
    if (courseCount === 0 && COURSES_DATA.length > 0) {
      await Course.insertMany(COURSES_DATA);
      console.log(`✅ ${COURSES_DATA.length} Courses seeded.`);
    }

    // 3. Seed Batches
    const batchCount = await Batch.countDocuments();
    if (batchCount === 0 && UPCOMING_BATCHES.length > 0) {
      await Batch.insertMany(UPCOMING_BATCHES);
      console.log(`✅ ${UPCOMING_BATCHES.length} Batches seeded.`);
    }

    // 4. Seed Blog Posts
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0 && BLOG_POSTS.length > 0) {
      await BlogPost.insertMany(BLOG_POSTS);
      console.log(`✅ ${BLOG_POSTS.length} Blog posts seeded.`);
    }

    // 5. Seed Trainers
    const trainerCount = await Trainer.countDocuments();
    if (trainerCount === 0 && FACULTY_TRAINERS.length > 0) {
      await Trainer.insertMany(FACULTY_TRAINERS);
      console.log(`✅ ${FACULTY_TRAINERS.length} Faculty trainers seeded.`);
    }

    // 6. Seed Site Settings
    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      await SiteSettings.create({
        instituteName: SITE_CONFIG.name,
        shortName: SITE_CONFIG.shortName,
        tagline: SITE_CONFIG.tagline,
        phone: SITE_CONFIG.contact.phonePrimary,
        whatsapp: SITE_CONFIG.whatsappNumber,
        email: SITE_CONFIG.contact.email,
        address: SITE_CONFIG.contact.address,
        workingHours: SITE_CONFIG.contact.workingHours,
        googleMapsUrl: SITE_CONFIG.contact.mapEmbedUrl,
        social: SITE_CONFIG.social,
      });
      console.log('✅ Site Settings seeded.');
    }

    // 7. Seed Hero Content
    const heroCount = await HeroContent.countDocuments();
    if (heroCount === 0) {
      await HeroContent.create({
        badge: 'SRI SHANMUKHA COMPUTER INSTITUTE • NELLORE',
        title: 'Learn Today. Build Your Future',
        highlightText: 'Tomorrow.',
        description:
          'Build practical computer skills, programming knowledge, and career-ready digital capabilities with structured classroom training and daily 1:1 lab practice.',
        primaryCtaText: 'Explore All Courses',
        secondaryCtaText: 'View Upcoming Batches',
      });
      console.log('✅ Hero Content seeded.');
    }

    // 8. Seed Announcement
    const annCount = await Announcement.countDocuments();
    if (annCount === 0) {
      await Announcement.create({
        message: 'New Weekend Python & Tally Prime Batches Starting Next Monday! Limited Seats Available.',
        ctaText: 'Enquire Now',
        ctaUrl: '/batches',
        active: true,
      });
      console.log('✅ Announcement seeded.');
    }

    // 9. Seed Initial Certificates
    const certCount = await CertificateRecord.countDocuments();
    if (certCount === 0) {
      await CertificateRecord.insertMany([
        {
          certificateNumber: 'SSCI-2026-9482',
          studentName: 'K. Sai Teja',
          courseName: 'Python Programming',
          issueDate: 'August 28, 2026',
          completionStatus: 'Successfully Completed with Distinction',
          grade: 'Grade A+',
          verificationCode: 'VERIFIED-OFFICIAL-SSCI-2026',
          status: 'Valid',
        },
        {
          certificateNumber: 'SSCI-2026-1024',
          studentName: 'V. Ramya Sree',
          courseName: 'Tally Prime & GST Accounting',
          issueDate: 'September 10, 2026',
          completionStatus: 'Successfully Completed',
          grade: 'Grade A',
          verificationCode: 'VERIFIED-OFFICIAL-SSCI-2026',
          status: 'Valid',
        },
      ]);
      console.log('✅ Initial Certificates seeded.');
    }

    console.log('\n🎉 MongoDB Atlas Seeding Process Complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database seed:', error);
    process.exit(1);
  }
};

seedDatabase();
