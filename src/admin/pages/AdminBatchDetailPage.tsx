import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Plus,
  RefreshCw,
  Edit,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  MapPin,
  Check,
  UserCheck,
  Award,
  Search,
  Filter,
  FileText
} from 'lucide-react';
import { cmsStore, type Batch, type Course, type Enrollment, type CourseSession } from '../cmsStore';
import { apiService } from '../../services/api';
import { AttendancePercentage } from '../../components/common/AttendancePercentage';
import { ModuleProgressIndicator } from '../../components/common/ModuleProgressIndicator';
import { EnrollmentDialog } from '../../components/common/EnrollmentDialog';

export const AdminBatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<Batch | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [otherBatches, setOtherBatches] = useState<Batch[]>([]);

  const [activeTab, setActiveTab] = useState<'students' | 'timetable' | 'attendance' | 'syllabus'>('students');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isEditBatchOpen, setIsEditBatchOpen] = useState(false);
  const [transferModalEnrollment, setTransferModalEnrollment] = useState<Enrollment | null>(null);
  const [targetBatchId, setTargetBatchId] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [transferEffectiveDate, setTransferEffectiveDate] = useState(new Date().toISOString().slice(0, 10));

  // Edit Batch Form state
  const [batchFormData, setBatchFormData] = useState<Partial<Batch>>({});

  // Student search & filter
  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Attendance Register states
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, { status: string; remarks: string }>>({});
  const [attendanceSaving, setAttendanceSaving] = useState(false);

  // Load batch data
  const loadBatchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await apiService.getBatchById(id);
      if (res?.success && res.batch) {
        setBatch(res.batch);
        setCourse(res.course || null);
        setEnrollments(res.enrollments || []);
        setSessions(res.sessions || []);
        setBatchFormData(res.batch);

        if (res.sessions && res.sessions.length > 0) {
          const today = new Date().toISOString().slice(0, 10);
          const defaultSession = res.sessions.find((s: CourseSession) => s.date === today) || res.sessions[0];
          setSelectedSessionId(defaultSession.id);
        }

        // Fetch other batches of the same course for transfer workflow
        if (res.batch.courseSlug) {
          const batchesRes = await apiService.getBatches({ courseSlug: res.batch.courseSlug });
          if (batchesRes?.success && Array.isArray(batchesRes.batches)) {
            setOtherBatches(batchesRes.batches.filter((b: Batch) => b.id !== id));
          }
        }
      } else {
        setNotification({ type: 'error', message: res?.message || 'Batch not found.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error loading batch data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatchData();
  }, [id]);

  // Load attendance records when selected session changes
  useEffect(() => {
    if (!id || !selectedSessionId) return;
    const fetchAttendance = async () => {
      try {
        const res = await apiService.getBatchAttendance(id, { sessionId: selectedSessionId });
        if (res?.success && Array.isArray(res.attendance)) {
          const initialDraft: Record<string, { status: string; remarks: string }> = {};
          res.attendance.forEach((att: any) => {
            initialDraft[att.enrollmentId] = {
              status: att.status || 'Not Marked',
              remarks: att.remarks || '',
            };
          });
          setAttendanceDraft(initialDraft);
        }
      } catch (err) {
        console.warn('Could not fetch attendance records:', err);
      }
    };
    fetchAttendance();
  }, [id, selectedSessionId]);

  // Timetable Generator
  const handleGenerateSessions = async () => {
    if (!batch) return;
    if (!window.confirm(`Generate timetable sessions for batch "${batch.name || batch.id}"? This will schedule daily/weekly sessions skipping non-teaching days and holidays.`)) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await apiService.generateBatchSessions(batch.id);
      if (res?.success) {
        setNotification({
          type: 'success',
          message: res.message || `Generated ${res.newCreatedCount} sessions (${res.preservedCount} preserved).`,
        });
        await loadBatchData();
      } else {
        setNotification({ type: 'error', message: res?.message || 'Failed to generate sessions.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error generating batch sessions.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Student Transfer
  const handleTransferStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferModalEnrollment || !targetBatchId) return;

    try {
      setActionLoading(true);
      const res = await cmsStore.transferStudentBatch(transferModalEnrollment.id, {
        toBatchId: targetBatchId,
        reason: transferReason,
        effectiveDate: transferEffectiveDate,
      });

      if (res?.success) {
        setNotification({
          type: 'success',
          message: res.message || `Transferred ${transferModalEnrollment.studentName} successfully.`,
        });
        setTransferModalEnrollment(null);
        setTargetBatchId('');
        setTransferReason('');
        await loadBatchData();
      } else {
        setNotification({ type: 'error', message: res?.message || 'Failed to transfer student.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Transfer failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Batch Save
  const handleSaveBatchEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batch) return;

    try {
      setActionLoading(true);
      const res = await apiService.updateBatch(batch.id, batchFormData);
      if (res?.success) {
        setNotification({ type: 'success', message: 'Batch details updated successfully.' });
        setIsEditBatchOpen(false);
        await loadBatchData();
      } else {
        setNotification({ type: 'error', message: res?.message || 'Failed to update batch.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error updating batch.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Save Attendance
  const handleSaveAttendance = async () => {
    if (!batch || !course || !selectedSessionId) return;

    try {
      setAttendanceSaving(true);
      const attendanceList = Object.entries(attendanceDraft).map(([enrollmentId, data]) => ({
        enrollmentId,
        status: data.status,
        remarks: data.remarks,
      }));

      const res = await apiService.markAttendance(course.slug, {
        sessionId: selectedSessionId,
        attendanceList,
      });

      if (res?.success) {
        setNotification({ type: 'success', message: res.message || 'Attendance records saved.' });
        await loadBatchData();
      } else {
        setNotification({ type: 'error', message: res?.message || 'Error saving attendance.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save attendance.' });
    } finally {
      setAttendanceSaving(false);
    }
  };

  // Mark all active students as Present
  const handleMarkAllPresent = () => {
    const updated = { ...attendanceDraft };
    enrollments
      .filter((e) => e.status === 'Active')
      .forEach((e) => {
        updated[e.id] = {
          status: 'Present',
          remarks: updated[e.id]?.remarks || '',
        };
      });
    setAttendanceDraft(updated);
  };

  // Filtered Students
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e) => {
      const matchSearch =
        e.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        e.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
        (e.studentPhone && e.studentPhone.includes(studentSearch));
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [enrollments, studentSearch, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-3">
        <Loader2 className="w-8 h-8 text-[#087F78] animate-spin" />
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loading Batch Details...</p>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Batch Not Found</h2>
        <p className="text-sm text-gray-500">The requested batch ID does not exist or was deleted.</p>
        <Link
          to="/admin/batches"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Batches
        </Link>
      </div>
    );
  }

  const activeEnrolledCount = enrollments.filter((e) => e.status === 'Active').length;
  const capacity = batch.capacity || batch.totalSeats || 20;
  const seatPercentage = Math.min(100, Math.round((activeEnrolledCount / capacity) * 100));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </div>
      )}

      {/* Header & Breadcrumbs */}
      <div className="bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/admin/student-management" className="hover:text-primary-600 transition-colors">
            Student Management
          </Link>
          <span>/</span>
          <Link to="/admin/batches" className="hover:text-primary-600 transition-colors">
            Batches
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-800">{batch.id}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#087F78] uppercase">
                {batch.id}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  batch.academicStatus === 'Active' || batch.status === 'Open'
                    ? 'bg-emerald-100 text-emerald-800'
                    : batch.academicStatus === 'Upcoming' || batch.status === 'Starting Soon'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {batch.academicStatus || batch.status || 'Active'}
              </span>
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {batch.room || 'Computer Lab 1'}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-[#123B3A]">
              {batch.name || `${batch.courseName} - ${batch.timing}`}
            </h1>

            <p className="text-xs text-gray-600 flex flex-wrap items-center gap-3">
              <span>Course: <strong>{batch.courseName}</strong></span>
              <span>•</span>
              <span>Timing: <strong>{batch.timing} ({batch.timeRange || '10:00 AM – 12:00 PM'})</strong></span>
              <span>•</span>
              <span>Trainer: <strong>{batch.trainerName || 'SSCI Senior Faculty'}</strong></span>
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsEnrollDialogOpen(true)}
              className="py-2.5 px-4 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Existing Students</span>
            </button>

            <button
              onClick={handleGenerateSessions}
              disabled={actionLoading}
              className="py-2.5 px-4 rounded-xl bg-teal-50 text-[#087F78] hover:bg-teal-100 text-xs font-bold transition-all flex items-center gap-2 border border-teal-200"
            >
              <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
              <span>Generate Timetable</span>
            </button>

            <button
              onClick={() => setIsEditBatchOpen(true)}
              className="py-2.5 px-3.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Batch</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
              <span>Seat Capacity</span>
              <span className="text-[#087F78] font-bold">{activeEnrolledCount} / {capacity}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  seatPercentage >= 100 ? 'bg-rose-500' : seatPercentage >= 80 ? 'bg-amber-500' : 'brand-gradient-bg'
                }`}
                style={{ width: `${seatPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{capacity - activeEnrolledCount} seats remaining</p>
          </div>

          <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 block">Start Date</span>
            <span className="text-sm font-bold text-gray-800 block mt-0.5">{batch.startDate || 'Immediate'}</span>
            <span className="text-[11px] text-gray-400">Duration: {batch.duration}</span>
          </div>

          <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 block">Timetable Sessions</span>
            <span className="text-sm font-bold text-gray-800 block mt-0.5">
              {batch.completedSessions || sessions.filter((s) => s.status === 'Completed').length} / {sessions.length} Completed
            </span>
            <span className="text-[11px] text-gray-400">
              {Math.max(0, sessions.length - (batch.completedSessions || 0))} upcoming
            </span>
          </div>

          <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 block">Parent Course</span>
            <Link
              to={`/admin/courses/${batch.courseSlug}`}
              className="text-xs font-bold text-[#087F78] hover:underline block mt-0.5 truncate"
            >
              {batch.courseName} &rarr;
            </Link>
            <span className="text-[11px] text-gray-400">Classroom & Lab</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 bg-white px-6 rounded-t-2xl shadow-2xs gap-6">
        <button
          onClick={() => setActiveTab('students')}
          className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'students'
              ? 'border-[#087F78] text-[#087F78]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Enrolled Students ({enrollments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timetable')}
          className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'timetable'
              ? 'border-[#087F78] text-[#087F78]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Timetable & Sessions ({sessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'border-[#087F78] text-[#087F78]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Attendance Register</span>
        </button>

        <button
          onClick={() => setActiveTab('syllabus')}
          className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'syllabus'
              ? 'border-[#087F78] text-[#087F78]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Curriculum & Modules</span>
        </button>
      </div>

      {/* TAB 1: Enrolled Students */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-b-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name, ID, or phone..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#087F78]"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-700 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Completed">Completed</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>

              <button
                onClick={() => setIsEnrollDialogOpen(true)}
                className="py-2 px-3.5 rounded-xl brand-gradient-bg text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Existing Students</span>
              </button>
            </div>
          </div>

          {filteredEnrollments.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <Users className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500 font-semibold">No students enrolled in this batch yet.</p>
              <button
                onClick={() => setIsEnrollDialogOpen(true)}
                className="px-4 py-2 text-xs font-bold brand-gradient-bg text-white rounded-xl"
              >
                Add Students Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Fee Status</th>
                    <th className="py-3 px-4">Attendance %</th>
                    <th className="py-3 px-4">Syllabus Progress</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEnrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{enr.studentName}</span>
                        <span className="text-[11px] text-gray-400">{enr.studentPhone || enr.studentEmail}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] font-semibold text-gray-700">
                        {enr.studentId}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            enr.feeStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : enr.feeStatus === 'Partial'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {enr.feeStatus} (₹{enr.applicableFee || 0})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <AttendancePercentage
                          percentage={enr.attendancePercentage || 0}
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <ModuleProgressIndicator
                          progressPercentage={enr.learningProgressPercentage || 0}
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            enr.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : enr.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {enr.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setTransferModalEnrollment(enr);
                              setTargetBatchId('');
                              setTransferReason('');
                            }}
                            title="Transfer student to another batch of this course"
                            className="px-2.5 py-1 text-[11px] font-bold bg-teal-50 text-[#087F78] hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors flex items-center gap-1"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Transfer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Timetable & Sessions */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-b-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Scheduled Sessions & Timetable</h3>
              <p className="text-xs text-gray-500">All lecture and practical lab sessions for this batch</p>
            </div>
            <button
              onClick={handleGenerateSessions}
              disabled={actionLoading}
              className="py-2 px-3.5 rounded-xl bg-teal-50 text-[#087F78] hover:bg-teal-100 text-xs font-bold border border-teal-200 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate Timetable</span>
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500 font-semibold">No timetable sessions generated yet.</p>
              <button
                onClick={handleGenerateSessions}
                className="px-4 py-2 text-xs font-bold brand-gradient-bg text-white rounded-xl"
              >
                Auto-Generate Timetable
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sessions.map((ses) => (
                <div
                  key={ses.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-teal-200 transition-all gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-[#087F78] font-bold text-xs flex items-center justify-center shrink-0">
                      #{ses.sessionNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{ses.title}</h4>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#087F78]" />
                          {ses.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          {ses.startTime} – {ses.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ses.status === 'Completed' || ses.attendanceFinalized
                          ? 'bg-emerald-100 text-emerald-800'
                          : ses.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ses.attendanceFinalized ? 'Attendance Marked' : ses.status}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedSessionId(ses.id);
                        setActiveTab('attendance');
                      }}
                      className="px-3 py-1 text-xs font-bold text-[#087F78] hover:bg-teal-50 rounded-lg transition-colors border border-teal-100"
                    >
                      Mark Attendance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Attendance Register */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-b-2xl border border-gray-200 shadow-2xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Select Session to Mark Attendance
              </label>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="text-xs font-semibold bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-800 outline-none min-w-[280px]"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    Session #{s.sessionNumber} ({s.date}): {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-2 text-xs font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors shadow-2xs"
              >
                Mark All Present
              </button>

              <button
                type="button"
                onClick={handleSaveAttendance}
                disabled={attendanceSaving || !selectedSessionId}
                className="px-4 py-2 text-xs font-bold brand-gradient-bg text-white rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {attendanceSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Attendance</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Student Attendance List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-2">
              <span>Student Roster ({enrollments.filter((e) => e.status === 'Active').length} Active)</span>
              <span>Attendance Formula: ((Present + Late) / Total Eligible Sessions) * 100</span>
            </div>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {enrollments
                .filter((e) => e.status === 'Active')
                .map((enr) => {
                  const currentStatus = attendanceDraft[enr.id]?.status || 'Not Marked';
                  return (
                    <div
                      key={enr.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50"
                    >
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">{enr.studentName}</span>
                        <span className="text-[11px] text-gray-400 font-mono">{enr.studentId}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(['Present', 'Late', 'Absent', 'Excused'] as const).map((st) => (
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
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                              currentStatus === st
                                ? st === 'Present'
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : st === 'Late'
                                  ? 'bg-amber-500 text-white shadow-2xs'
                                  : st === 'Absent'
                                  ? 'bg-rose-600 text-white shadow-2xs'
                                  : 'bg-indigo-600 text-white shadow-2xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Syllabus & Modules */}
      {activeTab === 'syllabus' && (
        <div className="bg-white rounded-b-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Course Syllabus & Learning Modules</h3>
              <p className="text-xs text-gray-500">
                Curriculum defined for parent course: <span className="font-semibold">{batch.courseName}</span>
              </p>
            </div>
            <Link
              to={`/admin/courses/${batch.courseSlug}`}
              className="text-xs font-bold text-[#087F78] hover:underline flex items-center gap-1"
            >
              <span>View Full Course CMS</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {course?.modules && course.modules.length > 0 ? (
              course.modules.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider">
                      Module {idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">
                      {mod.topics?.length || 0} Topics
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{mod.title}</h4>
                  {mod.topics && (
                    <p className="text-xs text-gray-600">
                      <strong>Topics:</strong> {Array.isArray(mod.topics) ? mod.topics.join(', ') : mod.topics}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No structured modules configured for this course yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Enrollment Dialog Modal */}
      {course && (
        <EnrollmentDialog
          course={course}
          batch={batch}
          isOpen={isEnrollDialogOpen}
          onClose={() => setIsEnrollDialogOpen(false)}
          onSuccess={loadBatchData}
          alreadyEnrolledStudentIds={enrollments.map((e) => e.studentId)}
        />
      )}

      {/* Student Batch Transfer Modal */}
      {transferModalEnrollment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleTransferStudent}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#087F78]" />
                Transfer Student Batch
              </h3>
              <button
                type="button"
                onClick={() => setTransferModalEnrollment(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                &times;
              </button>
            </div>

            <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-100 text-xs text-gray-700 space-y-1">
              <p><strong>Student:</strong> {transferModalEnrollment.studentName} ({transferModalEnrollment.studentId})</p>
              <p><strong>Current Batch:</strong> {batch.name || batch.id} ({batch.timing})</p>
              <p><strong>Course:</strong> {batch.courseName}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Select Destination Batch <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={targetBatchId}
                onChange={(e) => setTargetBatchId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
              >
                <option value="">-- Choose Target Batch --</option>
                {otherBatches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name || b.id} ({b.timing}) • {b.enrolledCount ?? b.filledSeats ?? 0}/{b.capacity ?? b.totalSeats ?? 20} Seats
                  </option>
                ))}
              </select>
              {otherBatches.length === 0 && (
                <p className="text-[11px] text-amber-600 mt-1">
                  No other batches found for this course. Please create another batch first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Effective Date
              </label>
              <input
                type="date"
                value={transferEffectiveDate}
                onChange={(e) => setTransferEffectiveDate(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Reason for Transfer
              </label>
              <input
                type="text"
                placeholder="e.g. Schedule clash, requested morning slot"
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setTransferModalEnrollment(null)}
                className="px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading || !targetBatchId}
                className="px-4 py-2 text-xs font-bold brand-gradient-bg text-white rounded-xl shadow-xs disabled:opacity-50"
              >
                {actionLoading ? 'Transferring...' : 'Confirm Transfer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Batch Modal */}
      {isEditBatchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveBatchEdit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#087F78]" />
                Edit Batch Details
              </h3>
              <button
                type="button"
                onClick={() => setIsEditBatchOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                &times;
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Batch Name / Title
              </label>
              <input
                type="text"
                value={batchFormData.name || ''}
                onChange={(e) => setBatchFormData({ ...batchFormData, name: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Timing Slot
                </label>
                <select
                  value={batchFormData.timing || 'Morning'}
                  onChange={(e) => setBatchFormData({ ...batchFormData, timing: e.target.value as any })}
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Time Range
                </label>
                <input
                  type="text"
                  value={batchFormData.timeRange || ''}
                  onChange={(e) => setBatchFormData({ ...batchFormData, timeRange: e.target.value })}
                  placeholder="e.g. 08:00 AM – 10:00 AM"
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Seat Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  value={batchFormData.capacity || batchFormData.totalSeats || 20}
                  onChange={(e) =>
                    setBatchFormData({
                      ...batchFormData,
                      capacity: Number(e.target.value),
                      totalSeats: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Academic Status
                </label>
                <select
                  value={batchFormData.academicStatus || 'Draft'}
                  onChange={(e) => setBatchFormData({ ...batchFormData, academicStatus: e.target.value as any })}
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Assigned Trainer
                </label>
                <input
                  type="text"
                  value={batchFormData.trainerName || ''}
                  onChange={(e) => setBatchFormData({ ...batchFormData, trainerName: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Lab Room
                </label>
                <input
                  type="text"
                  value={batchFormData.room || ''}
                  onChange={(e) => setBatchFormData({ ...batchFormData, room: e.target.value })}
                  placeholder="e.g. Lab 1 (Nellore)"
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsEditBatchOpen(false)}
                className="px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-bold brand-gradient-bg text-white rounded-xl shadow-xs disabled:opacity-50"
              >
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
