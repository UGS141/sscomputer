import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Award,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Filter
} from 'lucide-react';
import { cmsStore, type Student } from '../cmsStore';
import { COURSES_DATA } from '../../data/courses';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(cmsStore.getStudents());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [viewModalStudent, setViewModalStudent] = useState<Student | null>(null);
  const [editModalStudent, setEditModalStudent] = useState<Student | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [deleteModalStudent, setDeleteModalStudent] = useState<Student | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: '',
    studentId: '',
    name: '',
    phone: '',
    email: '',
    course: '',
    batch: '',
    admissionDate: '',
    status: 'Active' as Student['status'],
    grade: '',
  });

  // Action Loading & Error state
  const [actionLoading, setActionLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setStudents([...cmsStore.getStudents()]);
    });
    return unsubscribe;
  }, []);

  // Filter students by search and status
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ? true : s.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    setIsAddMode(true);
    setEditModalStudent(null);
    setFormError('');
    setFormData({
      id: '',
      studentId: `SSCI-STD-2026-${(students.length + 1).toString().padStart(2, '0')}`,
      name: '',
      phone: '',
      email: '',
      course: COURSES_DATA[0]?.title || 'MS Office & Computer Fundamentals',
      batch: 'Morning Batch (10:00 AM – 12:00 PM)',
      admissionDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Active',
      grade: '',
    });
  };

  const handleOpenEdit = (student: Student) => {
    setIsAddMode(false);
    setEditModalStudent(student);
    setViewModalStudent(null);
    setFormError('');
    setFormData({
      id: student.id,
      studentId: student.studentId,
      name: student.name,
      phone: student.phone,
      email: student.email,
      course: student.course,
      batch: student.batch,
      admissionDate: student.admissionDate,
      status: student.status,
      grade: student.grade || '',
    });
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setFormError('Please enter a valid student name (at least 2 characters).');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setFormError('Please enter a valid mobile phone number.');
      return;
    }
    if (!formData.course.trim()) {
      setFormError('Please select or specify an enrolled course.');
      return;
    }

    setActionLoading(true);
    try {
      if (isAddMode) {
        await cmsStore.saveStudent(formData);
        showNotification('success', `Student record for "${formData.name}" created successfully.`);
      } else {
        await cmsStore.saveStudent(formData);
        showNotification('success', `Student record for "${formData.name}" (${formData.studentId}) updated successfully.`);
      }
      setEditModalStudent(null);
      setIsAddMode(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save student record. Please check backend connection.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalStudent) return;

    setActionLoading(true);
    try {
      await cmsStore.deleteStudent(deleteModalStudent.id);
      showNotification('success', `Student record for "${deleteModalStudent.name}" (${deleteModalStudent.studentId}) deleted successfully.`);
      setDeleteModalStudent(null);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete student record.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeStyle = (status: Student['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-[#12A77A] border-emerald-200';
      case 'Registered':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'Completed':
        return 'bg-teal-100 text-[#087F78] border-teal-200';
      case 'Alumni':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Enquiry':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-md transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <p className="text-xs font-bold">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Student Registry & CRM</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Students Roster</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage active enrolled students, batch timings, edit profiles, and issue course certificates
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 rounded-xl text-xs font-bold text-white brand-gradient-bg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-teal-100/70 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student ID, name, course, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#087F78]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 py-2 px-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#087F78] bg-white"
          >
            <option value="all">All Statuses ({students.length})</option>
            <option value="active">Active</option>
            <option value="registered">Registered</option>
            <option value="enquiry">Enquiry</option>
            <option value="completed">Completed</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-teal-100/70 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-[#4B6B69] uppercase tracking-wider bg-teal-50/50">
                <th className="py-3.5 px-4">Student ID & Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Enrolled Course</th>
                <th className="py-3.5 px-4">Batch Schedule</th>
                <th className="py-3.5 px-4">Admission Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No registered students found matching search filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#123B3A]">{s.name}</p>
                      <p className="text-[10px] text-[#087F78] font-bold tracking-wide">{s.studentId}</p>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>{s.phone}</span>
                      </div>
                      {s.email && (
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[140px]">{s.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#123B3A]">{s.course}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-600">{s.batch}</td>
                    <td className="py-3.5 px-4 text-gray-500">{s.admissionDate}</td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(s.status)}`}>
                        {s.status}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewModalStudent(s)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          title="Edit Student Record"
                          className="p-1.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModalStudent(s)}
                          title="Delete Record"
                          className="p-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW STUDENT DETAILS MODAL */}
      {viewModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewModalStudent(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-teal-100 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-teal-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#087F78] uppercase tracking-wider block">Student Record</span>
                <h3 className="text-xl font-extrabold text-[#123B3A]">{viewModalStudent.name}</h3>
                <span className="text-xs font-bold text-[#087F78]">{viewModalStudent.studentId}</span>
              </div>
              <button onClick={() => setViewModalStudent(null)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(viewModalStudent.status)}`}>
                  {viewModalStudent.status}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Phone Number</span>
                <span className="font-bold text-[#123B3A]">{viewModalStudent.phone}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Email Address</span>
                <span className="font-medium text-gray-700">{viewModalStudent.email || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Enrolled Course</span>
                <span className="font-bold text-[#123B3A]">{viewModalStudent.course}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Batch Schedule</span>
                <span className="font-medium text-gray-700">{viewModalStudent.batch}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Admission Date</span>
                <span className="font-medium text-gray-700">{viewModalStudent.admissionDate}</span>
              </div>
              {viewModalStudent.grade && (
                <div className="flex items-center justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Final Grade</span>
                  <span className="font-bold text-teal-700">{viewModalStudent.grade}</span>
                </div>
              )}
              {viewModalStudent.certificatesIssued && viewModalStudent.certificatesIssued.length > 0 && (
                <div className="py-1">
                  <span className="text-gray-500 font-medium block mb-1">Certificates Issued</span>
                  <div className="flex flex-wrap gap-1">
                    {viewModalStudent.certificatesIssued.map((cert) => (
                      <span key={cert} className="px-2 py-0.5 rounded bg-teal-50 text-[#087F78] font-mono text-[10px] font-bold">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleOpenEdit(viewModalStudent)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white brand-gradient-bg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Student Record</span>
              </button>
              <button
                onClick={() => setViewModalStudent(null)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT STUDENT MODAL */}
      {(editModalStudent || isAddMode) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setEditModalStudent(null);
              setIsAddMode(false);
            }}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-teal-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-teal-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#087F78] uppercase tracking-wider block">
                  {isAddMode ? 'New Student Registration' : 'Student Management'}
                </span>
                <h3 className="text-xl font-extrabold text-[#123B3A]">
                  {isAddMode ? 'Add New Student' : `Edit Record: ${formData.name}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditModalStudent(null);
                  setIsAddMode(false);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#123B3A] mb-1">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Student Name"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#087F78] outline-none font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#123B3A] mb-1">Student ID (Auto)</label>
                  <input
                    type="text"
                    disabled
                    value={formData.studentId}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 font-bold outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#123B3A] mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Mobile Number"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#087F78] outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#123B3A] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#087F78] outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#123B3A] mb-1">
                    Enrolled Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#087F78] outline-none bg-white font-medium"
                  >
                    {COURSES_DATA.map((c) => (
                      <option key={c.slug} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                    <option value="Custom / Other Course">Custom / Other Course</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#123B3A] mb-1">Assigned Batch</label>
                  <select
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#087F78] outline-none bg-white font-medium"
                  >
                    <option value="Morning Batch (08:00 AM – 10:00 AM)">Morning Batch (08:00 AM – 10:00 AM)</option>
                    <option value="Morning Batch (10:00 AM – 12:00 PM)">Morning Batch (10:00 AM – 12:00 PM)</option>
                    <option value="Afternoon Batch (02:00 PM – 04:00 PM)">Afternoon Batch (02:00 PM – 04:00 PM)</option>
                    <option value="Evening Batch (05:00 PM – 07:00 PM)">Evening Batch (05:00 PM – 07:00 PM)</option>
                    <option value="Weekend Batch (Sat & Sun)">Weekend Batch (Sat & Sun)</option>
                    <option value="Regular Batch">Regular Batch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#123B3A] mb-1">Admission Date</label>
                  <input
                    type="text"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#087F78] outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#123B3A] mb-1">Student Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Student['status'] })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#087F78] outline-none bg-white font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Registered">Registered</option>
                    <option value="Enquiry">Enquiry</option>
                    <option value="Completed">Completed</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#123B3A] mb-1">Final Grade (Optional)</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g. A+"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#087F78] outline-none font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white brand-gradient-bg shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Save Student Record
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditModalStudent(null);
                    setIsAddMode(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModalStudent(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-red-100 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 rounded-full bg-red-100 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#123B3A]">Delete Student Record?</h3>
                <p className="text-xs text-red-600 font-bold">{deleteModalStudent.studentId}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-red-50/50 p-3 rounded-xl border border-red-100">
              You are about to delete the student record for{' '}
              <strong className="text-[#123B3A]">{deleteModalStudent.name}</strong> ({deleteModalStudent.studentId}).
              This action may affect related admissions, attendance, payments, certificates, or other records.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalStudent(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmDelete}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
