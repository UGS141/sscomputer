import React from 'react';
import { Code2, Sparkles } from 'lucide-react';

export const TECH_BADGES = [
  { name: 'C Language', category: 'Programming', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  { name: 'C++', category: 'Programming', color: 'bg-[#087F78] text-white border-transparent' },
  { name: 'Java', category: 'Backend & Enterprise', color: 'bg-orange-50 text-orange-800 border-orange-200' },
  { name: 'Python', category: 'Data & Scripting', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { name: 'HTML5 & CSS3', category: 'Web Fundamentals', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { name: 'JavaScript ES6+', category: 'Web Logic', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { name: 'React 19', category: 'Frontend UI', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  { name: 'Node.js & Express', category: 'Backend Server', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { name: 'SQL & MySQL', category: 'Relational DB', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { name: 'MongoDB', category: 'NoSQL DB', color: 'bg-green-50 text-green-800 border-green-200' },
  { name: 'Tally Prime', category: 'Accounting & GST', color: 'bg-teal-100 text-teal-900 border-teal-300' },
  { name: 'Advanced Excel', category: 'Business Data', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { name: 'Power BI', category: 'Business Intelligence', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { name: 'Photoshop', category: 'Design & Graphics', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  { name: 'Git & GitHub', category: 'Version Control', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { name: 'AI & ML Tools', category: 'Future Skills', color: 'bg-purple-100 text-purple-900 border-purple-300' },
];

export const TechnologySection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-teal-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
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

        {/* Animated Tech Badges Grid */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto">
          {TECH_BADGES.map((tech, idx) => (
            <div
              key={idx}
              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold shadow-xs hover:shadow-md hover:scale-105 transition-all duration-200 cursor-default flex items-center gap-2 ${tech.color}`}
            >
              <Sparkles className="w-3.5 h-3.5 opacity-70" />
              <span>{tech.name}</span>
              <span className="text-[10px] opacity-75 font-medium ml-1">({tech.category})</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
