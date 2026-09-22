import React from 'react';
import { Code2, Database, BarChart3, FileSpreadsheet, Cpu, Sparkles, Layers, Terminal } from 'lucide-react';

export interface FloatingSkill {
  id: string;
  name: string;
  category: string;
  icon: React.FC<{ className?: string }>;
  accentColor: string;
  dotColor: string;
  badgeBg: string;
  positionClass: string;
  mobileVisible?: boolean;
  duration: string;
  delay: string;
  depthScale?: string;
}

export const FLOATING_SKILLS: FloatingSkill[] = [
  {
    id: 'skill-python',
    name: 'Python',
    category: 'Programming',
    icon: Code2,
    accentColor: 'text-[#12A77A]',
    dotColor: 'bg-[#12A77A]',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    positionClass: '-top-6 -left-8 lg:-left-12',
    mobileVisible: true,
    duration: '6.1s',
    delay: '0s',
    depthScale: 'scale-100',
  },
  {
    id: 'skill-excel',
    name: 'MS Excel',
    category: 'Analytics',
    icon: FileSpreadsheet,
    accentColor: 'text-[#087F78]',
    dotColor: 'bg-[#087F78]',
    badgeBg: 'bg-teal-50 border-teal-200',
    positionClass: 'top-16 -left-12 lg:-left-20',
    mobileVisible: true,
    duration: '5.2s',
    delay: '0.8s',
    depthScale: 'scale-95',
  },
  {
    id: 'skill-react',
    name: 'React',
    category: 'Web UI',
    icon: Code2,
    accentColor: 'text-cyan-600',
    dotColor: 'bg-cyan-500',
    badgeBg: 'bg-cyan-50 border-cyan-200',
    positionClass: '-top-8 right-4 lg:-right-6',
    mobileVisible: true,
    duration: '4.8s',
    delay: '1.2s',
    depthScale: 'scale-105',
  },
  {
    id: 'skill-tally',
    name: 'Tally Prime',
    category: 'Accounting',
    icon: BarChart3,
    accentColor: 'text-[#F5B72C]',
    dotColor: 'bg-[#F5B72C]',
    badgeBg: 'bg-amber-50 border-amber-200',
    positionClass: 'top-44 -left-10 lg:-left-16',
    mobileVisible: false,
    duration: '5.8s',
    delay: '0.4s',
    depthScale: 'scale-95',
  },
  {
    id: 'skill-java',
    name: 'Java',
    category: 'Enterprise',
    icon: Terminal,
    accentColor: 'text-[#F97316]',
    dotColor: 'bg-[#F97316]',
    badgeBg: 'bg-orange-50 border-orange-200',
    positionClass: 'top-20 -right-10 lg:-right-16',
    mobileVisible: true,
    duration: '6.5s',
    delay: '1.6s',
    depthScale: 'scale-100',
  },
  {
    id: 'skill-sql',
    name: 'SQL & MySQL',
    category: 'Database',
    icon: Database,
    accentColor: 'text-blue-600',
    dotColor: 'bg-blue-500',
    badgeBg: 'bg-blue-50 border-blue-200',
    positionClass: 'bottom-20 -right-8 lg:-right-14',
    mobileVisible: false,
    duration: '5.4s',
    delay: '0.6s',
    depthScale: 'scale-95',
  },
  {
    id: 'skill-powerbi',
    name: 'Power BI',
    category: 'Data Analytics',
    icon: BarChart3,
    accentColor: 'text-amber-600',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50 border-amber-200',
    positionClass: 'bottom-4 -right-4 lg:-right-8',
    mobileVisible: false,
    duration: '6.2s',
    delay: '1.0s',
    depthScale: 'scale-100',
  },
  {
    id: 'skill-fullstack',
    name: 'Full Stack',
    category: 'Web Engineer',
    icon: Layers,
    accentColor: 'text-[#087F78]',
    dotColor: 'bg-[#087F78]',
    badgeBg: 'bg-teal-50 border-teal-200',
    positionClass: '-bottom-10 left-12 lg:left-24',
    mobileVisible: false,
    duration: '5.6s',
    delay: '1.4s',
    depthScale: 'scale-105',
  },
  {
    id: 'skill-cpp',
    name: 'C & C++',
    category: 'Core Coding',
    icon: Cpu,
    accentColor: 'text-emerald-700',
    dotColor: 'bg-emerald-600',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    positionClass: '-top-12 left-1/3',
    mobileVisible: false,
    duration: '5.0s',
    delay: '0.3s',
    depthScale: 'scale-90',
  },
  {
    id: 'skill-ai',
    name: 'AI & ML',
    category: 'Future Tech',
    icon: Sparkles,
    accentColor: 'text-[#F97316]',
    dotColor: 'bg-[#F97316]',
    badgeBg: 'bg-orange-50 border-orange-200',
    positionClass: '-bottom-8 -left-6 lg:-left-10',
    mobileVisible: false,
    duration: '6.8s',
    delay: '0.9s',
    depthScale: 'scale-95',
  }
];

export const FloatingTechnologies: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden sm:overflow-visible">
      {FLOATING_SKILLS.map((skill) => {
        const IconComp = skill.icon;
        return (
          <div
            key={skill.id}
            style={
              {
                '--float-duration': skill.duration,
                '--float-delay': skill.delay,
              } as React.CSSProperties
            }
            className={`absolute ${skill.positionClass} ${
              skill.mobileVisible ? 'flex' : 'hidden md:flex'
            } items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_8px_25px_rgba(8,127,120,0.10)] transition-all duration-300 pointer-events-auto hover:-translate-y-1 hover:bg-white/95 hover:shadow-xl hover:border-[#087F78]/40 animate-float-card ${
              skill.depthScale || 'scale-100'
            }`}
          >
            {/* Colored Accent Indicator Dot */}
            <span className={`w-2 h-2 rounded-full ${skill.dotColor} shrink-0 animate-pulse-subtle`} />

            {/* Icon */}
            <IconComp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${skill.accentColor} shrink-0`} />

            {/* Label Text */}
            <span className="text-xs sm:text-xs font-extrabold text-[#123B3A] tracking-tight whitespace-nowrap">
              {skill.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
