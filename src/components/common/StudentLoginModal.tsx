import React from 'react';
import { X, Info, Phone, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-teal-100">
        <div className="bg-[#123B3A] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={SITE_CONFIG.logo} alt={SITE_CONFIG.name} className="h-8 w-auto bg-white p-1 rounded-md" />
            <div>
              <span className="text-xs font-bold text-teal-300 block leading-tight">SSCI Student Portal</span>
              <h3 className="text-base font-extrabold text-white">Student Portal Notice</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-teal-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-[#123B3A] space-y-2">
            <div className="flex items-center gap-2 text-[#087F78] font-bold text-sm">
              <Info className="w-5 h-5 shrink-0" />
              <span>Student Access Information</span>
            </div>
            <p className="text-xs text-[#4B6B69] leading-relaxed">
              Student enrollment credentials, course materials, and practical computer lab schedules are issued directly at SSCI Nellore. Online self-service login will be launched in an upcoming update.
            </p>
          </div>

          <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 font-semibold text-[#123B3A]">
              <Phone className="w-4 h-4 text-[#087F78]" />
              <span>Phone: {SITE_CONFIG.contact.phonePrimary}</span>
            </div>
            <div className="flex items-start gap-2 font-semibold text-[#123B3A]">
              <MapPin className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
              <span>{SITE_CONFIG.contact.address}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white brand-gradient-bg shadow-md"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
};

