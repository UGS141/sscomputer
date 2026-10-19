import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Download,
  Award,
  Search,
  Filter,
  ExternalLink,
  Loader2,
  UserCheck,
  Check,
  X,
  History,
  FileSpreadsheet
} from 'lucide-react';
import { cmsStore, type Course, type Enrollment, type CourseSession, type AttendanceRecord } from '../cmsStore';
import { apiService } from '../../services/api';
import { AttendancePercentage } from '../../components/common/AttendancePercentage';
import { ModuleProgressIndicator } from '../../components/common/ModuleProgressIndicator';
import { EnrollmentDialog } from '../../components/common/EnrollmentDialog';

export const AdminCourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'schedule' | 'attendance' | 'progress' | 'completion'>('students');

  // Dialog & Modal states
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [withdrawModalEnrollment, setWithdrawModalEnrollment] = useState<Enrollment | null>(null);
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [selectedStudentForProgress, setSelectedStudentForProgress] = useState<string | null>(null);
  const [moduleProgressList, setModuleProgressList] = useState<any[]>([]);

  // Attendance Register states
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, { status: string; remarks: string }>>({});
  const [attendanceSaving, setAttendanceSaving] = useState(false);

  // Loading & notification states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Student search & filter
  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadCourseData = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      // Fetch course from store or API
      let currentCourse = cmsStore.getCourseBySlug(slug);
      if (!currentCourse) {
        const cRes = await apiService.getCourseBySlug(slug);
        if (cRes?.course) currentCourse = cRes.course;
      }
      setCourse(currentCourse || null);

      // Fetch enrollments
      const enrRes = await apiService.getEnrollments({ courseSlug: slug });
      if (enrRes?.success && Array.isArray(enrRes.enrollments)) {
        setEnrollments(enrRes.enrollments);
      }

      // Fetch sessions
      const sesRes = await apiService.getCourseSessions(slug);
      if (sesRes?.success && Array.isArray(sesRes.sessions)) {
        setSessions(sesRes.sessions);
        if (sesRes.sessions.length > 0 && !selectedSessionId) {
          // Select most relevant session (first scheduled or recent)
          const today = new Date().toISOString().split('T')[0];
          const upcoming = sesRes.sessions.find((s: CourseSession) => s.date >= today);
          setSelectedSessionId(upcoming ? upcoming.id : sesRes.sessions[0].id);
        }
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'Error loading course details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, [slug]);

  // Load attendance records when selectedSessionId changes
  useEffect(() => {
    const loadSessionAttendance = async () => {
      if (!slug || !selectedSessionId) return;
      try {
        const res = await apiService.getCourseAttendance(slug, { sessionId: selectedSessionId });
        const existingRecords: AttendanceRecord[] = res?.attendance || [];
        const existingMap: Record<string, { status: string; remarks: string }> = {};

        existingRecords.forEach((r) => {
          existingMap[r.enrollmentId] = {
            status: r.status,
            remarks: r.remarks || '',
          };
        });

        // Initialize draft for all active enrollments
        const initialDraft: Record<string, { status: string; remarks: string }> = {};
        enrollments.forEach((e) => {
          if (existingMap[e.id]) {
            initialDraft[e.id] = existingMap[e.id];
          } else {
            initialDraft[e.id] = { status: 'Not Marked', remarks: '' };
          }
        });

        setAttendanceDraft(initialDraft);
      } catch (err) {
        console.warn('Error fetching session attendance:', err);
      }
    };

    if (selectedSessionId && enrollments.length > 0) {
      loadSessionAttendance();
    }
  }, [selectedSessionId, enrollments, slug]);

  // Load module progress when student selected
  useEffect(() => {
    const loadStudentProgress = async () => {
      if (!selectedStudentForProgress) return;
      try {
        const res = await apiService.getEnrollmentProgress(selectedStudentForProgress);
        if (res?.success && Array.isArray(res.progressRecords)) {
          setModuleProgressList(res.progressRecords);
        }
      } catch (err) {
        console.warn('Error fetching module progress:', err);
      }
    };

    if (selectedStudentForProgress) {
      loadStudentProgress();
    }
  }, [selectedStudentForProgress]);

  // Computed metrics
  const activeEnrollments = useMemo(() => enrollments.filter((e) => e.status === 'Active'), [enrollments]);
  const completedEnrollments = useMemo(() => enrollments.filter((e) => e.status === 'Completed'), [enrollments]);
  const conductedSessions = useMemo(
    () => sessions.filter((s) => s.status === 'Completed' || s.attendanceFinalized),
    [sessions]
  );
  const avgAttendance = useMemo(() => {
    if (activeEnrollments.length === 0) return 0;
    const total = activeEnrollments.reduce((sum, e) => sum + (e.attendancePercentage || 0), 0);
    return Math.round(total / activeEnrollments.length);
  }, [activeEnrollments]);

  // Filtered enrollments for table
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e) => {
      const q = studentSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        e.studentName.toLowerCase().includes(q) ||
        e.studentId.toLowerCase().includes(q) ||
        (e.studentPhone && e.studentPhone.toLowerCase().includes(q)) ||
        (e.studentEmail && e.studentEmail.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enrollments, studentSearch, statusFilter]);

  // Generate sessions action
  const handleGenerateSessions = async () => {
    if (!course) return;
    setActionLoading(true);
    try {
      const res = await apiService.generateSessions(course.slug);
      if (res?.success) {
        showNotification('success', res.message || `Successfully generated timetable sessions.`);
        await loadCourseData();
      } else {
        showNotification('error', res?.message || 'Could not generate sessions.');
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'Error executing session generator.');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Attendance action
  const handleSaveAttendance = async () => {
    if (!slug || !selectedSessionId) return;
    setAttendanceSaving(true);
    try {
      const attendanceList = Object.entries(attendanceDraft).map(([enrollmentId, data]) => ({
        enrollmentId,
        status: data.status,
        remarks: data.remarks,
      }));

      const res = await apiService.markAttendance(slug, {
        sessionId: selectedSessionId,
        attendanceList,
      });

      if (res?.success) {
        showNotification('success', res.message || 'Attendance saved and percentages recalculated.');
        await loadCourseData();
      } else {
        showNotification('error', res?.message || 'Failed to save attendance.');
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'Error recording attendance.');
    } finally {
      setAttendanceSaving(false);
    }
  };

  // Bulk mark all present
  const handleMarkAll = (status: 'Present' | 'Absent' | 'Not Marked') => {
    const updated = { ...attendanceDraft };
    enrollments.forEach((e) => {
      if (e.status === 'Active') {
        updated[e.id] = {
          status,
          remarks: updated[e.id]?.remarks || '',
        };
      }
    });
    setAttendanceDraft(updated);
  };

  // Update single module progress
  const handleUpdateModule = async (moduleIndex: number, status: string, assessmentScore?: number) => {
    if (!selectedStudentForProgress) return;
    try {
      const passingScore = course?.modules?.[moduleIndex]?.passingScore || 70;
      const passed = assessmentScore !== undefined ? assessmentScore >= passingScore : undefined;

      const res = await apiService.updateModuleProgress(selectedStudentForProgress, moduleIndex, {
        status,
        assessmentScore,
        assessmentPassed: passed,
      });

      if (res?.success) {
        showNotification('success', `Module #${moduleIndex + 1} updated successfully.`);
        // Reload progress
        const pRes = await apiService.getEnrollmentProgress(selectedStudentForProgress);
        if (pRes?.success) setModuleProgressList(pRes.progressRecords);
        await loadCourseData();
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'Error updating module.');
    }
  };

  // Withdraw student action
  const handleConfirmWithdraw = async () => {
    if (!withdrawModalEnrollment) return;
    try {
      await apiService.updateEnrollmentStatus(
        withdrawModalEnrollment.id,
        'Withdrawn',
        withdrawalReason || 'Student withdrawn'
      );
      showNotification('success', `Student ${withdrawModalEnrollment.studentName} marked as Withdrawn.`);
      setWithdrawModalEnrollment(null);
      setWithdrawalReason('');
      await loadCourseData();
    } catch (err: any) {
      showNotification('error', err?.message || 'Failed to withdraw student.');
    }
  };

  // Complete/Graduate student action
  const handleCompleteEnrollment = async (enrollmentId: string, force = false) => {
    try {
      const res = await apiService.completeEnrollment(enrollmentId, force);
      if (res?.success) {
        showNotification('success', res.message || 'Course marked as Completed for student!');
        await loadCourseData();
      } else {
        showNotification('error', res?.message || 'Completion criteria not met.');
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'Error completing course.');
    }
  };

  // CSV Export for attendance & completion
  const handleExportCSV = () => {
    if (enrollments.length === 0) return;
    const headers = [
      'Enrollment ID',
      'Student ID',
      'Student Name',
      'Phone',
      'Email',
      'Status',
      'Attendance Percentage',
      'Learning Progress Percentage',
      'Fee Status',
      'Applicable Fee',
    ];
    const rows = enrollments.map((e) => [
      e.id,
      e.studentId,
      `"${e.studentName.replace(/"/g, '""')}"`,
      e.studentPhone || '',
      e.studentEmail || '',
      e.status,
      `${e.attendancePercentage || 0}%`,
      `${e.learningProgressPercentage || 0}%`,
      e.feeStatus,
      e.applicableFee || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${course?.slug || 'course'}-academic-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !course) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mb-3" />
        <p className="text-sm font-medium">Loading course academic management...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white rounded-xl p-8 text-center max-w-md mx-auto my-12 border border-gray-200">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-900">Course Not Found</h2>
        <p className="text-sm text-gray-500 mt-1">
          The requested course "{slug}" does not exist in the catalog.
        </p>
        <button
          onClick={() => navigate('/admin/courses')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-medium max-w-md animate-in slide-in-from-bottom-5 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Course Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <button
              onClick={() => navigate('/admin/courses')}
              className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors shrink-0 mt-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-200">
                  {course.categoryName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {course.status || 'Active'}
                </span>
                <span className="text-xs text-gray-400 font-mono">/courses/{course.slug}</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900">{course.title}</h1>
              <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Duration: {course.duration}
                </span>
                <span>•</span>
                <span>Mode: {course.mode}</span>
                <span>•</span>
                <span>Min Attendance: {course.minAttendancePercentage || 75}%</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsEnrollDialogOpen(true)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Enroll Students</span>
            </button>
            <button
              onClick={() => navigate(`/admin/courses/edit/${course.slug}`)}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Catalog</span>
            </button>
            <a
              href={`/courses/${course.slug}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs transition-colors"
              title="View Public Course Page"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
            <span className="text-2xs font-semibold text-gray-500 uppercase tracking-wider block">Total Enrolled</span>
            <span className="text-xl font-black text-gray-900 mt-0.5 block">{enrollments.length}</span>
            <span className="text-2xs text-gray-400">{activeEnrollments.length} Active</span>
          </div>

          <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
            <span className="text-2xs font-semibold text-gray-500 uppercase tracking-wider block">Sessions</span>
            <span className="text-xl font-black text-gray-900 mt-0.5 block">{sessions.length}</span>
            <span className="text-2xs text-gray-400">{conductedSessions.length} Conducted</span>
          </div>

          <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
            <span className="text-2xs font-semibold text-gray-500 uppercase tracking-wider block">Avg Attendance</span>
            <div className="mt-1">
              <AttendancePercentage percentage={avgAttendance} size="sm" minRequired={course.minAttendancePercentage || 75} />
            </div>
          </div>

          <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
            <span className="text-2xs font-semibold text-gray-500 uppercase tracking-wider block">Modules</span>
            <span className="text-xl font-black text-gray-900 mt-0.5 block">{course.modules?.length || 0}</span>
            <span className="text-2xs text-gray-400">In Syllabus</span>
          </div>

          <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
            <span className="text-2xs font-semibold text-gray-500 uppercase tracking-wider block">Graduated</span>
            <span className="text-xl font-black text-emerald-700 mt-0.5 block">{completedEnrollments.length}</span>
            <span className="text-2xs text-emerald-600 font-medium">Completed</span>
          </div>

          <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
            <span className="text-2xs font-semibold text-gray-500 uppercase tracking-wider block">Standard Fee</span>
            <span className="text-xl font-black text-gray-900 mt-0.5 block">
              ₹{(course.price || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-2xs text-gray-400">Per Student</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-gray-200 bg-white px-4 rounded-xl shadow-2xs gap-1 overflow-x-auto">
        {[
          { id: 'students', label: `Enrolled Students (${enrollments.length})`, icon: Users },
          { id: 'schedule', label: `Schedule & Sessions (${sessions.length})`, icon: Calendar },
          { id: 'attendance', label: 'Attendance Register', icon: UserCheck },
          { id: 'progress', label: 'Syllabus & Progress', icon: BookOpen },
          { id: 'completion', label: 'Completion & Reports', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-primary-600 text-primary-700 font-extrabold'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ENROLLED STUDENTS */}
      {/* ========================================================================= */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search enrolled students by name, ID, phone..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Withdrawn">Withdrawn</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setIsEnrollDialogOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Existing Students</span>
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-2xs">
                    <th className="py-3 px-4">Student Profile</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Enrolled On</th>
                    <th className="py-3 px-4">Fee Details</th>
                    <th className="py-3 px-4">Attendance %</th>
                    <th className="py-3 px-4">Syllabus Progress</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {filteredEnrollments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        No enrolled students found. Use "Add Existing Students" to enroll students.
                      </td>
                    </tr>
                  ) : (
                    filteredEnrollments.map((enr) => (
                      <tr key={enr.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{enr.studentName}</div>
                          <div className="text-2xs text-gray-400 font-mono">{enr.studentId}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>{enr.studentPhone || '—'}</div>
                          <div className="text-2xs text-gray-400">{enr.studentEmail || '—'}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                          {enr.enrollmentDate ? new Date(enr.enrollmentDate).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">
                            ₹{(enr.applicableFee || 0).toLocaleString('en-IN')}
                          </div>
                          <span
                            className={`inline-block px-1.5 py-0.2 rounded text-2xs font-semibold ${
                              enr.feeStatus === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {enr.feeStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <AttendancePercentage
                            percentage={enr.attendancePercentage || 0}
                            size="sm"
                            minRequired={course.minAttendancePercentage || 75}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <ModuleProgressIndicator
                            progressPercentage={enr.learningProgressPercentage || 0}
                            size="sm"
                            showBar={true}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold ${
                              enr.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : enr.status === 'Completed'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : enr.status === 'Withdrawn'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {enr.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedStudentForProgress(enr.id);
                                setActiveTab('progress');
                              }}
                              className="px-2 py-1 text-2xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                              title="View and update syllabus progress"
                            >
                              Progress
                            </button>
                            {enr.status === 'Active' && (
                              <>
                                <button
                                  onClick={() => handleCompleteEnrollment(enr.id, false)}
                                  className="px-2 py-1 text-2xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md transition-colors"
                                  title="Evaluate & Graduate Student"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => setWithdrawModalEnrollment(enr)}
                                  className="px-2 py-1 text-2xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md transition-colors"
                                  title="Withdraw from Course"
                                >
                                  Withdraw
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SCHEDULE & SESSIONS */}
      {/* ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
          {/* Timetable Configuration Summary & Session Generator Toolbar */}
          <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-600" />
                Timetable Schedule Engine
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Dates: <span className="font-semibold">{course.schedule?.startDate || 'Not configured'}</span> to{' '}
                <span className="font-semibold">{course.schedule?.endDate || 'Not configured'}</span> • Weekdays:{' '}
                <span className="font-semibold">{(course.schedule?.weekdays || ['Mon-Fri']).join(', ')}</span> • Time:{' '}
                <span className="font-semibold">
                  {course.schedule?.dailyStartTime || '10:00'} - {course.schedule?.dailyEndTime || '12:00'}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleGenerateSessions}
                disabled={actionLoading}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>Generate Scheduled Sessions</span>
              </button>
            </div>
          </div>

          {/* Sessions List Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-2xs">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Session Topic</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        No sessions generated yet. Configure schedule dates and click "Generate Scheduled Sessions".
                      </td>
                    </tr>
                  ) : (
                    sessions.map((ses) => (
                      <tr key={ses.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-500">#{ses.sessionNumber}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">{ses.date}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                          {ses.startTime} - {ses.endTime}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{ses.title}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold ${
                              ses.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : ses.status === 'Cancelled'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {ses.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {ses.attendanceFinalized ? (
                            <span className="inline-flex items-center gap-1 text-2xs text-emerald-600 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Marked
                            </span>
                          ) : (
                            <span className="text-2xs text-amber-600 font-medium">Pending</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedSessionId(ses.id);
                              setActiveTab('attendance');
                            }}
                            className="px-2.5 py-1 text-2xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors"
                          >
                            Mark Attendance
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ATTENDANCE REGISTER */}
      {/* ========================================================================= */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs space-y-5">
          {/* Session Selector Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex-1 max-w-md">
              <label className="block text-2xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Select Session to Mark Attendance
              </label>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    Session #{s.sessionNumber} ({s.date}) — {s.title} [{s.attendanceFinalized ? 'Marked' : 'Pending'}]
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleMarkAll('Present')}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('Absent')}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
              >
                Mark All Absent
              </button>
              <button
                type="button"
                onClick={handleSaveAttendance}
                disabled={attendanceSaving || !selectedSessionId}
                className="px-5 py-2 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {attendanceSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Save Attendance Register</span>
              </button>
            </div>
          </div>

          {/* Session Info Bar */}
          {selectedSession && (
            <div className="flex items-center justify-between text-xs text-gray-600 px-2">
              <div>
                Session #{selectedSession.sessionNumber}:{' '}
                <span className="font-semibold text-gray-900">{selectedSession.title}</span> on{' '}
                <span className="font-semibold text-gray-900">{selectedSession.date}</span> ({selectedSession.startTime} -{' '}
                {selectedSession.endTime})
              </div>
              <div>
                Conduct Status:{' '}
                <span className="font-bold text-gray-900">{selectedSession.status}</span>
              </div>
            </div>
          )}

          {/* Attendance Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-2xs">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Overall Attendance %</th>
                    <th className="py-3 px-4">Attendance Status</th>
                    <th className="py-3 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {enrollments.filter((e) => e.status !== 'Withdrawn').length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No active enrolled students to mark attendance for.
                      </td>
                    </tr>
                  ) : (
                    enrollments
                      .filter((e) => e.status !== 'Withdrawn')
                      .map((enr) => {
                        const current = attendanceDraft[enr.id] || { status: 'Not Marked', remarks: '' };
                        return (
                          <tr key={enr.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-gray-900">{enr.studentName}</div>
                              <div className="text-2xs text-gray-400 font-mono">{enr.studentId}</div>
                            </td>
                            <td className="py-3 px-4">
                              <AttendancePercentage
                                percentage={enr.attendancePercentage || 0}
                                size="sm"
                                minRequired={course.minAttendancePercentage || 75}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {(['Present', 'Late', 'Absent', 'Excused', 'Not Marked'] as const).map((st) => {
                                  const isSelected = current.status === st;
                                  const colorMap = {
                                    Present: isSelected
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
                                    Late: isSelected
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100',
                                    Absent: isSelected
                                      ? 'bg-rose-600 text-white'
                                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100',
                                    Excused: isSelected
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                                    'Not Marked': isSelected
                                      ? 'bg-gray-600 text-white'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                                  };

                                  return (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() =>
                                        setAttendanceDraft((prev) => ({
                                          ...prev,
                                          [enr.id]: {
                                            status: st,
                                            remarks: prev[enr.id]?.remarks || '',
                                          },
                                        }))
                                      }
                                      className={`px-2.5 py-1 rounded-md text-2xs font-bold transition-colors ${colorMap[st]}`}
                                    >
                                      {st}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="text"
                                value={current.remarks}
                                onChange={(e) =>
                                  setAttendanceDraft((prev) => ({
                                    ...prev,
                                    [enr.id]: {
                                      status: prev[enr.id]?.status || 'Not Marked',
                                      remarks: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="Remarks / correction note..."
                                className="w-full px-2.5 py-1 text-xs bg-white border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-primary-500 font-normal"
                              />
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SYLLABUS & LEARNING PROGRESS */}
      {/* ========================================================================= */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
          {/* Student Selector */}
          <div className="max-w-md">
            <label className="block text-2xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Select Enrolled Student to Track Syllabus Progress
            </label>
            <select
              value={selectedStudentForProgress || ''}
              onChange={(e) => setSelectedStudentForProgress(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:bg-white"
            >
              <option value="">-- Choose Enrolled Student --</option>
              {enrollments.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.studentName} ({e.studentId}) — {e.learningProgressPercentage || 0}% Completed
                </option>
              ))}
            </select>
          </div>

          {selectedStudentForProgress ? (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                {(course.modules || []).map((mod, idx) => {
                  const record = moduleProgressList.find((r) => r.moduleIndex === idx);
                  const currentStatus = record?.status || 'Not Started';
                  const currentScore = record?.assessmentScore ?? '';
                  const hasAssessment = mod.hasAssessment !== false;

                  return (
                    <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-xs">Module {idx + 1}: {mod.title}</span>
                          {mod.isRequired !== false ? (
                            <span className="px-1.5 py-0.2 rounded text-2xs font-semibold bg-rose-50 text-rose-700">
                              Required
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-2xs font-semibold bg-gray-100 text-gray-600">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-2xs text-gray-500 mt-1">
                          Topics: {mod.topics?.join(' • ') || 'Comprehensive curriculum topics'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleUpdateModule(idx, e.target.value, typeof currentScore === 'number' ? currentScore : undefined)}
                          className="px-2.5 py-1 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-md outline-none"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Needs Revision">Needs Revision</option>
                        </select>

                        {hasAssessment && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-2xs font-semibold text-gray-500">Score:</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              defaultValue={currentScore}
                              onBlur={(e) => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                handleUpdateModule(idx, currentStatus, val);
                              }}
                              placeholder="0-100"
                              className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-md outline-none text-center font-bold"
                            />
                            <span className="text-2xs text-gray-400">/ 100</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              Please select an enrolled student above to view and evaluate their module completion status.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: COMPLETION & REPORTS */}
      {/* ========================================================================= */}
      {activeTab === 'completion' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs space-y-6">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Dual Course Completion Policy
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              To be eligible for graduation and certificate issuance, students must meet BOTH requirements:
              <br />
              1. Minimum Attendance: <span className="font-bold text-gray-900">{course.minAttendancePercentage || 75}%</span>
              <br />
              2. 100% of required syllabus modules completed with assessments passed.
            </p>
          </div>

          {/* Student Completion Roster */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-2xs">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Attendance Check</th>
                    <th className="py-3 px-4">Syllabus Check</th>
                    <th className="py-3 px-4">Eligibility Status</th>
                    <th className="py-3 px-4 text-right">Graduation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {enrollments.map((enr) => {
                    const minAtt = course.minAttendancePercentage || 75;
                    const attMet = (enr.attendancePercentage || 0) >= minAtt;
                    const progMet = (enr.learningProgressPercentage || 0) >= 100;
                    const eligible = attMet && progMet;
                    const isCompleted = enr.status === 'Completed';

                    return (
                      <tr key={enr.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{enr.studentName}</div>
                          <div className="text-2xs text-gray-400 font-mono">{enr.studentId}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {attMet ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <X className="w-4 h-4 text-rose-500" />
                            )}
                            <span>{enr.attendancePercentage || 0}% (Min: {minAtt}%)</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {progMet ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <X className="w-4 h-4 text-amber-500" />
                            )}
                            <span>{enr.learningProgressPercentage || 0}% Syllabus</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isCompleted ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              Graduated
                            </span>
                          ) : eligible ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Eligible for Completion
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-gray-100 text-gray-600">
                              Requirements Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {isCompleted ? (
                            <span className="text-xs text-gray-400 font-medium">Completed</span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleCompleteEnrollment(enr.id, false)}
                                disabled={!eligible}
                                className="px-3 py-1 text-2xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors disabled:opacity-40"
                              >
                                Graduate
                              </button>
                              {!eligible && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Force complete course for ${enr.studentName} despite incomplete attendance/syllabus?`)) {
                                      handleCompleteEnrollment(enr.id, true);
                                    }
                                  }}
                                  className="px-2 py-1 text-2xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                                  title="Admin override to force complete"
                                >
                                  Override
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Dialog Modal */}
      {isEnrollDialogOpen && course && (
        <EnrollmentDialog
          course={course}
          isOpen={isEnrollDialogOpen}
          onClose={() => setIsEnrollDialogOpen(false)}
          onSuccess={() => {
            loadCourseData();
            showNotification('success', 'Student enrollment updated successfully.');
          }}
          alreadyEnrolledStudentIds={enrollments.map((e) => e.studentId)}
        />
      )}

      {/* Withdrawal Confirmation Modal */}
      {withdrawModalEnrollment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 animate-in fade-in-50 duration-200">
            <h3 className="text-base font-bold text-gray-900">Withdraw Student from Course</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to withdraw{' '}
              <span className="font-semibold text-gray-900">{withdrawModalEnrollment.studentName}</span> from{' '}
              <span className="font-semibold text-gray-900">{course.title}</span>?
              Their central student profile will be preserved, but enrollment status will be marked "Withdrawn".
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for Withdrawal</label>
              <input
                type="text"
                value={withdrawalReason}
                onChange={(e) => setWithdrawalReason(e.target.value)}
                placeholder="e.g. Schedule clash, relocated"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setWithdrawModalEnrollment(null)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdraw}
                className="px-4 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
