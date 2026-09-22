import React from 'react';
import { Laptop, GraduationCap, MonitorCheck, BookOpenCheck, FolderKanban, HelpCircle, Briefcase, Award } from 'lucide-react';

export const WHY_SSCI_FEATURES = [
  {
    icon: Laptop,
    title: 'Practical Learning',
    description: 'Learn by doing instead of only studying theory. Every concept is accompanied by immediate computer lab application.',
    color: 'text-[#087F78]',
    bg: 'bg-teal-50 border-teal-100',
  },
  {
    icon: GraduationCap,
    title: 'Experienced Trainers',
    description: 'Learn concepts through structured guidance from passionate instructors with extensive technical and teaching expertise.',
    color: 'text-[#12A77A]',
    bg: 'bg-emerald-50 border-emerald-100',
  },
  {
    icon: MonitorCheck,
    title: 'Hands-on Computer Practice',
    description: 'Build total confidence through dedicated PC workstations for every student during practical lab hours.',
    color: 'text-[#F97316]',
    bg: 'bg-orange-50 border-orange-100',
  },
  {
    icon: BookOpenCheck,
    title: 'Structured Curriculum',
    description: 'Follow a clear step-by-step syllabus from basic concepts to advanced practical implementation.',
    color: 'text-[#F5B72C]',
    bg: 'bg-amber-50 border-amber-100',
  },
  {
    icon: FolderKanban,
    title: 'Real Projects',
    description: 'Apply learned skills to practical real-world capstone projects to showcase in your portfolio.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-100',
  },
  {
    icon: HelpCircle,
    title: 'Personal Guidance',
    description: 'Get individual attention, doubt clearance, and batch support whenever you encounter challenges.',
    color: 'text-[#087F78]',
    bg: 'bg-teal-50 border-teal-100',
  },
  {
    icon: Briefcase,
    title: 'Career-Focused Skills',
    description: 'Master digital and programming capabilities directly relevant to today’s modern workplace.',
    color: 'text-pink-600',
    bg: 'bg-pink-50 border-pink-100',
  },
  {
    icon: Award,
    title: 'Official Certification',
    description: 'Receive an official SSCI course completion certificate with online authenticity verification.',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-100',
  },
];

export const WhySSCI: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-teal-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-widest block">
            The SSCI Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
            Why Students <span className="brand-gradient-text">Choose SSCI</span>
          </h2>
          <p className="text-base text-[#4B6B69]">
            We provide a supportive, hands-on learning environment designed to transform beginners into confident technology practitioners.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_SSCI_FEATURES.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F7FAF9] border border-teal-100 shadow-xs hover:shadow-xl hover:bg-white transition-all duration-300 group card-hover-effect flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#4B6B69] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
