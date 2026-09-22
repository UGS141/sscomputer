import React from 'react';
import { GraduationCap, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { FACULTY_TRAINERS } from '../data/trainers';
import type { Trainer } from '../data/trainers';
import { Breadcrumb } from '../components/common/Breadcrumb';

interface TrainersPageProps {
  onOpenEnquiry: (courseTitle?: string) => void;
}

export const TrainersPage: React.FC<TrainersPageProps> = ({ onOpenEnquiry }) => {
  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen pb-16">
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-teal-200">
            <Breadcrumb items={[{ label: 'Faculty & Trainers' }]} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Expert <span className="text-[#F5B72C]">Faculty & Mentors</span>
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl leading-relaxed">
            Meet the experienced educators dedicated to guiding SSCI students through structured lectures and 1:1 practical computer lab mentorship.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FACULTY_TRAINERS.map((trainer: Trainer) => (
            <div key={trainer.id} className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-4 flex flex-col justify-between">
              <div>
                <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${trainer.gradient} text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-lg mb-3`}>
                  {trainer.avatarText}
                </div>

                <h3 className="text-xl font-bold text-[#123B3A]">{trainer.name}</h3>
                <p className="text-xs font-bold text-[#087F78]">{trainer.designation}</p>

                <p className="text-xs text-[#4B6B69] leading-relaxed my-3">{trainer.bio}</p>

                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-[#123B3A] uppercase tracking-wider block">Specializations:</span>
                  <div className="flex flex-wrap justify-center gap-1">
                    {trainer.specialization.map((spec, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-teal-50 text-[10px] font-semibold text-[#087F78]">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenEnquiry(trainer.designation)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white brand-gradient-bg"
              >
                Connect With Mentor
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
