import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Sparkles,
  BookOpen,
  Calendar,
  Users,
  Clock,
  Award,
  Layers,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';
import { cmsStore, type Course, type CourseSchedule } from '../cmsStore';
import { apiService } from '../../services/api';
import { StudentSelector } from '../../components/common/StudentSelector';

const ALL_WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const AdminCourseEditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const isNew = !slug || slug === 'new';
  const existingCourse = !isNew ? cmsStore.getCourseBySlug(slug) : null;

  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    slug: '',
    categoryId: 'computer-essentials',
    categoryName: 'Computer Essentials',
    level: 'Beginner',
    duration: '30 Days',
    mode: 'Practical Lab',
    status: 'Active',
    price: 3500,
    minAttendancePercentage: 75,
    shortDescription: '',
    fullDescription: '',
    targetAudience: ['Students & job seekers'],
    learningOutcomes: ['Practical computer proficiency'],
    skillsLearned: ['Computer Skills'],
    tools: ['Windows OS', 'Software Tools'],
    modules: [
      {
        title: 'Module 1: Foundations & Setup',
        topics: ['Introduction & Setup', 'Basic Operations'],
        isRequired: true,
        hasAssessment: true,
        passingScore: 70,
      },
    ],
    schedule: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      dailyStartTime: '10:00',
      dailyEndTime: '12:00',
      sessionDurationMinutes: 120,
      holidays: [],
    },
    certificationName: 'Certificate in Computer Training',
    projects: ['Capstone Practical Exercise'],
    faqs: [
      { question: 'Do I need prior experience?', answer: 'No, training starts from absolute basics with practical lab practice.' }
    ]
  });

  // Bulk Student Enrollment during course creation
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [applicableFee, setApplicableFee] = useState<number>(3500);
  const [discount, setDiscount] = useState<number>(0);
  const [feeStatus, setFeeStatus] = useState<'Paid' | 'Partial' | 'Pending'>('Paid');
  const [enrollmentNotes, setEnrollmentNotes] = useState('');
  const [autoGenerateSessions, setAutoGenerateSessions] = useState(true);

  // Existing enrollments for this course (if editing)
  const [existingEnrolledIds, setExistingEnrolledIds] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<'basic' | 'schedule' | 'enrollment' | 'curriculum' | 'outcomes' | 'faqs' | 'seo'>('basic');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingCourse) {
      setFormData(existingCourse);
      if (existingCourse.price) {
        setApplicableFee(existingCourse.price);
      }
      // Load enrolled students
      apiService.getEnrollments({ courseSlug: existingCourse.slug }).then((res) => {
        if (res?.success && Array.isArray(res.enrollments)) {
          setExistingEnrolledIds(res.enrollments.map((e: any) => e.studentId));
        }
      });
    }
  }, [existingCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      setErrorMsg('Course title and slug are required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const courseToSave = {
        ...formData,
        price: Number(formData.price) || 0,
        minAttendancePercentage: Number(formData.minAttendancePercentage) || 75,
      } as Course;

      await cmsStore.saveCourse(courseToSave);

      // Auto-generate timetable sessions if requested
      if (autoGenerateSessions && courseToSave.schedule?.startDate && courseToSave.schedule?.endDate) {
        try {
          await apiService.generateSessions(courseToSave.slug);
        } catch (sesErr) {
          console.warn('Session generator error during save:', sesErr);
        }
      }

      // Bulk enroll selected existing students if any selected
      if (selectedStudentIds.length > 0) {
        try {
          await cmsStore.enrollStudents({
            courseSlug: courseToSave.slug,
            studentIds: selectedStudentIds,
            applicableFee: Math.max(0, applicableFee - discount),
            discount,
            feeStatus,
            notes: enrollmentNotes || 'Enrolled during course setup',
          });
        } catch (enrErr) {
          console.warn('Enrollment error during save:', enrErr);
        }
      }

      setSuccessMsg(`Course "${courseToSave.title}" saved successfully!`);
      setTimeout(() => {
        setSuccessMsg('');
        navigate(`/admin/courses/${courseToSave.slug}`);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save course to database.');
    } finally {
      setSaving(false);
    }
  };

  // Title to slug generator
  const handleTitleChange = (newTitle: string) => {
    const generatedSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: isNew ? generatedSlug : prev.slug || generatedSlug,
    }));
  };

  // Schedule helpers
  const toggleWeekday = (day: string) => {
    const currentDays = formData.schedule?.weekdays || [];
    const updated = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...(prev.schedule || {}),
        weekdays: updated,
      },
    }));
  };

  // Module helpers
  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [
        ...(prev.modules || []),
        {
          title: `Module ${(prev.modules?.length || 0) + 1}: New Topic`,
          topics: ['Practical Concept 1', 'Lab Exercise'],
          isRequired: true,
          hasAssessment: true,
          passingScore: 70,
        },
      ],
    }));
  };

  const removeModule = (mIdx: number) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules?.filter((_, idx) => idx !== mIdx),
    }));
  };

  const updateModuleField = (mIdx: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...(prev.modules || [])];
      updated[mIdx] = { ...updated[mIdx], [field]: value };
      return { ...prev, modules: updated };
    });
  };

  const addTopic = (mIdx: number) => {
    setFormData((prev) => {
      const updated = [...(prev.modules || [])];
      updated[mIdx].topics = [...updated[mIdx].topics, 'New Topic / Practical Task'];
      return { ...prev, modules: updated };
    });
  };

  const updateTopic = (mIdx: number, tIdx: number, val: string) => {
    setFormData((prev) => {
      const updated = [...(prev.modules || [])];
      updated[mIdx].topics[tIdx] = val;
      return { ...prev, modules: updated };
    });
  };

  const removeTopic = (mIdx: number, tIdx: number) => {
    setFormData((prev) => {
      const updated = [...(prev.modules || [])];
      updated[mIdx].topics = updated[mIdx].topics.filter((_, idx) => idx !== tIdx);
      return { ...prev, modules: updated };
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/courses')}
            className="p-2 rounded-xl bg-teal-50 text-[#087F78] hover:bg-teal-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#123B3A]">
              {isNew ? 'Create New Course' : `Edit Course: ${formData.title}`}
            </h1>
            <p className="text-xs text-gray-500">Configure schedule timetable, syllabus criteria, and add existing students</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="py-2.5 px-5 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Publish Course'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-[#12A77A] text-xs font-bold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2 border border-red-200">
          <Sparkles className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Editor Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { id: 'basic', label: 'Basic Info & Status' },
          { id: 'schedule', label: 'Timetable & Schedule' },
          { id: 'enrollment', label: `Add Existing Students (${selectedStudentIds.length})` },
          { id: 'curriculum', label: `Curriculum (${formData.modules?.length || 0})` },
          { id: 'outcomes', label: 'Outcomes & Skills' },
          { id: 'faqs', label: 'Course FAQs' },
          { id: 'seo', label: 'SEO Metadata' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#087F78] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-[#087F78]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-teal-100/70 shadow-2xs space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: BASIC INFO */}
        {/* ========================================================================= */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Course Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Python Programming"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#087F78]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">URL Slug</label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 bg-gray-50 focus:outline-none focus:border-[#087F78]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Category</label>
              <select
                value={formData.categoryId || 'computer-essentials'}
                onChange={(e) => {
                  const catMap: Record<string, string> = {
                    'computer-essentials': 'Computer Essentials',
                    'programming-languages': 'Programming Languages',
                    'web-development': 'Web Development',
                    'database-analytics': 'Data & Analytics',
                  };
                  setFormData({
                    ...formData,
                    categoryId: e.target.value,
                    categoryName: catMap[e.target.value] || 'Computer Essentials',
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#123B3A] bg-white"
              >
                <option value="computer-essentials">Computer Essentials</option>
                <option value="programming-languages">Programming Languages</option>
                <option value="web-development">Web Development</option>
                <option value="database-analytics">Data & Analytics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Course Status</label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#123B3A] bg-white"
              >
                <option value="Active">Active (Open for Admissions)</option>
                <option value="Draft">Draft (Internal Only)</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Standard Course Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.price ?? 3500}
                onChange={(e) => {
                  const p = Number(e.target.value);
                  setFormData({ ...formData, price: p });
                  setApplicableFee(p);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">
                Min Attendance Required for Certificate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.minAttendancePercentage ?? 75}
                onChange={(e) => setFormData({ ...formData, minAttendancePercentage: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Level</label>
              <select
                value={formData.level || 'Beginner'}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#123B3A] bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Duration</label>
              <input
                type="text"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 45 Days (1.5 Hours/day)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Short Description</label>
              <textarea
                rows={2}
                value={formData.shortDescription || ''}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#087F78]"
                placeholder="Brief summary for course cards..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Full Overview</label>
              <textarea
                rows={4}
                value={formData.fullDescription || ''}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#087F78]"
                placeholder="Comprehensive course description..."
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SCHEDULE & TIMETABLE */}
        {/* ========================================================================= */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  Timetable Schedule Configuration
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  The schedule engine will generate individual session dates between start and end dates, skipping non-teaching days and holidays.
                </p>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoGenerateSessions}
                  onChange={(e) => setAutoGenerateSessions(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                Auto-generate sessions on save
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Batch Start Date</label>
                <input
                  type="date"
                  value={formData.schedule?.startDate || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: { ...(prev.schedule || {}), startDate: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Batch End Date</label>
                <input
                  type="date"
                  value={formData.schedule?.endDate || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: { ...(prev.schedule || {}), endDate: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Daily Start Time</label>
                <input
                  type="time"
                  value={formData.schedule?.dailyStartTime || '10:00'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: { ...(prev.schedule || {}), dailyStartTime: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Daily End Time</label>
                <input
                  type="time"
                  value={formData.schedule?.dailyEndTime || '12:00'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: { ...(prev.schedule || {}), dailyEndTime: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl font-semibold"
                />
              </div>
            </div>

            {/* Teaching Weekdays Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Teaching Weekdays</label>
              <div className="flex flex-wrap gap-2">
                {ALL_WEEKDAYS.map((day) => {
                  const isChecked = (formData.schedule?.weekdays || []).includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleWeekday(day)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                        isChecked
                          ? 'bg-primary-600 text-white border-primary-600 shadow-2xs'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ADD EXISTING STUDENTS */}
        {/* ========================================================================= */}
        {activeTab === 'enrollment' && (
          <div className="space-y-6">
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary-600" />
                  Add Existing Students to this Course
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select students from your central directory. When you save this course, all selected students will be enrolled automatically.
                </p>
              </div>
              <span className="text-xs font-bold text-primary-700 bg-white px-3 py-1 rounded-full border border-primary-200">
                {selectedStudentIds.length} Selected
              </span>
            </div>

            {/* Student Selector Component */}
            <StudentSelector
              selectedStudentIds={selectedStudentIds}
              onChange={setSelectedStudentIds}
              alreadyEnrolledStudentIds={existingEnrolledIds}
              multiple={true}
              label="Select Students for Bulk Enrollment"
              helperText="Search by student name, phone, or SSCI ID."
            />

            {/* Enrollment Fee Settings */}
            <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Fee & Payment Terms for Selected Students</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-2xs font-semibold text-gray-600 mb-1">Base Course Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={applicableFee}
                    onChange={(e) => setApplicableFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-semibold text-gray-600 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-semibold text-gray-600 mb-1">Net Payable Fee (₹)</label>
                  <div className="w-full px-3 py-2 text-xs bg-gray-100 border border-gray-200 rounded-lg font-black text-gray-900">
                    ₹{Math.max(0, applicableFee - discount).toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-semibold text-gray-600 mb-1">Payment Status</label>
                  <select
                    value={feeStatus}
                    onChange={(e) => setFeeStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-2xs font-semibold text-gray-600 mb-1">Enrollment Notes</label>
                <input
                  type="text"
                  value={enrollmentNotes}
                  onChange={(e) => setEnrollmentNotes(e.target.value)}
                  placeholder="e.g. Admitted via campus referral"
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg font-normal"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CURRICULUM BUILDER */}
        {/* ========================================================================= */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#123B3A]">Modules & Lesson Topics</h3>
                <p className="text-xs text-gray-500">Configure syllabus modules, assessment rules, and passing thresholds</p>
              </div>
              <button
                type="button"
                onClick={addModule}
                className="py-2 px-3.5 rounded-xl bg-teal-50 text-[#087F78] hover:bg-teal-100 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Module</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.modules?.map((mod, mIdx) => (
                <div key={mIdx} className="p-4 rounded-xl border border-teal-100 bg-teal-50/20 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => updateModuleField(mIdx, 'title', e.target.value)}
                      className="w-full sm:w-2/3 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#123B3A]"
                      placeholder="Module Title"
                    />

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mod.isRequired !== false}
                          onChange={(e) => updateModuleField(mIdx, 'isRequired', e.target.checked)}
                          className="rounded text-primary-600"
                        />
                        Required
                      </label>

                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mod.hasAssessment !== false}
                          onChange={(e) => updateModuleField(mIdx, 'hasAssessment', e.target.checked)}
                          className="rounded text-primary-600"
                        />
                        Assessment
                      </label>

                      <button
                        type="button"
                        onClick={() => removeModule(mIdx)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        title="Remove Module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="pl-4 border-l-2 border-teal-200 space-y-2">
                    {mod.topics.map((topic: string, tIdx: number) => (
                      <div key={tIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => updateTopic(mIdx, tIdx, e.target.value)}
                          className="w-full px-3 py-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeTopic(mIdx, tIdx)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addTopic(mIdx)}
                      className="text-xs font-bold text-[#087F78] hover:underline flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Lesson Topic</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: OUTCOMES & SKILLS */}
        {/* ========================================================================= */}
        {activeTab === 'outcomes' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">
                Target Audience (comma-separated)
              </label>
              <input
                type="text"
                value={formData.targetAudience?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetAudience: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">
                Skills Learned (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skillsLearned?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skillsLearned: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">
                Tools & Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tools?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: FAQS */}
        {/* ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Course FAQs</h3>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    faqs: [...(prev.faqs || []), { question: 'New Question', answer: 'Answer here...' }],
                  }))
                }
                className="py-1.5 px-3 rounded-lg bg-teal-50 text-[#087F78] text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>

            {formData.faqs?.map((faq, fIdx) => (
              <div key={fIdx} className="p-3.5 rounded-xl border border-gray-200 space-y-2 bg-gray-50/50">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const updated = [...(formData.faqs || [])];
                    updated[fIdx].question = e.target.value;
                    setFormData({ ...formData, faqs: updated });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                  placeholder="Question"
                />
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...(formData.faqs || [])];
                    updated[fIdx].answer = e.target.value;
                    setFormData({ ...formData, faqs: updated });
                  }}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-xs font-normal"
                  placeholder="Answer"
                />
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SEO & CERTIFICATE */}
        {/* ========================================================================= */}
        {activeTab === 'seo' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Google Search Preview</span>
              <h4 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer">
                {formData.title || 'Course Title'} Course in Nellore | SSCI
              </h4>
              <p className="text-xs text-emerald-700 font-medium">https://sscomputer.in/courses/{formData.slug || 'course-slug'}</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {formData.shortDescription || 'Sri Shanmukha Computer Institute offers practical computer and programming training in Nellore.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Official Certificate Name</label>
              <input
                type="text"
                value={formData.certificationName || ''}
                onChange={(e) => setFormData({ ...formData, certificationName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/courses')}
            className="py-2.5 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-5 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Course...' : 'Save & Publish Course'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
