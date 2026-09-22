import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, MessageSquare, Send, Loader2 } from 'lucide-react';
import { COURSES_DATA } from '../../data/courses';
import { apiService } from '../../services/api';
import { generateWhatsAppUrl } from '../../config/site';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledCourse?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, prefilledCourse }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    courseInterested: prefilledCourse || 'MS Office & Computer Fundamentals',
    preferredTiming: 'Morning (10 AM - 12 PM)',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefilledCourse) {
      setFormData((prev) => ({ ...prev, courseInterested: prefilledCourse }));
    }
  }, [prefilledCourse]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setLoading(true);
    try {
      await apiService.submitEnquiry(formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      courseInterested: 'MS Office & Computer Fundamentals',
      preferredTiming: 'Morning (10 AM - 12 PM)',
      message: '',
    });
    onClose();
  };

  const whatsappMsg = `Hello SSCI, I submitted an enquiry for ${formData.courseInterested}. My phone is ${formData.phone}. Please share batch details.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleResetAndClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 border border-teal-100">
        
        {/* Header */}
        <div className="brand-gradient-bg p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Sri Shanmukha Computer Institute
            </span>
            <h3 className="text-xl font-extrabold tracking-tight">Admission & Course Enquiry</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#12A77A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-[#123B3A]">Enquiry Received!</h4>
                <p className="text-sm text-gray-600 mt-1 max-w-xs mx-auto">
                  Thank you, <span className="font-semibold text-[#087F78]">{formData.name}</span>! Our admission team will contact you shortly with course schedules and fee details.
                </p>
              </div>

              <div className="pt-3 flex flex-col gap-2">
                <a
                  href={generateWhatsAppUrl(whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Continue on WhatsApp Instant Chat
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit Mobile No"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1">
                  Course Interested In
                </label>
                <select
                  value={formData.courseInterested}
                  onChange={(e) => setFormData({ ...formData, courseInterested: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none transition-all bg-white"
                >
                  {COURSES_DATA.map((course) => (
                    <option key={course.slug} value={course.title}>
                      {course.title} ({course.duration})
                    </option>
                  ))}
                  <option value="General Counselling">General Career Counselling</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1">
                  Preferred Batch Timing
                </label>
                <select
                  value={formData.preferredTiming}
                  onChange={(e) => setFormData({ ...formData, preferredTiming: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none transition-all bg-white"
                >
                  <option value="Morning (08:00 AM - 12:00 PM)">Morning Batch (08:00 AM – 12:00 PM)</option>
                  <option value="Afternoon (02:00 PM - 04:00 PM)">Afternoon Batch (02:00 PM – 04:00 PM)</option>
                  <option value="Evening (05:00 PM - 08:00 PM)">Evening Batch (05:00 PM – 08:00 PM)</option>
                  <option value="Weekend (Sat / Sun)">Weekend Batch (Sat & Sun)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1">
                  Questions / Message (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us any specific requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white brand-gradient-bg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Enquiry...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Enquiry Now
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
