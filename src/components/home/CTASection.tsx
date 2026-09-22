import React from 'react';
import { ArrowRight, MessageSquare, PhoneCall, Sparkles } from 'lucide-react';
import { SITE_CONFIG, generateWhatsAppUrl } from '../../config/site';

interface CTASectionProps {
  onOpenEnquiry: (courseTitle?: string) => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenEnquiry }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-r from-[#123B3A] via-[#087F78] to-[#055C57] rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden text-center sm:text-left border border-teal-700">
          {/* Background overlay graphic */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#F5B72C]" />
                <span>Admission Open for Upcoming Batches</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Ready to Upgrade Your <span className="text-[#F5B72C]">Computer & Coding Skills?</span>
              </h2>

              <p className="text-sm sm:text-base text-teal-100/90 max-w-xl leading-relaxed">
                Join Sri Shanmukha Computer Institute today. Gain hands-on computer practice, expert mentorship, and industry-recognized certifications.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => onOpenEnquiry()}
                className="w-full py-4 px-6 rounded-xl text-base font-bold text-[#123B3A] bg-[#F5B72C] hover:bg-yellow-400 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-500/50 shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${SITE_CONFIG.contact.phonePrimary}`}
                className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-teal-200 hover:text-white transition-colors pt-1"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Call Admissions: {SITE_CONFIG.contact.phonePrimary}</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
