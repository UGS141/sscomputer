import { COURSES_DATA, type Course } from '../data/courses';
import { UPCOMING_BATCHES, type Batch } from '../data/batches';
import { BLOG_POSTS, type BlogPost } from '../data/blog';
import { FACULTY_TRAINERS, type Trainer } from '../data/trainers';
import { STUDENT_TESTIMONIALS, type Testimonial } from '../data/testimonials';
import { STUDENT_PROJECTS, type StudentProject } from '../data/projects';
import { GLOBAL_FAQS, type FAQItem } from '../data/faqs';
import { LEARNING_PATHS, type LearningPath } from '../data/learningPaths';
import { FLOATING_SKILLS, type FloatingSkill } from '../components/home/FloatingTechnologies';
import { SITE_CONFIG } from '../config/site';
import { apiService } from '../services/api';

export type { Course, Batch, BlogPost, Trainer, Testimonial, StudentProject, FAQItem, LearningPath, FloatingSkill };


export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER ADMIN' | 'ADMIN' | 'COUNSELLOR' | 'CONTENT MANAGER' | 'TRAINER' | 'VIEWER';
  avatar?: string;
  permissions: string[];
}

export interface LeadNote {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface LeadTimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'system' | 'call' | 'whatsapp' | 'note' | 'status_change';
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  courseInterested?: string;
  preferredBatch?: string;
  message?: string;
  source: 'Website' | 'Course Page' | 'Contact Form' | 'WhatsApp' | 'Phone' | 'Manual' | 'Instagram';
  status: 'New' | 'Contacted' | 'Interested' | 'Follow-up' | 'Converted' | 'Not Interested' | 'Closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes: LeadNote[];
  followUpDate?: string;
  timeline: LeadTimelineEvent[];
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  batch: string;
  admissionDate: string;
  status: 'Enquiry' | 'Registered' | 'Active' | 'Completed' | 'Alumni';
  grade?: string;
  certificatesIssued: string[];
}

export interface CertificateRecord {
  certificateNumber: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  completionStatus: string;
  grade: string;
  verificationCode: string;
  status: 'Valid' | 'Revoked';
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  highlightText: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface Announcement {
  id: string;
  message: string;
  ctaText: string;
  ctaUrl: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: string;
  category: 'Course Images' | 'Blog Images' | 'Trainer Photos' | 'Project Images' | 'Website Images';
}

export interface SiteSettings {
  instituteName: string;
  shortName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  googleMapsUrl: string;
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
  };
}

const STORAGE_KEY = 'ssci_cms_database_v1';

