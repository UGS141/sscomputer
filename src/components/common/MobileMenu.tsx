import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, Phone, Mail, CheckCircle, GraduationCap, ShieldCheck, MessageSquare, ChevronRight } from 'lucide-react';
import { SITE_CONFIG, generateWhatsAppUrl } from '../../config/site';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry: (courseTitle?: string) => void;
  onOpenLogin: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onOpenEnquiry,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Menu Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white shadow-2xl flex flex-col justify-between overflow-y-auto z-10 transition-transform duration-300">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-teal-100 flex items-center justify-between bg-[#F7FAF9]">
            <div className="flex items-center gap-2">
              <img src={SITE_CONFIG.logo} alt={SITE_CONFIG.name} className="h-9 w-auto" />
              <div>
                <span className="text-xs font-bold text-[#123B3A] block leading-tight">SSCI</span>
                <span className="text-[9px] text-[#087F78] block leading-none font-semibold">
                  LEARN • PRACTICE • GROW
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            {SITE_CONFIG.navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-teal-50 text-[#087F78]'
                      : 'text-[#123B3A] hover:bg-gray-50 hover:text-[#087F78]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className={`w-4 h-4 ${active ? 'text-[#087F78]' : 'text-gray-300'}`} />
                </Link>
              );
            })}

            <div className="pt-2">
              <Link
                to="/verify-certificate"
                onClick={onClose}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#12A77A] bg-emerald-50/60 hover:bg-emerald-50"
              >
                <CheckCircle className="w-4 h-4 text-[#12A77A]" />
                Verify Certificate
              </Link>
            </div>
          </div>
        </div>

        {/* Footer CTAs & Portal Logins */}
        <div className="p-4 border-t border-teal-100 bg-[#F7FAF9] space-y-2.5">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#087F78] px-1">
            Portal Logins
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                navigate('/student-login');
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-[#087F78] border border-teal-200 bg-white hover:bg-teal-50 shadow-xs"
            >
              <GraduationCap className="w-4 h-4 text-[#087F78]" />
              Student Login
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/admin/login');
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-[#F97316] border border-orange-200 bg-white hover:bg-orange-50 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#F97316]" />
              Admin Login
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenEnquiry();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white brand-gradient-bg shadow-md text-center"
          >
            Enquire Now
          </button>

          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Chat on WhatsApp
          </a>

          <div className="pt-1 text-[11px] text-gray-500 space-y-0.5 text-center">
            <p className="flex items-center justify-center gap-1">
              <Phone className="w-3 h-3 text-[#F97316]" /> {SITE_CONFIG.contact.phonePrimary}
            </p>
            <p className="flex items-center justify-center gap-1">
              <Mail className="w-3 h-3 text-[#087F78]" /> {SITE_CONFIG.contact.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
