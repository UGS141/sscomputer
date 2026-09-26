import React from 'react';
import { MessageSquare } from 'lucide-react';
import { generateWhatsAppUrl } from '../../config/site';
import { trackSEOEvent } from '../../seo/analytics';

export const WhatsAppButton: React.FC = () => {
  return (
    <a
      href={generateWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => trackSEOEvent('whatsapp_click', { location: 'floating_button' })}
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-[#25D366] text-white font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
    >
      <MessageSquare className="w-6 h-6 fill-white text-[#25D366]" />
      <span className="hidden sm:inline text-xs font-bold tracking-wide">
        Chat on WhatsApp
      </span>
      <span className="flex h-2.5 w-2.5 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>
    </a>
  );
};
