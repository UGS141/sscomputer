import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export const ReturnToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScroll = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Visibility threshold (around 380px)
    if (currentScroll > 380) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // Calculate progress percentage
    if (totalHeight > 0) {
      const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setScrollProgress(progress);
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  // SVG Progress Ring calculations (radius 20, circumference ~125.66)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Return to top"
      type="button"
      className={`fixed bottom-20 right-4 sm:bottom-28 sm:right-6 z-40 group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#123B3A]/90 backdrop-blur-md text-white border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B72C]`}
    >
      {/* Scroll Progress Ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1"
        viewBox="0 0 48 48"
      >
        {/* Background Ring Track */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="text-white/15"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
        />
        {/* Active Progress Ring */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="text-[#F5B72C] transition-all duration-150 ease-out"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
        />
      </svg>

      {/* Arrow Icon */}
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:-translate-y-0.5 transition-transform duration-200 relative z-10" />
    </button>
  );
};
