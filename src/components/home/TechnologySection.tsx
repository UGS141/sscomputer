import React from 'react';
import { Code2 } from 'lucide-react';
import { TechnologyShowcase, DEFAULT_TECH_STACK } from './TechnologyShowcase';

export { DEFAULT_TECH_STACK as TECH_BADGES };

export const TechnologySection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-teal-100/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-[#087F78] text-xs font-bold uppercase tracking-wider">
            <Code2 className="w-4 h-4 text-[#F97316]" />
            <span>Modern Industry Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
            Learn the Tools That <span className="brand-gradient-text">Power the Digital World</span>
          </h2>
          <p className="text-base text-[#4B6B69]">
            From fundamental programming syntax to modern web frameworks, accounting software, and data analytics engines.
          </p>
        </div>

        {/* Premium Horizontal Technology Showcase */}
        <TechnologyShowcase />

      </div>
    </section>
  );
};