// Seed Initial Data
const defaultInitialState = {
  courses: COURSES_DATA,
  batches: UPCOMING_BATCHES,
  blogPosts: BLOG_POSTS,
  trainers: FACULTY_TRAINERS,
  testimonials: STUDENT_TESTIMONIALS,
  projects: STUDENT_PROJECTS,
  faqs: GLOBAL_FAQS,
  learningPaths: LEARNING_PATHS,
  floatingSkills: FLOATING_SKILLS,
  heroContent: {
    badge: 'SRI SHANMUKHA COMPUTER INSTITUTE',
    title: 'Learn Today. Build Your Future',
    highlightText: 'Tomorrow.',
    description: 'Build practical computer skills, programming knowledge, and career-ready digital capabilities with structured classroom training and daily 1:1 lab practice.',
    primaryCtaText: 'Explore All Courses',
    secondaryCtaText: 'View Upcoming Batches',
  } as HeroContent,
  announcement: {
    id: 'ann-1',
    message: 'New Weekend Python & Tally Prime Batches Starting Next Monday! Limited Seats Available.',
    ctaText: 'Enquire Now',
    ctaUrl: '/batches',
    active: true,
  } as Announcement,
  settings: {
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
  } as SiteSettings,
  leads: [
    {
      id: 'LEAD-1001',
      name: 'K. Sai Teja',
      phone: '+91 9876543210',
      email: 'saiteja.k@gmail.com',
      courseInterested: 'Python Programming',
      preferredBatch: 'Morning (10:00 AM - 12:00 PM)',
      message: 'Want to learn Python for data science and web apps.',
      source: 'Website',
      status: 'Contacted',
      createdAt: '2026-09-24T10:30:00.000Z',
      updatedAt: '2026-09-24T14:20:00.000Z',
      assignedTo: 'Admission Counselor',
      notes: [{ id: 'n1', text: 'Spoke on phone. Student prefers weekend batch.', author: 'Admission Counselor', timestamp: '2026-09-24T14:20:00.000Z' }],
      followUpDate: '2026-09-27T10:00:00.000Z',
      timeline: [
        { id: 't1', title: 'Enquiry Received', description: 'Submitted via website course page form.', timestamp: '2026-09-24T10:30:00.000Z', type: 'system' },
        { id: 't2', title: 'Phone Call Made', description: 'Spoke with candidate regarding schedule.', timestamp: '2026-09-24T14:20:00.000Z', type: 'call' }
      ]
    },
    {
      id: 'LEAD-1002',
      name: 'V. Ramya Sree',
      phone: '+91 9848022338',
      email: 'ramya.v@yahoo.com',
      courseInterested: 'Tally Prime & GST Accounting',
      preferredBatch: 'Evening (5:00 PM - 7:00 PM)',
      message: 'Looking for B.Com practical accounting training.',
      source: 'WhatsApp',
      status: 'Converted',
      createdAt: '2026-09-23T09:15:00.000Z',
      updatedAt: '2026-09-25T11:00:00.000Z',
      assignedTo: 'Senior Admin',
      notes: [{ id: 'n2', text: 'Admitted into Evening Tally batch.', author: 'Senior Admin', timestamp: '2026-09-25T11:00:00.000Z' }],
      timeline: [
        { id: 't3', title: 'WhatsApp Click', description: 'Initiated conversation via floating button.', timestamp: '2026-09-23T09:15:00.000Z', type: 'whatsapp' },
        { id: 't4', title: 'Converted to Student', description: 'Registered for Tally Prime batch.', timestamp: '2026-09-25T11:00:00.000Z', type: 'status_change' }
      ]
    },
    {
      id: 'LEAD-1003',
      name: 'M. Tarun Kumar',
      phone: '+91 9123456789',
      email: 'tarun.m@outlook.com',
      courseInterested: 'Full Stack Web Development',
      preferredBatch: 'Morning (8:00 AM - 10:00 AM)',
      message: 'Interested in HTML, CSS, JS, and React training.',
      source: 'Contact Form',
      status: 'New',
      createdAt: '2026-09-26T16:45:00.000Z',
      updatedAt: '2026-09-26T16:45:00.000Z',
      notes: [],
      timeline: [
        { id: 't5', title: 'New Form Submission', description: 'Submitted contact form on SSCI website.', timestamp: '2026-09-26T16:45:00.000Z', type: 'system' }
      ]
    }
  ] as Lead[],
  students: [
    {
      id: 'STD-101',
      studentId: 'SSCI-STD-2026-01',
      name: 'K. Sai Teja',
      phone: '+91 9876543210',
      email: 'saiteja.k@gmail.com',
      course: 'Python Programming',
      batch: 'Batch PY-2026-01 (Morning)',
      admissionDate: 'September 15, 2026',
      status: 'Active',
      certificatesIssued: ['SSCI-2026-9482']
    },
    {
      id: 'STD-102',
      studentId: 'SSCI-STD-2026-02',
      name: 'V. Ramya Sree',
      phone: '+91 9848022338',
      email: 'ramya.v@yahoo.com',
      course: 'Tally Prime & GST Accounting',
      batch: 'Batch TP-2026-02 (Evening)',
      admissionDate: 'September 10, 2026',
      status: 'Active',
      certificatesIssued: ['SSCI-2026-1024']
    }
  ] as Student[],
  certificates: [
    {
      certificateNumber: 'SSCI-2026-9482',
      studentName: 'K. Sai Teja',
      courseName: 'Python Programming',
      issueDate: 'August 28, 2026',
      completionStatus: 'Successfully Completed with Distinction',
      grade: 'Grade A+',
      verificationCode: 'VERIFIED-OFFICIAL-SSCI-2026',
      status: 'Valid'
    },
    {
      certificateNumber: 'SSCI-2026-1024',
      studentName: 'V. Ramya Sree',
      courseName: 'Tally Prime & GST Accounting',
      issueDate: 'September 10, 2026',
      completionStatus: 'Successfully Completed',
      grade: 'Grade A',
      verificationCode: 'VERIFIED-OFFICIAL-SSCI-2026',
      status: 'Valid'
    },
    {
      certificateNumber: 'SSCI-2026-5541',
      studentName: 'M. Tarun Kumar',
      courseName: 'Full Stack Web Development',
      issueDate: 'July 14, 2026',
      completionStatus: 'Successfully Completed with Distinction',
      grade: 'Grade A+',
      verificationCode: 'VERIFIED-OFFICIAL-SSCI-2026',
      status: 'Valid'
    }
  ] as CertificateRecord[],
  media: [
    {
      id: 'm1',
      filename: 'ssci-logo.png',
      url: '/ssci-logo.png',
      size: '538 KB',
      type: 'PNG',
      uploadedAt: '2026-09-23',
      category: 'Website Images'
    }
  ] as MediaItem[],
  auditLogs: [
    {
      id: 'log-1',
      user: 'Super Admin',
      action: 'INITIALIZE_SYSTEM',
      module: 'System',
      details: 'SSCI CMS Database initialized & persistent storage activated.',
      timestamp: new Date().toISOString()
    }
  ] as AuditLog[],
  currentUser: {
    id: 'user-admin',
    name: 'Sri Shanmukha Admin',
    email: 'admin@sscomputer.in',
    role: 'SUPER ADMIN',
    permissions: ['all']
  } as AdminUser | null
};

