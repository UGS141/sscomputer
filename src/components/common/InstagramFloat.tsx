import React, { useState, useEffect } from 'react';
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
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </span>

      {/* Label Text (Desktop/Tablet display) */}
      <span className="hidden sm:inline-block text-xs font-extrabold tracking-wide text-[#123B3A] pr-1">
        Follow SSCI
      </span>
    </a>
  );
};
