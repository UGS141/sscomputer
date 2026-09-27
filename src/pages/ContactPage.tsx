import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { SITE_CONFIG, generateWhatsAppUrl } from '../config/site';
import { COURSES_DATA } from '../data/courses';
import { apiService } from '../services/api';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEOHead } from '../seo/SEOHead';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '../seo/schemas';
import { trackSEOEvent } from '../seo/analytics';

import { cmsStore } from '../admin/cmsStore';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    courseInterested: 'MS Office & Computer Fundamentals',
    preferredBatch: 'Morning (10:00 AM - 12:00 PM)',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiService.submitEnquiry(formData);
      if (res.success) {
        trackSEOEvent('contact_form_submit', { course: formData.courseInterested });
        cmsStore.refreshFromBackend();
        setSubmitted(true);
      } else {
        setErrorMsg(res.message || 'Submission failed. Please check your details and try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const schemas = [
    generateLocalBusinessSchema(),
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Contact Us', url: '/contact' },
    ]),
  ];

  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen pb-16">
      <SEOHead
        title="Contact Sri Shanmukha Computer Institute | Dhanalakshmipuram, Nellore"
        description="Get in touch with SSCI Nellore. Address: Dhanalakshmipuram, Opposite More Super Market, Nellore. Phone: +91 7675927519. Enquire for computer & programming courses."
        canonicalPath="/contact"
        schemas={schemas}
      />
      
      {/* Banner */}
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-teal-200">
            <Breadcrumb items={[{ label: 'Contact Us' }]} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Let&apos;s Start Your <span className="text-[#F5B72C]">Learning Journey</span>
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl leading-relaxed">
            Have questions about course fees, batch schedules, or computer lab practice? Visit our campus or send us an enquiry below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
              <h3 className="text-xl font-extrabold text-[#123B3A]">SSCI Campus Information</h3>
              
              <div className="space-y-4 text-xs sm:text-sm text-[#4B6B69]">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-50 text-[#F97316] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-[#123B3A] block font-bold text-sm">Institute Location</strong>
                    <span>{SITE_CONFIG.contact.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-[#087F78] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-[#123B3A] block font-bold text-sm">Phone Admissions Desk</strong>
                    <a href={`tel:${SITE_CONFIG.contact.phonePrimary}`} className="hover:text-[#087F78] block">
                      {SITE_CONFIG.contact.phonePrimary}
                    </a>
                    <a href={`tel:${SITE_CONFIG.contact.phoneSecondary}`} className="hover:text-[#087F78] block">
                      {SITE_CONFIG.contact.phoneSecondary}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-[#F5B72C] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-[#123B3A] block font-bold text-sm">Email Address</strong>
                    <a href={`mailto:${SITE_CONFIG.contact.email}`} className="hover:text-[#087F78] block">
                      {SITE_CONFIG.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-[#12A77A] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-[#123B3A] block font-bold text-sm">Working Hours</strong>
                    <span>{SITE_CONFIG.contact.workingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Call, WhatsApp & Email Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={`tel:${SITE_CONFIG.contact.phonePrimary}`}
                className="py-3 px-3 rounded-xl text-xs font-bold text-white brand-gradient-bg shadow-md flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>Call Now</span>
              </a>

              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-emerald-600 shadow-md flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="py-3 px-3 rounded-xl text-xs font-bold text-[#123B3A] bg-amber-100 hover:bg-amber-200 border border-amber-300 shadow-md flex items-center justify-center gap-1.5"
              >
                <Mail className="w-4 h-4 text-[#F97316]" />
                <span>Email Us</span>
              </a>
            </div>

            {/* Interactive Map Embed Container */}
            <div className="bg-white p-2 rounded-2xl border border-teal-100 shadow-sm overflow-hidden h-64">
              <iframe
                title="SSCI Location Map"
                src={SITE_CONFIG.contact.mapEmbedUrl}
                className="w-full h-full rounded-xl border-0"
                loading="lazy"
              />
            </div>

          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-teal-100 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block mb-1">
                  Enquiry & Admission Form
                </span>
                <h3 className="text-2xl font-extrabold text-[#123B3A]">Send Us a Message</h3>
              </div>

              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#12A77A] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#123B3A]">Thank You!</h4>
                  <p className="text-xs sm:text-sm text-[#4B6B69] max-w-sm mx-auto">
                    Your enquiry has been received. Our admission counselor will reach out to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="py-2.5 px-6 rounded-xl text-xs font-bold text-white brand-gradient-bg"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}
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
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none"
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
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] text-sm font-medium outline-none bg-white"
                    >
                      {COURSES_DATA.map((course) => (
                        <option key={course.slug} value={course.title}>
                          {course.title} ({course.duration})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1">
                      Preferred Timing
                    </label>
                    <select
                      value={formData.preferredBatch}
                      onChange={(e) => setFormData({ ...formData, preferredBatch: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] text-sm font-medium outline-none bg-white"
                    >
                      <option value="Morning (10:00 AM - 12:00 PM)">Morning Batch (10:00 AM – 12:00 PM)</option>
                      <option value="Afternoon (02:00 PM - 04:00 PM)">Afternoon Batch (02:00 PM – 04:00 PM)</option>
                      <option value="Evening (05:00 PM - 08:00 PM)">Evening Batch (05:00 PM – 08:00 PM)</option>
                      <option value="Weekend (Sat / Sun)">Weekend Batch (Sat & Sun)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1">
                      Your Message / Questions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write your questions here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] text-sm font-medium outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white brand-gradient-bg shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Enquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
