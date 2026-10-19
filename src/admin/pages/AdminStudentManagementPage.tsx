import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Layers,
  BookOpen,
  Calendar,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Award,
  Phone,
  Mail,
  X,
  MapPin,
  ArrowRightLeft
} from 'lucide-react';
import { cmsStore, type Student, type Batch, type Course, type Enrollment } from '../cmsStore';
import { apiService } from '../../services/api';
import { AttendancePercentage } from '../../components/common/AttendancePercentage';
import { ModuleProgressIndicator } from '../../components/common/ModuleProgressIndicator';
import { EnrollmentDialog } from '../../components/common/EnrollmentDialog';

export const AdminStudentManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'batches' | 'courses'>('students');

  // Core Data Lists
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [batchSearch, setBatchSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  // Modals
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [studentDetailEnrollments, setStudentDetailEnrollments] = useState<Enrollment[]>([]);
  const [studentDetailCerts, setStudentDetailCerts] = useState<any[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Add/Edit Student Modal
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentFormData, setStudentFormData] = useState<Partial<Student>>({});

  // Enroll In Course/Batch Modal
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);
  const [enrollBatch, setEnrollBatch] = useState<Batch | null>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stdRes, batRes] = await Promise.all([
        apiService.getStudents(),
        apiService.getBatches(),
      ]);

      if (stdRes?.success && Array.isArray(stdRes.students)) {
        setStudents(stdRes.students);
      } else {
        setStudents(cmsStore.getStudents());
      }

      if (batRes?.success && Array.isArray(batRes.batches)) {
        setBatches(batRes.batches);
      } else {
        setBatches(cmsStore.getBatches());
      }

      setCourses(cmsStore.getCourses());
    } catch (err: any) {
      console.warn('Error loading student management data:', err);
      setStudents(cmsStore.getStudents());
      setBatches(cmsStore.getBatches());
      setCourses(cmsStore.getCourses());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = cmsStore.subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const handleOpenStudentDetail = async (student: Student) => {
    setViewStudent(student);
    setDetailLoading(true);
    try {
      const res = await apiService.getStudentById(student.studentId || student.id);
      if (res?.success) {
        setStudentDetailEnrollments(res.enrollments || []);
        setStudentDetailCerts(res.certificates || []);
      } else {
        setStudentDetailEnrollments(student.enrollments || []);
        setStudentDetailCerts([]);
      }
    } catch (_) {
      setStudentDetailEnrollments(student.enrollments || []);
      setStudentDetailCerts([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOpenCreateStudent = () => {
    setEditingStudent(null);
    setStudentFormData({
      studentId: `SSCI-STD-2026-${(students.length + 1).toString().padStart(2, '0')}`,
      name: '',
      phone: '',
      email: '',
      course: courses[0]?.title || 'Python Programming',
      batch: 'Morning Batch',
      status: 'Active',
      admissionDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    });
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormData.name || !studentFormData.phone || !studentFormData.course) {
      setNotification({ type: 'error', message: 'Name, phone number, and course are required.' });
      return;
    }

    try {
      await cmsStore.saveStudent(studentFormData as any);
      setNotification({ type: 'success', message: `Student "${studentFormData.name}" saved successfully.` });
      setIsStudentModalOpen(false);
      await loadData();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error saving student.' });
    }
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = studentSearch.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.phone.includes(studentSearch) ||
        s.course.toLowerCase().includes(q) ||
        (s.batch && s.batch.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'all' || s.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [students, studentSearch, statusFilter]);

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const q = batchSearch.toLowerCase();
      return (
        (b.name && b.name.toLowerCase().includes(q)) ||
        b.courseName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        (b.timing && b.timing.toLowerCase().includes(q))
      );
    });
  }, [batches, batchSearch]);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const q = courseSearch.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
    });
  }, [courses, courseSearch]);

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

      {/* Main Hub Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">
            Academics & Operations
          </span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Student Management Hub</h1>
          <p className="text-xs text-gray-500 mt-1">
            Centralized directory for students, batch assignments, timetable scheduling, and course enrollments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenCreateStudent}
            className="py-2.5 px-4 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Student Profile</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
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
          <span>All Students ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('batches')}
          className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'batches'
              ? 'border-[#087F78] text-[#087F78]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Batches & Timetable ({batches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'courses'
              ? 'border-[#087F78] text-[#087F78]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses ({courses.length})</span>
        </button>
      </div>

      {/* TAB 1: ALL STUDENTS */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-b-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name, ID, phone, course..."
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
                <option value="Active">Active</option>
                <option value="Registered">Registered</option>
                <option value="Completed">Completed</option>
                <option value="Alumni">Alumni</option>
                <option value="Enquiry">Enquiry</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 text-[#087F78] animate-spin" />
              <p className="text-xs text-gray-500 font-medium">Loading student records...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100 space-y-2">
              <Users className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500 font-semibold">No students match your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Enrolled Course(s) & Batch</th>
                    <th className="py-3 px-4">Avg Attendance</th>
                    <th className="py-3 px-4">Syllabus Progress</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{std.name}</span>
                        <span className="text-[11px] text-gray-400">{std.phone}</span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] font-semibold text-gray-700">
                        {std.studentId}
                      </td>

                      <td className="py-3 px-4">
                        {std.enrolledCourses && std.enrolledCourses.length > 0 ? (
                          <div className="space-y-1">
                            {std.enrolledCourses.map((c, i) => (
                              <div key={i} className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-gray-900">{c.courseTitle}</span>
                                {c.batchName && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-teal-50 text-[#087F78] font-medium border border-teal-100">
                                    {c.batchName}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>
                            <span className="font-semibold text-gray-900 block">{std.course}</span>
                            <span className="text-[11px] text-gray-400">{std.batch || 'Regular'}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <AttendancePercentage
                          percentage={std.averageAttendancePercentage ?? 0}
                          size="sm"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <ModuleProgressIndicator
                          progressPercentage={std.averageLearningProgressPercentage ?? 0}
                          size="sm"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            std.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : std.status === 'Completed'
                              ? 'bg-teal-100 text-[#087F78]'
                              : std.status === 'Registered'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {std.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenStudentDetail(std)}
                            title="View Academic Profile"
                            className="p-1.5 rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
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

      {/* TAB 2: BATCHES */}
      {activeTab === 'batches' && (
        <div className="bg-white rounded-b-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search batches by title, timing, or course..."
                value={batchSearch}
                onChange={(e) => setBatchSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#087F78]"
              />
            </div>

            <Link
              to="/admin/batches"
              className="py-2 px-3.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>Manage Batches CMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBatches.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-2xs hover:border-[#087F78]/50 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#087F78]">
                      {b.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {b.academicStatus || b.status || 'Active'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900">
                    {b.name || `${b.courseName} - ${b.timing}`}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">{b.courseName}</p>

                  <div className="space-y-1 text-xs text-gray-600 pt-1">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{b.timing} ({b.timeRange || '10:00 AM – 12:00 PM'})</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#087F78]" />
                      <span>Starts: {b.startDate}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{b.room || 'Computer Lab 1'}</span>
                    </p>
                  </div>

                  {/* Seat Occupancy */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1">
                      <span>Occupancy</span>
                      <span className="text-[#087F78] font-bold">
                        {b.enrolledCount ?? b.filledSeats ?? 0} / {b.capacity ?? b.totalSeats ?? 20}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full brand-gradient-bg"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              ((b.enrolledCount ?? b.filledSeats ?? 0) /
                                (b.capacity ?? b.totalSeats ?? 20)) *
                                100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Link
                  to={`/admin/batches/${b.id}`}
                  className="w-full py-2 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#087F78] text-xs font-bold transition-all flex items-center justify-center gap-1 border border-teal-200 mt-2"
                >
                  <span>View Timetable & Students</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COURSES */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-b-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#087F78]"
              />
            </div>

            <Link
              to="/admin/courses"
              className="py-2 px-3.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>Manage Courses CMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((c) => {
              const courseBatches = batches.filter((b) => b.courseSlug === c.slug);
              return (
                <div
                  key={c.slug}
                  className="bg-white rounded-xl p-5 border border-gray-200 shadow-2xs hover:border-[#087F78]/50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#087F78]">
                      {c.categoryName}
                    </span>

                    <h3 className="text-sm font-bold text-gray-900">{c.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{c.shortDescription}</p>

                    <div className="pt-2 text-xs text-gray-600 space-y-1">
                      <p>Duration: <strong>{c.duration}</strong> • Level: <strong>{c.level}</strong></p>
                      <p>Batches configured: <strong>{courseBatches.length}</strong></p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <Link
                      to={`/admin/courses/${c.slug}`}
                      className="w-full py-2 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#087F78] text-xs font-bold transition-all flex items-center justify-center gap-1 border border-teal-200"
                    >
                      <span>Course Detail & Enrollments</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STUDENT ACADEMIC PROFILE MODAL */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-fadeIn">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div>
                <span className="text-[10px] font-bold text-[#087F78] uppercase tracking-wider block">
                  Central Academic Profile
                </span>
                <h3 className="text-lg font-bold text-gray-900">{viewStudent.name}</h3>
                <span className="text-xs font-mono font-bold text-[#087F78]">{viewStudent.studentId}</span>
              </div>
              <button
                onClick={() => setViewStudent(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-400 block font-medium">Phone</span>
                  <span className="font-bold text-gray-800">{viewStudent.phone}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Email</span>
                  <span className="font-bold text-gray-800">{viewStudent.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Admission Date</span>
                  <span className="font-bold text-gray-800">{viewStudent.admissionDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Overall Status</span>
                  <span className="font-bold text-emerald-700">{viewStudent.status}</span>
                </div>
              </div>

              {/* Course & Batch Enrollments */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Course & Batch Enrollments ({studentDetailEnrollments.length})
                </h4>

                {detailLoading ? (
                  <div className="py-6 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#087F78] animate-spin" />
                  </div>
                ) : studentDetailEnrollments.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No course enrollments found for this student.</p>
                ) : (
                  <div className="space-y-3">
                    {studentDetailEnrollments.map((enr) => (
                      <div
                        key={enr.id}
                        className="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-bold text-gray-900">{enr.courseTitle}</h5>
                            <span className="text-xs text-gray-500">
                              Batch: <strong>{enr.batchName || 'Unassigned Batch'}</strong>
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              enr.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : enr.status === 'Completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {enr.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                          <div>
                            <span className="text-[11px] text-gray-500 font-semibold block mb-1">
                              Attendance Rate
                            </span>
                            <AttendancePercentage
                              percentage={enr.attendancePercentage ?? 0}
                              size="sm"
                            />
                          </div>

                          <div>
                            <span className="text-[11px] text-gray-500 font-semibold block mb-1">
                              Syllabus Progress
                            </span>
                            <ModuleProgressIndicator
                              progressPercentage={enr.learningProgressPercentage ?? 0}
                              size="sm"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-gray-500">
                            Fee: <strong>₹{enr.applicableFee || 0}</strong> ({enr.feeStatus})
                          </span>
                          {enr.batchId && (
                            <Link
                              to={`/admin/batches/${enr.batchId}`}
                              className="text-xs font-bold text-[#087F78] hover:underline"
                            >
                              Go to Batch &rarr;
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE STUDENT MODAL */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveStudent}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#087F78]" />
                New Student Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                &times;
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentFormData.name || ''}
                onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                placeholder="e.g. K. Sai Teja"
                className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={studentFormData.phone || ''}
                  onChange={(e) => setStudentFormData({ ...studentFormData, phone: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={studentFormData.email || ''}
                  onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
                  placeholder="e.g. student@gmail.com"
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Primary Course <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={studentFormData.course || ''}
                  onChange={(e) => setStudentFormData({ ...studentFormData, course: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.slug} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Batch Slot
                </label>
                <input
                  type="text"
                  value={studentFormData.batch || ''}
                  onChange={(e) => setStudentFormData({ ...studentFormData, batch: e.target.value })}
                  placeholder="e.g. Morning (08:00 AM – 10:00 AM)"
                  className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold brand-gradient-bg text-white rounded-xl shadow-xs"
              >
                Create Student Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
