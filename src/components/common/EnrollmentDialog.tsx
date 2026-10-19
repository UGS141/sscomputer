import React, { useState } from 'react';
import { X, UserPlus, Users, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { StudentSelector } from './StudentSelector';
import { cmsStore, type Course } from '../../admin/cmsStore';

interface EnrollmentDialogProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  alreadyEnrolledStudentIds?: string[];
}

export const EnrollmentDialog: React.FC<EnrollmentDialogProps> = ({
  course,
  isOpen,
  onClose,
  onSuccess,
  alreadyEnrolledStudentIds = [],
}) => {
  const [tab, setTab] = useState<'existing' | 'new'>('existing');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Fee configuration
  const defaultFee = course.price || 0;
  const [applicableFee, setApplicableFee] = useState<number>(defaultFee);
  const [discount, setDiscount] = useState<number>(0);
  const [feeStatus, setFeeStatus] = useState<'Paid' | 'Partial' | 'Pending'>('Paid');
  const [notes, setNotes] = useState('');

  // Quick New Student Form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const finalFee = Math.max(0, applicableFee - discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (tab === 'existing') {
        if (selectedStudentIds.length === 0) {
          setError('Please select at least one student to enroll.');
          setLoading(false);
          return;
        }

        const res = await cmsStore.enrollStudents({
          courseSlug: course.slug,
          studentIds: selectedStudentIds,
          applicableFee: finalFee,
          discount,
          feeStatus,
          notes,
        });

        setSuccessMsg(res.message || `Successfully enrolled ${res.enrolledCount} student(s).`);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        // Quick Register New Student
        if (!newName.trim() || newName.length < 2) {
          setError('Please enter a valid student name.');
          setLoading(false);
          return;
        }
        if (!newPhone.trim() || newPhone.length < 8) {
          setError('Please enter a valid phone number.');
          setLoading(false);
          return;
        }

        // Save student first
        const savedStudent = await cmsStore.saveStudent({
          name: newName.trim(),
          phone: newPhone.trim(),
          email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '')}@student.ssci`,
          course: course.title,
          batch: 'Regular Batch',
        });

        // Enroll new student
        const res = await cmsStore.enrollStudents({
          courseSlug: course.slug,
          studentIds: [savedStudent.studentId || savedStudent.id],
          applicableFee: finalFee,
          discount,
          feeStatus,
          notes,
        });

        setSuccessMsg(`Registered & enrolled ${savedStudent.name} (${savedStudent.studentId}) successfully.`);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.message || 'Error processing enrollment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-50 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              Enroll Students into Course
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Course: <span className="font-semibold text-gray-700">{course.title}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 bg-white px-5 pt-3">
          <button
            type="button"
            onClick={() => setTab('existing')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'existing'
                ? 'border-primary-600 text-primary-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Add Existing Students
          </button>
          <button
            type="button"
            onClick={() => setTab('new')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'new'
                ? 'border-primary-600 text-primary-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register & Enroll New Student
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-emerald-700 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'existing' ? (
            <StudentSelector
              selectedStudentIds={selectedStudentIds}
              onChange={setSelectedStudentIds}
              alreadyEnrolledStudentIds={alreadyEnrolledStudentIds}
              multiple={true}
              label="Select Existing Students"
              helperText="Search from existing central student profiles to enroll into this course."
            />
          ) : (
            <div className="space-y-4 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">New Student Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fee & Payment Configuration */}
          <div className="border-t border-gray-100 pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Fee & Enrollment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Base Course Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={applicableFee}
                  onChange={(e) => setApplicableFee(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Final Payable Fee (₹)</label>
                <div className="w-full px-3 py-2 text-sm font-bold text-gray-900 bg-gray-100 border border-gray-200 rounded-lg">
                  ₹{finalFee.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={feeStatus}
                  onChange={(e) => setFeeStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="Paid">Paid (Full)</option>
                  <option value="Partial">Partial</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Enrollment Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Morning batch, student referred by alumni"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (tab === 'existing' && selectedStudentIds.length === 0)}
              className="px-5 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Enrollment...
                </>
              ) : tab === 'existing' ? (
                `Enroll ${selectedStudentIds.length} Student${selectedStudentIds.length === 1 ? '' : 's'}`
              ) : (
                'Register & Enroll Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
