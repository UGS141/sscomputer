import React from 'react';
import { BookOpen, Users, MonitorCheck, Award } from 'lucide-react';

export const STATS_DATA = [
  {
    id: 'stat-courses',
    value: '10+',
    label: 'Structured Courses',
    subtext: 'From Basics to Advanced Coding',
    icon: BookOpen,
    color: 'text-[#087F78]',
    bg: 'bg-teal-50 border-teal-100',
  },
  {
    id: 'stat-students',
    value: '100+',
    label: 'Students Trained',
    subtext: 'Building Practical Skills',
    icon: Users,
    color: 'text-[#12A77A]',
    bg: 'bg-emerald-50 border-emerald-100',
  },
  {
    id: 'stat-lab',
    value: '1 : 1',
    label: 'Practical PC Access',
    subtext: 'Individual Desktop Workstations',
    icon: MonitorCheck,
    color: 'text-[#F97316]',
    bg: 'bg-orange-50 border-orange-100',
  },
  {
    id: 'stat-hands-on',
    value: '100%',
    label: 'Hands-on Learning',
    subtext: 'Theory + Daily Lab Practice',
    icon: Award,
    color: 'text-[#F5B72C]',
    bg: 'bg-amber-50 border-amber-100',
  },
];

export const StatsSection: React.FC = () => {
  return (
    <section className="py-10 bg-white border-b border-teal-100/60 shadow-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS_DATA.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className={`p-5 sm:p-6 rounded-2xl border ${stat.bg} flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
              >
                <div className={`p-3 rounded-xl bg-white shadow-xs ${stat.color} shrink-0`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-[#123B3A] mt-0.5">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