// Singleton Data Engine
class CMSStore {
  private state = defaultInitialState;
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
    this.refreshFromBackend();
  }

  public async refreshFromBackend() {
    try {
      const [coursesRes, batchesRes, blogRes, trainersRes, heroRes, settingsRes, annRes, skillsRes, leadsRes, studentsRes] = await Promise.all([
        apiService.getCourses(),
        apiService.getBatches(),
        apiService.getBlogPosts(),
        apiService.getTrainers(),
        apiService.getHeroContent(),
        apiService.getSettings(),
        apiService.getAnnouncement(),
        apiService.getFloatingSkills(),
        apiService.getLeads(),
        apiService.getStudents(),
      ]);

      if (coursesRes?.success && Array.isArray(coursesRes.courses)) {
        this.state.courses = coursesRes.courses;
      }
      if (batchesRes?.success && Array.isArray(batchesRes.batches)) {
        this.state.batches = batchesRes.batches;
      }
      if (blogRes?.success && Array.isArray(blogRes.posts)) {
        this.state.blogPosts = blogRes.posts;
      }
      if (trainersRes?.success && Array.isArray(trainersRes.trainers)) {
        this.state.trainers = trainersRes.trainers;
      }
      if (heroRes?.success && heroRes.hero) {
        this.state.heroContent = heroRes.hero;
      }
      if (settingsRes?.success && settingsRes.settings) {
        this.state.settings = settingsRes.settings;
      }
      if (annRes?.success && annRes.announcement) {
        this.state.announcement = annRes.announcement;
      }
      if (skillsRes?.success && Array.isArray(skillsRes.skills)) {
        this.state.floatingSkills = skillsRes.skills;
      }
      if (leadsRes?.success && Array.isArray(leadsRes.leads)) {
        this.state.leads = leadsRes.leads;
      }
      if (studentsRes?.success && Array.isArray(studentsRes.students)) {
        this.state.students = studentsRes.students;
      }
      this.saveToStorage();
    } catch (e) {
      console.warn('Failed to refresh CMS state from backend:', e);
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state = {
          ...defaultInitialState,
          ...parsed,
          floatingSkills: defaultInitialState.floatingSkills,
          heroContent: parsed.heroContent || defaultInitialState.heroContent,
          announcement: parsed.announcement || defaultInitialState.announcement,
          settings: parsed.settings || defaultInitialState.settings,
        };
      }
    } catch (e) {
      console.warn('Failed to load CMS state from localStorage, using default data.', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save CMS state to localStorage.', e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  // --- GETTERS ---
  public getState() {
    return this.state;
  }

  public getCourses() {
    return this.state.courses;
  }

  public getCourseBySlug(slug: string) {
    return this.state.courses.find((c) => c.slug === slug);
  }

  public getBatches() {
    return this.state.batches;
  }

  public getBlogPosts() {
    return this.state.blogPosts;
  }

  public getBlogPostBySlug(slug: string) {
    return this.state.blogPosts.find((b) => b.slug === slug);
  }

  public getTrainers() {
    return this.state.trainers;
  }

  public getTestimonials() {
    return this.state.testimonials;
  }

  public getProjects() {
    return this.state.projects;
  }

  public getFAQs() {
    return this.state.faqs;
  }

  public getLearningPaths() {
    return this.state.learningPaths;
  }

  public getFloatingSkills() {
    return this.state.floatingSkills;
  }

  public getHeroContent() {
    return this.state.heroContent;
  }

  public getAnnouncement() {
    return this.state.announcement;
  }

  public getSettings() {
    return this.state.settings;
  }

  public getLeads() {
    return this.state.leads;
  }

  public getStudents() {
    return this.state.students;
  }

  public getCertificates() {
    return this.state.certificates;
  }

  public getMedia() {
    return this.state.media;
  }

  public getAuditLogs() {
    return this.state.auditLogs;
  }

  public getCurrentUser() {
    return this.state.currentUser;
  }

  // --- MUTATORS (WITH AUDIT LOGGING & AWAITED API WRITES) ---

  // Auth
  public async verifySession(): Promise<boolean> {
    const token = localStorage.getItem('ssci_jwt_token');
    if (!token) {
      this.state.currentUser = null;
      this.saveToStorage();
      return false;
    }
    const res = await apiService.verifyMe();
    if (res?.success && res.user) {
      const user: AdminUser = {
        id: res.user._id || res.user.id || `user-${Date.now()}`,
        name: res.user.name || 'SSCI Admin',
        email: res.user.email,
        role: res.user.role || 'SUPER ADMIN',
        permissions: res.user.permissions || ['all']
      };
      this.state.currentUser = user;
      localStorage.setItem('ssci_user', JSON.stringify(user));
      this.saveToStorage();
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  public async loginWithBackend(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiService.login(email, password);
    if (res?.success && res.user && res.token) {
      const user: AdminUser = {
        id: res.user.id || res.user._id || `user-${Date.now()}`,
        name: res.user.name || 'SSCI Admin',
        email: res.user.email || email,
        role: res.user.role || 'SUPER ADMIN',
        permissions: res.user.permissions || ['all']
      };
      this.state.currentUser = user;
      localStorage.setItem('ssci_user', JSON.stringify(user));
      this.logAudit(user.name, 'LOGIN', 'Authentication', `Admin user "${user.name}" logged in via backend API.`);
      this.saveToStorage();
      return { success: true };
    }
    return { success: false, message: res?.message || 'Authentication failed. Please check credentials or backend connection.' };
  }

  public logout() {
    apiService.logout();
    if (this.state.currentUser) {
      this.logAudit(this.state.currentUser.name, 'LOGOUT', 'Authentication', 'User logged out.');
    }
    this.state.currentUser = null;
    this.saveToStorage();
  }

  // Courses CRUD
  public async saveCourse(courseData: Partial<Course> & { slug: string; title: string }) {
    let targetCourse: Course;
    const existingIndex = this.state.courses.findIndex((c) => c.slug === courseData.slug);
    if (existingIndex >= 0) {
      targetCourse = { ...this.state.courses[existingIndex], ...courseData } as Course;
    } else {
      targetCourse = {
        slug: courseData.slug,
        title: courseData.title,
        categoryId: courseData.categoryId || 'computer-essentials',
        categoryName: courseData.categoryName || 'Computer Essentials',
        level: courseData.level || 'Beginner',
        duration: courseData.duration || '30 Days',
        mode: courseData.mode || 'Practical Lab',
        shortDescription: courseData.shortDescription || 'Hands-on practical training at SSCI Nellore.',
        fullDescription: courseData.fullDescription || 'Detailed course curriculum and computer lab practice.',
        targetAudience: courseData.targetAudience || ['Students and job seekers'],
        learningOutcomes: courseData.learningOutcomes || ['Practical proficiency'],
        skillsLearned: courseData.skillsLearned || ['Computer Skills'],
        tools: courseData.tools || ['Software Tools'],
        modules: courseData.modules || [],
        certificationName: courseData.certificationName || `Certificate in ${courseData.title}`,
        projects: courseData.projects || [],
        faqs: courseData.faqs || []
      };
    }

    const res = await apiService.saveCourse(targetCourse);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to save course to database.');
    }

    const savedCourse = res.course || targetCourse;
    if (existingIndex >= 0) {
      this.state.courses[existingIndex] = savedCourse;
      this.logAudit(this.getUserName(), 'UPDATE_COURSE', 'Courses', `Updated course details for "${courseData.title}".`);
    } else {
      this.state.courses.unshift(savedCourse);
      this.logAudit(this.getUserName(), 'CREATE_COURSE', 'Courses', `Created new course "${courseData.title}".`);
    }
    this.saveToStorage();
    return savedCourse;
  }

  public async deleteCourse(slug: string) {
    const res = await apiService.deleteCourse(slug);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to delete course from database.');
    }
    const course = this.getCourseBySlug(slug);
    this.state.courses = this.state.courses.filter((c) => c.slug !== slug);
    this.logAudit(this.getUserName(), 'DELETE_COURSE', 'Courses', `Deleted course "${course?.title || slug}".`);
    this.saveToStorage();
    return res;
  }

  // Batches CRUD
  public async saveBatch(batchData: Partial<Batch> & { id: string; courseName: string }) {
    let targetBatch: Batch;
    const existingIndex = this.state.batches.findIndex((b) => b.id === batchData.id);
    if (existingIndex >= 0) {
      targetBatch = { ...this.state.batches[existingIndex], ...batchData } as Batch;
    } else {
      targetBatch = {
        id: batchData.id || `BATCH-${Date.now().toString().slice(-4)}`,
        courseSlug: batchData.courseSlug || 'python-programming',
        courseName: batchData.courseName,
        category: batchData.category || 'Programming',
        level: batchData.level || 'Beginner to Advanced',
        duration: batchData.duration || '60 Days',
        timing: (batchData.timing as any) || 'Morning',
        timeRange: batchData.timeRange || '10:00 AM – 12:00 PM',
        startDate: batchData.startDate || 'Next Monday',
        mode: batchData.mode || 'Practical Lab',
        status: (batchData.status as any) || 'Starting Soon',
        totalSeats: batchData.totalSeats ?? 20,
        filledSeats: batchData.filledSeats ?? 10,
        trainerName: batchData.trainerName || 'Senior SSCI Faculty'
      };
    }

    const res = await apiService.saveBatch(targetBatch);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to save batch to database.');
    }

    const savedBatch = res.batch || targetBatch;
    if (existingIndex >= 0) {
      this.state.batches[existingIndex] = savedBatch;
      this.logAudit(this.getUserName(), 'UPDATE_BATCH', 'Batches', `Updated batch "${batchData.id} - ${batchData.courseName}".`);
    } else {
      this.state.batches.unshift(savedBatch);
      this.logAudit(this.getUserName(), 'CREATE_BATCH', 'Batches', `Created new batch for "${batchData.courseName}".`);
    }
    this.saveToStorage();
    return savedBatch;
  }

  public async deleteBatch(id: string) {
    const res = await apiService.deleteBatch(id);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to delete batch from database.');
    }
    this.state.batches = this.state.batches.filter((b) => b.id !== id);
    this.logAudit(this.getUserName(), 'DELETE_BATCH', 'Batches', `Deleted batch "${id}".`);
    this.saveToStorage();
    return res;
  }

  // Lead / Enquiry CRM
  public addLead(leadData: { name: string; phone: string; email?: string; courseInterested?: string; preferredBatch?: string; message?: string; source?: Lead['source'] }): Lead {
    const newLead: Lead = {
      id: `LEAD-${(1000 + this.state.leads.length + 1).toString()}`,
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      courseInterested: leadData.courseInterested || 'General Enquiry',
      preferredBatch: leadData.preferredBatch || 'Any Batch',
      message: leadData.message,
      source: leadData.source || 'Website',
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
      timeline: [
        {
          id: `t-${Date.now()}`,
          title: 'Enquiry Received',
          description: `Submitted enquiry for ${leadData.courseInterested || 'general details'}.`,
          timestamp: new Date().toISOString(),
          type: 'system'
        }
      ]
    };
    this.state.leads.unshift(newLead);
    this.logAudit('System Engine', 'CREATE_LEAD', 'CRM', `New enquiry from ${leadData.name} (${leadData.phone}).`);
    this.saveToStorage();
    return newLead;
  }

  public async updateLeadStatus(id: string, newStatus: Lead['status']) {
    const lead = this.state.leads.find((l) => l.id === id);
    if (lead) {
      const res = await apiService.updateLeadStatus(id, newStatus);
      if (res?.success && res.lead) {
        const idx = this.state.leads.findIndex((l) => l.id === id);
        if (idx >= 0) this.state.leads[idx] = res.lead;
      } else {
        const oldStatus = lead.status;
        lead.status = newStatus;
        lead.updatedAt = new Date().toISOString();
        lead.timeline.unshift({
          id: `t-${Date.now()}`,
          title: 'Status Updated',
          description: `Changed status from ${oldStatus} to ${newStatus}.`,
          timestamp: new Date().toISOString(),
          type: 'status_change'
        });
      }
      this.logAudit(this.getUserName(), 'UPDATE_LEAD_STATUS', 'CRM', `Updated lead ${id} status to ${newStatus}.`);
      this.saveToStorage();
    }
  }

  public async addLeadNote(id: string, text: string) {
    const lead = this.state.leads.find((l) => l.id === id);
    if (lead) {
      const res = await apiService.updateLeadStatus(id, lead.status, text);
      if (res?.success && res.lead) {
        const idx = this.state.leads.findIndex((l) => l.id === id);
        if (idx >= 0) this.state.leads[idx] = res.lead;
      } else {
        const author = this.getUserName();
        const note: LeadNote = {
          id: `note-${Date.now()}`,
          text,
          author,
          timestamp: new Date().toISOString()
        };
        lead.notes.unshift(note);
        lead.timeline.unshift({
          id: `t-${Date.now()}`,
          title: 'Note Added',
          description: `"${text}"`,
          timestamp: new Date().toISOString(),
          type: 'note'
        });
      }
      this.logAudit(this.getUserName(), 'ADD_LEAD_NOTE', 'CRM', `Added note to lead ${id}.`);
      this.saveToStorage();
    }
  }

  public async deleteLead(id: string) {
    const target = this.state.leads.find((l) => l.id === id);
    const targetName = target ? target.name : id;

    const res = await apiService.deleteLead(id);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to delete lead enquiry.');
    }

    this.state.leads = this.state.leads.filter((l) => l.id !== id);
    this.logAudit(this.getUserName(), 'DELETE_LEAD', 'CRM', `Deleted lead enquiry "${id}" (${targetName}).`);
    this.saveToStorage();
    return true;
  }

  public async convertLeadToStudent(id: string) {
    const lead = this.state.leads.find((l) => l.id === id);
    if (lead) {
      const existingStudent = this.state.students.find(
        (s) => s.phone === lead.phone || (lead.email && s.email === lead.email)
      );

      if (existingStudent) {
        lead.status = 'Converted';
        lead.updatedAt = new Date().toISOString();
        await apiService.updateLeadStatus(id, 'Converted', 'Lead converted (student record already exists)');
        this.saveToStorage();
        return existingStudent;
      }

      lead.status = 'Converted';
      lead.updatedAt = new Date().toISOString();

      const newStudent: Student = {
        id: `STD-${Date.now().toString().slice(-4)}`,
        studentId: `SSCI-STD-2026-${(this.state.students.length + 1).toString().padStart(2, '0')}`,
        name: lead.name,
        phone: lead.phone,
        email: lead.email || `${lead.name.toLowerCase().replace(/\s+/g, '')}@student.ssci`,
        course: lead.courseInterested || 'Computer Fundamentals',
        batch: lead.preferredBatch || 'Regular Batch',
        admissionDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: 'Active',
        certificatesIssued: []
      };

      const res = await apiService.saveStudent(newStudent);
      const savedStudent = res?.success && res.student ? res.student : newStudent;

      await apiService.updateLeadStatus(id, 'Converted', `Converted to registered student ${savedStudent.studentId}`);

      const idx = this.state.students.findIndex((s) => s.id === savedStudent.id || s.studentId === savedStudent.studentId);
      if (idx >= 0) {
        this.state.students[idx] = savedStudent;
      } else {
        this.state.students.unshift(savedStudent);
      }
      this.logAudit(this.getUserName(), 'CONVERT_LEAD', 'CRM', `Converted lead ${id} (${lead.name}) into registered student ${savedStudent.studentId}.`);
      this.saveToStorage();
      return savedStudent;
    }
  }

  public async saveStudent(studentData: Partial<Student> & { name: string; phone: string; email: string; course: string; batch: string }) {
    const isEdit = Boolean(studentData.id || studentData.studentId);
    let targetStudent: Student;

    if (isEdit) {
      const existing = this.state.students.find((s) => s.id === studentData.id || s.studentId === studentData.studentId);
      targetStudent = {
        ...existing,
        ...studentData,
      } as Student;
    } else {
      const count = this.state.students.length + 1;
      targetStudent = {
        id: `STD-${Date.now().toString().slice(-4)}`,
        studentId: `SSCI-STD-2026-${count.toString().padStart(2, '0')}`,
        admissionDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: 'Active',
        certificatesIssued: [],
        ...studentData,
      } as Student;
    }

    const res = await apiService.saveStudent(targetStudent);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to save student record to database.');
    }

    const saved = res.student || targetStudent;
    const idx = this.state.students.findIndex((s) => s.id === saved.id || s.studentId === saved.studentId);
    if (idx >= 0) {
      this.state.students[idx] = saved;
      this.logAudit(this.getUserName(), 'UPDATE_STUDENT', 'Students', `Updated student record for "${saved.name}" (${saved.studentId}).`);
    } else {
      this.state.students.unshift(saved);
      this.logAudit(this.getUserName(), 'CREATE_STUDENT', 'Students', `Created student record for "${saved.name}" (${saved.studentId}).`);
    }

    this.saveToStorage();
    return saved;
  }

  public async updateStudent(id: string, updateData: Partial<Student>) {
    const res = await apiService.updateStudent(id, updateData);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to update student record.');
    }

    const updated = res.student;
    const idx = this.state.students.findIndex((s) => s.id === id || s.studentId === id);
    if (idx >= 0 && updated) {
      this.state.students[idx] = updated;
    }
    this.logAudit(this.getUserName(), 'UPDATE_STUDENT', 'Students', `Updated student record "${id}".`);
    this.saveToStorage();
    return updated;
  }

  public async deleteStudent(id: string) {
    const target = this.state.students.find((s) => s.id === id || s.studentId === id);
    const targetName = target ? target.name : id;
    const targetId = target ? target.studentId : id;

    const res = await apiService.deleteStudent(id);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to delete student record.');
    }

    this.state.students = this.state.students.filter((s) => s.id !== id && s.studentId !== id);
    this.logAudit(this.getUserName(), 'DELETE_STUDENT', 'Students', `Deleted student record for "${targetName}" (${targetId}).`);
    this.saveToStorage();
    return true;
  }

  // Blog CMS
  public async saveBlogPost(postData: Partial<BlogPost> & { slug: string; title: string }) {
    const existingIndex = this.state.blogPosts.findIndex((b) => b.slug === postData.slug);
    const contentArray = Array.isArray(postData.content) 
      ? postData.content 
      : typeof postData.content === 'string' 
        ? [postData.content] 
        : ['Article content coming soon.'];

    let targetPost: BlogPost;
    if (existingIndex >= 0) {
      targetPost = { 
        ...this.state.blogPosts[existingIndex], 
        ...postData,
        content: contentArray
      } as BlogPost;
    } else {
      targetPost = {
        slug: postData.slug,
        title: postData.title,
        excerpt: postData.excerpt || 'Practical guidance and learning roadmap from SSCI Nellore.',
        content: contentArray,
        date: postData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        author: postData.author || 'SSCI Editorial Team',
        authorRole: postData.authorRole || 'Senior Instructor',
        readTime: postData.readTime || '5 min read',
        category: postData.category || 'Programming',
        tags: postData.tags || ['Computer Education', 'SSCI']
      };
    }

    const res = await apiService.saveBlogPost(targetPost);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to save blog post to database.');
    }

    const savedPost = res.post || targetPost;
    if (existingIndex >= 0) {
      this.state.blogPosts[existingIndex] = savedPost;
      this.logAudit(this.getUserName(), 'UPDATE_BLOG', 'Content', `Updated blog post "${postData.title}".`);
    } else {
      this.state.blogPosts.unshift(savedPost);
      this.logAudit(this.getUserName(), 'CREATE_BLOG', 'Content', `Published new blog post "${postData.title}".`);
    }
    this.saveToStorage();
    return savedPost;
  }

  public async deleteBlogPost(slug: string) {
    const res = await apiService.deleteBlogPost(slug);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to delete blog post from database.');
    }
    this.state.blogPosts = this.state.blogPosts.filter((b) => b.slug !== slug);
    this.logAudit(this.getUserName(), 'DELETE_BLOG', 'Content', `Deleted blog post "${slug}".`);
    this.saveToStorage();
    return res;
  }

  // Trainer CMS
  public async saveTrainer(trainerData: Partial<Trainer> & { id: string; name: string }) {
    let targetTrainer: Trainer;
    const existingIndex = this.state.trainers.findIndex((t) => t.id === trainerData.id);
    if (existingIndex >= 0) {
      targetTrainer = { ...this.state.trainers[existingIndex], ...trainerData } as Trainer;
    } else {
      targetTrainer = {
        id: trainerData.id,
        name: trainerData.name,
        designation: trainerData.designation || 'Senior Trainer',
        experience: trainerData.experience || '5+ Years',
        specialization: trainerData.specialization || ['Computer Education'],
        bio: trainerData.bio || 'Experienced trainer at Sri Shanmukha Computer Institute.',
        avatarText: trainerData.avatarText || trainerData.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
        gradient: trainerData.gradient || 'from-teal-600 to-emerald-600'
      };
    }

    const res = await apiService.saveTrainer(targetTrainer);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to save trainer to database.');
    }

    const savedTrainer = res.trainer || targetTrainer;
    if (existingIndex >= 0) {
      this.state.trainers[existingIndex] = savedTrainer;
      this.logAudit(this.getUserName(), 'UPDATE_TRAINER', 'Trainers', `Updated trainer "${trainerData.name}".`);
    } else {
      this.state.trainers.unshift(savedTrainer);
      this.logAudit(this.getUserName(), 'CREATE_TRAINER', 'Trainers', `Added new trainer "${trainerData.name}".`);
    }
    this.saveToStorage();
    return savedTrainer;
  }

  public async deleteTrainer(id: string) {
    const res = await apiService.deleteTrainer(id);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to delete trainer from database.');
    }
    this.state.trainers = this.state.trainers.filter((t) => t.id !== id);
    this.logAudit(this.getUserName(), 'DELETE_TRAINER', 'Trainers', `Deleted trainer "${id}".`);
    this.saveToStorage();
    return res;
  }

  // Certificate Issuer & Verifier
  public async issueCertificate(data: { studentName: string; courseName: string; issueDate?: string; grade?: string }): Promise<CertificateRecord> {
    const count = (this.state.certificates.length + 1025).toString();
    const certNum = `SSCI-2026-${count}`;
    const newCert: CertificateRecord = {
      certificateNumber: certNum,
      studentName: data.studentName,
      courseName: data.courseName,
      issueDate: data.issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      completionStatus: 'Successfully Completed with Distinction',
      grade: data.grade || 'Grade A+',
      verificationCode: `VERIFIED-OFFICIAL-${certNum}`,
      status: 'Valid'
    };

    const res = await apiService.issueCertificate(newCert);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to issue certificate on database.');
    }

    const savedCert = res.certificate || newCert;
    this.state.certificates.unshift(savedCert);
    this.logAudit(this.getUserName(), 'ISSUE_CERTIFICATE', 'Certificates', `Issued certificate ${certNum} to ${data.studentName}.`);
    this.saveToStorage();
    return savedCert;
  }

  public revokeCertificate(certNumber: string) {
    const cert = this.state.certificates.find((c) => c.certificateNumber === certNumber);
    if (cert) {
      cert.status = 'Revoked';
      this.logAudit(this.getUserName(), 'REVOKE_CERTIFICATE', 'Certificates', `Revoked certificate ${certNumber}.`);
      this.saveToStorage();
    }
  }

  public verifyCertificate(certNumber: string) {
    const cleaned = certNumber.trim().toUpperCase();
    const match = this.state.certificates.find((c) => c.certificateNumber === cleaned);
    if (match) {
      return {
        valid: match.status === 'Valid',
        certificateNumber: match.certificateNumber,
        studentName: match.studentName,
        courseName: match.courseName,
        issueDate: match.issueDate,
        completionStatus: match.status === 'Valid' ? match.completionStatus : 'Revoked / Inactive Certificate',
        grade: match.grade,
        verificationCode: match.verificationCode,
        errorMessage: match.status === 'Revoked' ? 'This certificate has been revoked by SSCI Administration.' : undefined
      };
    }
    return null;
  }

  // Hero & Floating Tech CMS
  public async updateHeroContent(data: Partial<HeroContent>) {
    const res = await apiService.updateHeroContent(data);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to update hero content on database.');
    }
    this.state.heroContent = res.hero || { ...this.state.heroContent, ...data };
    this.logAudit(this.getUserName(), 'UPDATE_HERO', 'Website', 'Updated homepage hero section text & CTAs.');
    this.saveToStorage();
    return res;
  }

  public async saveFloatingSkill(skill: FloatingSkill) {
    const res = await apiService.saveFloatingSkill(skill);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to save floating skill to database.');
    }
    const savedSkill = res.skill || skill;
    const idx = this.state.floatingSkills.findIndex((s) => s.id === skill.id);
    if (idx >= 0) {
      this.state.floatingSkills[idx] = savedSkill;
      this.logAudit(this.getUserName(), 'UPDATE_FLOATING_SKILL', 'Website', `Updated floating technology chip "${skill.name}".`);
    } else {
      this.state.floatingSkills.push(savedSkill);
      this.logAudit(this.getUserName(), 'CREATE_FLOATING_SKILL', 'Website', `Added new floating technology chip "${skill.name}".`);
    }
    this.saveToStorage();
    return savedSkill;
  }

  public async deleteFloatingSkill(id: string) {
    const res = await apiService.deleteFloatingSkill(id);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to delete floating skill from database.');
    }
    this.state.floatingSkills = this.state.floatingSkills.filter((s) => s.id !== id);
    this.logAudit(this.getUserName(), 'DELETE_FLOATING_SKILL', 'Website', `Removed floating skill chip "${id}".`);
    this.saveToStorage();
    return res;
  }

  // Site Settings CMS
  public async updateSettings(data: Partial<SiteSettings>) {
    const res = await apiService.updateSettings(data);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to update site settings on database.');
    }
    this.state.settings = res.settings || { ...this.state.settings, ...data };
    this.logAudit(this.getUserName(), 'UPDATE_SETTINGS', 'System', 'Updated institute NAP & centralized contact settings.');
    this.saveToStorage();
    return res;
  }

  public async updateAnnouncement(data: Partial<Announcement>) {
    const res = await apiService.updateAnnouncement(data);
    if (!res?.success) {
      throw new Error(res?.message || 'Failed to update announcement banner on database.');
    }
    this.state.announcement = res.announcement || { ...this.state.announcement, ...data };
    this.logAudit(this.getUserName(), 'UPDATE_ANNOUNCEMENT', 'Website', 'Updated announcement banner.');
    this.saveToStorage();
    return res;
  }

  // Audit Logs
  private logAudit(user: string, action: string, module: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      user,
      action,
      module,
      details,
      timestamp: new Date().toISOString()
    };
    this.state.auditLogs.unshift(log);
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 200);
    }
  }

  private getUserName() {
    return this.state.currentUser ? this.state.currentUser.name : 'Super Admin';
  }
}

export const cmsStore = new CMSStore();

