import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, ShieldCheck, Phone, MapPin, Info } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { SITE_CONFIG } from '../config/site';

export const StudentLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SEOHead
        title="Student Portal Information | Sri Shanmukha Computer Institute"
        description="Access student portal information, course details, and practical lab access instructions at SSCI Nellore."
        canonicalPath="/student-login"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <img src={SITE_CONFIG.logo} alt={SITE_CONFIG.name} className="h-12 w-auto object-contain" />
          <div className="text-left">
            <span className="text-base font-extrabold text-[#123B3A] block leading-none">SRI SHANMUKHA</span>
            <span className="text-xs font-semibold text-[#087F78] block leading-tight">COMPUTER INSTITUTE</span>
          </div>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-100/80 text-[#087F78] text-xs font-bold uppercase tracking-wider mb-2">
          <GraduationCap className="w-4 h-4 text-[#F97316]" />
          <span>Student Portal</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B3A] tracking-tight">
          Student <span className="brand-gradient-text">Portal Access</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#4B6B69]">
          Student Portal self-service online login is coming soon.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-teal-100 sm:px-10 space-y-6">
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-[#123B3A] space-y-3">
            <div className="flex items-center gap-2 text-[#087F78] font-bold text-sm">
              <Info className="w-5 h-5 shrink-0" />
              <span>Classroom Student Notice</span>
            </div>
            <p className="text-xs text-[#4B6B69] leading-relaxed">
              Student account credentials and practical lab schedules are managed directly by SSCI lab supervisors during classroom enrollment.
            </p>
          </div>

          <div className="space-y-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-[#123B3A] font-semibold">
              <Phone className="w-4 h-4 text-[#087F78]" />
              <span>Contact Admissions: <strong>{SITE_CONFIG.contact.phonePrimary}</strong></span>
            </div>
            <div className="flex items-start gap-2 text-[#123B3A] font-semibold">
              <MapPin className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
              <span>{SITE_CONFIG.contact.address}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <Link to="/" className="inline-flex items-center gap-1 font-bold text-[#087F78] hover:text-[#055C57]">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>

            <Link to="/admin/login" className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-[#087F78]">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" /> Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

