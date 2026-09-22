import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

export const JOURNEY_STEPS = [
  { step: '01', title: 'Choose Your Course', desc: 'Browse our catalog and select a course aligned with your learning goals.' },
  { step: '02', title: 'Join Your Batch', desc: 'Select a convenient morning, afternoon, evening, or weekend batch schedule.' },
  { step: '03', title: 'Learn the Concepts', desc: 'Attend interactive classroom lectures guided by experienced instructors.' },
  { step: '04', title: 'Practice in the Lab', desc: 'Perform hands-on computer exercises on your individual lab workstation.' },
  { step: '05', title: 'Build Projects', desc: 'Apply concepts to real-world capstone projects to build a strong portfolio.' },
  { step: '06', title: 'Take Assessments', desc: 'Evaluate your practical competence through lab exams and code reviews.' },
  { step: '07', title: 'Earn Certification', desc: 'Receive an official SSCI Course Completion Certificate with online verification.' },
  { step: '08', title: 'Continue Your Career', desc: 'Apply your practical digital & programming skills to higher studies or jobs.' },
];

export const StudentJourney: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-teal-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-[#087F78] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#F97316]" />
            <span>Step-by-Step Learning Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
            Your <span className="brand-gradient-text">Student Journey</span> at SSCI
          </h2>
          <p className="text-base text-[#4B6B69]">
            From your very first enquiry to course completion and certification.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {JOURNEY_STEPS.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#F7FAF9] border border-teal-100 relative group hover:bg-white hover:shadow-xl transition-all duration-300 card-hover-effect flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl brand-gradient-bg text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Step {idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-[#4B6B69] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-100 text-[11px] font-semibold text-[#12A77A]">
                SSCI Milestone
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
