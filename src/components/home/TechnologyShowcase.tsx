import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { cmsStore } from '../../admin/cmsStore';

export interface TechItem {
  name: string;
  category: string;
}

export const DEFAULT_TECH_STACK: TechItem[] = [
  { name: 'C Language', category: 'Programming' },
  { name: 'C++', category: 'Core Coding' },
  { name: 'Java', category: 'Backend & Enterprise' },
  { name: 'Python', category: 'Data & Scripting' },
  { name: 'HTML5 & CSS3', category: 'Web Fundamentals' },
  { name: 'JavaScript ES6+', category: 'Web Logic' },
  { name: 'React 19', category: 'Frontend UI' },
  { name: 'Node.js & Express', category: 'Backend Server' },
  { name: 'SQL & MySQL', category: 'Relational DB' },
  { name: 'MongoDB', category: 'NoSQL DB' },
  { name: 'Tally Prime', category: 'Accounting & GST' },
  { name: 'Advanced Excel', category: 'Business Analytics' },
  { name: 'Power BI', category: 'Business Intelligence' },
  { name: 'Photoshop', category: 'Design & Graphics' },
  { name: 'Git & GitHub', category: 'Version Control' },
  { name: 'AI & ML Tools', category: 'Future Skills' },
];

export const TechnologyShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastActiveCardRef = useRef<HTMLElement | null>(null);

  const [techList, setTechList] = useState<TechItem[]>(DEFAULT_TECH_STACK);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Subscribe to CMS updates if custom floating skills exist
  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      const cmsSkills = cmsStore.getFloatingSkills();
      if (cmsSkills && cmsSkills.length > 0) {
        setTechList(
          cmsSkills.map((s) => ({
            name: s.name,
            category: s.category || 'Technology',
          }))
        );
      }
    });
    return unsubscribe;
  }, []);

  // Check prefers-reduced-motion safely
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Create tripled items array for infinite looping
  const tripledTechList = [...techList, ...techList, ...techList];

  // Direct DOM class toggling to highlight active center card without React re-renders
  const updateCenterHighlight = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    if (containerRect.width === 0) return;
    const containerCenter = containerRect.left + containerRect.width / 2;

    const cards = trackRef.current.children;
    if (!cards || cards.length === 0) return;

    let minDistance = Infinity;
    let closestCard: HTMLElement | null = null;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      if (!card) continue;
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestCard = card;
      }
    }

    if (closestCard && closestCard !== lastActiveCardRef.current) {
      if (lastActiveCardRef.current) {
        lastActiveCardRef.current.classList.remove('tech-card-active');
      }
      closestCard.classList.add('tech-card-active');
      lastActiveCardRef.current = closestCard;
    }
  }, []);

  useEffect(() => {
    let animFrameId: number;
    const loop = () => {
      updateCenterHighlight();
      animFrameId = requestAnimationFrame(loop);
    };
    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, [updateCenterHighlight]);

  return (
    <div className="relative w-full py-8 my-2 overflow-hidden select-none">
      
      {/* Subtle Center Focus Indicator (Vertical Glowing Line & Beacons) */}
      <div className="absolute inset-0 pointer-events-none flex justify-center z-20">
        <div className="relative h-full flex flex-col items-center justify-between">
          <span className="w-2.5 h-2.5 rounded-full bg-[#087F78] shadow-[0_0_12px_#087F78] animate-pulse" />
          <div className="w-[1.5px] h-full bg-gradient-to-b from-[#087F78]/5 via-[#12A77A]/30 to-[#087F78]/5 shadow-[0_0_8px_rgba(8,127,120,0.5)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#12A77A] shadow-[0_0_12px_#12A77A] animate-pulse" />
        </div>
      </div>

      {/* Edge Gradient Blurs */}
      <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-15 hidden sm:block" />
      <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-15 hidden sm:block" />

      {/* Main Track Container */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="w-full overflow-x-auto scrollbar-none py-6 px-4 snap-x snap-mandatory touch-pan-x"
      >
        <div
          ref={trackRef}
          className={`flex items-center space-x-4 sm:space-x-6 w-max ${
            !prefersReducedMotion ? 'animate-marquee' : ''
          }`}
          style={{
            animationDuration: '28s',
            animationPlayState: isPaused || prefersReducedMotion ? 'paused' : 'running',
            willChange: 'transform',
          }}
        >
          {tripledTechList.map((tech, idx) => (
            <div
              key={`${tech.name}-${idx}`}
              className="transition-all duration-500 ease-in-out rounded-2xl cursor-pointer shrink-0 snap-center px-4 sm:px-5 py-2.5 sm:py-3 bg-white/95 backdrop-blur-sm border border-teal-100/90 text-[#123B3A] shadow-xs hover:border-[#087F78]/50 hover:bg-teal-50/50 opacity-80 scale-95 sm:scale-100"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="tech-card-icon p-1.5 sm:p-2 rounded-xl transition-colors bg-teal-50 text-[#087F78]">
                  <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="tech-card-title text-sm sm:text-base font-extrabold tracking-tight transition-colors whitespace-nowrap text-[#123B3A]">
                      {tech.name}
                    </h4>
                    <span className="tech-card-beacon hidden w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                  </div>
                  <p className="tech-card-subtext text-[10px] sm:text-[11px] font-semibold tracking-wide block whitespace-nowrap transition-colors text-[#4B6B69]">
                    {tech.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
