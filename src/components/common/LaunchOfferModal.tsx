import React, { useEffect } from 'react';
import { X, Sparkles, Gift, ArrowRight, Tag } from 'lucide-react';
import { LAUNCH_OFFER_CONFIG } from '../../config/launchOffer';
import { LaunchOfferCountdown } from './LaunchOfferCountdown';
import { trackSEOEvent } from '../../seo/analytics';

interface LaunchOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterNow: (courseTitle?: string) => void;
}

export const LaunchOfferModal: React.FC<LaunchOfferModalProps> = ({
  isOpen,
  onClose,
  onRegisterNow,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRegister = () => {
    trackSEOEvent('course_enquiry', { course: 'Launch Offer 20% OFF' });
    onClose();
    onRegisterNow('Launch Offer - 20% OFF All Courses');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="SSCI Website Launch 20% OFF Special Offer"
    >
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-300 border border-teal-100">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close launch offer modal"
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero Branding Banner */}
        <div className="bg-gradient-to-br from-[#123B3A] via-[#087F78] to-[#123B3A] p-6 text-white text-center relative overflow-hidden">
          {/* Subtle Decorative Accents */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#F5B72C]/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-teal-300/10 rounded-full blur-xl pointer-events-none" />

          {/* Limited Time Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5B72C]/20 border border-[#F5B72C]/40 text-[#F5B72C] text-[11px] font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B72C]" />
            <span>{LAUNCH_OFFER_CONFIG.subtitle}</span>
          </div>

          {/* Discount Headline */}
          <div className="space-y-0.5">
            <h3 className="text-4xl sm:text-5xl font-black text-[#F5B72C] tracking-tight drop-shadow-sm">
              {LAUNCH_OFFER_CONFIG.discountBadge}
            </h3>
            <p className="text-base sm:text-lg font-extrabold text-white tracking-wide uppercase">
              ON ALL COURSES
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center space-y-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed max-w-xs mx-auto">
            {LAUNCH_OFFER_CONFIG.description}
          </p>

          {/* Live Countdown Timer */}
          <LaunchOfferCountdown expiresAt={LAUNCH_OFFER_CONFIG.expiresAt} />

          {/* Primary CTA Button */}
          <button
            onClick={handleRegister}
            type="button"
            className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white brand-gradient-bg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Gift className="w-4 h-4 text-[#F5B72C]" />
            <span>{LAUNCH_OFFER_CONFIG.ctaText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Footer Note */}
          <p className="text-[11px] font-medium text-gray-400 flex items-center justify-center gap-1">
            <Tag className="w-3 h-3 text-[#087F78]" />
            <span>Offer valid for one week from launch • T&C Apply</span>
          </p>
        </div>
      </div>
    </div>
  );
};
