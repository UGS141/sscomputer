import React, { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';
import { cmsStore } from '../../admin/cmsStore';
import { trackSEOEvent } from '../../seo/analytics';

export const InstagramFloat: React.FC = () => {
  const [instagramUrl, setInstagramUrl] = useState<string>(
    () => cmsStore.getSettings()?.social?.instagram || SITE_CONFIG.social.instagram
  );

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      const updatedUrl = cmsStore.getSettings()?.social?.instagram;
      if (updatedUrl) {
        setInstagramUrl(updatedUrl);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <a
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit SSCI on Instagram"
      onClick={() => trackSEOEvent('social_click', { platform: 'instagram', location: 'floating_button' })}
      className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 group flex items-center gap-2.5 p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#123B3A] border border-teal-100 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F78]"
    >
      {/* Instagram Gradient Icon Badge */}
      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:rotate-6 transition-transform duration-300">
        <Instagram className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </span>

      {/* Label Text (Desktop/Tablet display) */}
      <span className="hidden sm:inline-block text-xs font-extrabold tracking-wide text-[#123B3A] pr-1">
        Follow SSCI
      </span>
    </a>
  );
};
