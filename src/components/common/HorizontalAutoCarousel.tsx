import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalAutoCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey: (item: T, index: number) => string;
  speedSeconds?: number;
  itemClassName?: string;
  ariaLabel?: string;
}

export function HorizontalAutoCarousel<T>({
  items,
  renderItem,
  getItemKey,
  speedSeconds = 25,
  itemClassName = 'w-[85vw] sm:w-[340px] md:w-[360px] lg:w-[380px] shrink-0',
  ariaLabel = 'Content carousel',
}: HorizontalAutoCarouselProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check user prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Manual scroll handler for Left/Right controls
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!items || items.length === 0) return null;

  // Duplicate items twice for seamless continuous infinite marquee looping
  const displayItems = [...items, ...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden group/carousel py-2"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Subtle Navigation Buttons (Left & Right) */}
      <button
        onClick={() => handleScroll('left')}
        aria-label={`Previous ${ariaLabel}`}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-teal-200/80 text-[#087F78] shadow-md hover:bg-[#087F78] hover:text-white hover:border-[#087F78] transition-all flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hidden sm:flex"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => handleScroll('right')}
        aria-label={`Next ${ariaLabel}`}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-teal-200/80 text-[#087F78] shadow-md hover:bg-[#087F78] hover:text-white hover:border-[#087F78] transition-all flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hidden sm:flex"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Scroll Track */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch overflow-x-auto scrollbar-none snap-x snap-mandatory px-4 sm:px-6 lg:px-8 space-x-5 touch-pan-x"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          className={`flex items-stretch space-x-5 ${
            !prefersReducedMotion ? 'animate-marquee' : ''
          }`}
          style={{
            animationDuration: `${speedSeconds}s`,
            animationPlayState: isPaused || prefersReducedMotion ? 'paused' : 'running',
            willChange: 'transform',
          }}
        >
          {displayItems.map((item, idx) => (
            <div key={`${getItemKey(item, idx)}-${idx}`} className={itemClassName}>
              {renderItem(item, idx % items.length)}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Edge Blurs for smooth visual entry/exit */}
      <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/70 to-transparent pointer-events-none z-10 hidden sm:block" />
      <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/70 to-transparent pointer-events-none z-10 hidden sm:block" />
    </div>
  );
}
