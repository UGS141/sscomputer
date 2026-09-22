import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Target, Eye, MonitorCheck, Award, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { FACULTY_TRAINERS } from '../data/trainers';

interface AboutPageProps {
  onOpenEnquiry: (courseTitle?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenEnquiry }) => {
  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-teal-200">
            <Breadcrumb items={[{ label: 'About SSCI' }]} />
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Empowering Students Through <br className="hidden sm:inline" />
            <span className="text-[#F5B72C]">Practical Computer Education</span>
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-3xl leading-relaxed">
            Sri Shanmukha Computer Institute (SSCI) is dedicated to building real computer literacy, software programming expertise, and career-ready digital capabilities with structured classroom guidance and daily 1:1 lab practice.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Core Institute Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold text-[#087F78] uppercase tracking-widest block">
              Our Training Philosophy
            </span>
            <h2 className="text-3xl font-extrabold text-[#123B3A]">
              Why Practical Computer Training Matters
            </h2>
            <p className="text-sm text-[#4B6B69] leading-relaxed">
              We believe true tech confidence comes from doing, not just reading. In traditional academic setups, students often study coding or software features on paper without spending sufficient time on real keyboards.
            </p>
            <p className="text-sm text-[#4B6B69] leading-relaxed">
              At SSCI, every lecture is followed by immediate hands-on lab sessions. Students write C pointers, construct SQL queries, format Excel sheets, and debug React components directly on desktop workstations with dedicated trainer guidance.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-xs flex items-center gap-3">
                <MonitorCheck className="w-8 h-8 text-[#087F78] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#123B3A]">1:1 Computer Access</h4>
                  <p className="text-xs text-gray-500">Every student gets a PC</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-xs flex items-center gap-3">
                <Award className="w-8 h-8 text-[#F97316] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#123B3A]">Verified Certification</h4>
                  <p className="text-xs text-gray-500">Online credentials</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl border border-teal-100 shadow-xl space-y-6 text-center">
              <img src={SITE_CONFIG.logo} alt={SITE_CONFIG.name} className="h-24 mx-auto object-contain" />
              <div>
                <h3 className="text-xl font-extrabold text-[#123B3A]">{SITE_CONFIG.name}</h3>
                <p className="text-xs font-bold text-[#087F78] uppercase tracking-wider mt-1">{SITE_CONFIG.tagline}</p>
              </div>

              <div className="space-y-2.5 text-xs text-[#4B6B69] text-left pt-2 border-t border-gray-100">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#12A77A]" /> 100% Practical Computer Lab Focus
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#12A77A]" /> Small Batch Sizes for Personal Guidance
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#12A77A]" /> Industry-Oriented Course Syllabus
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#12A77A]" /> Flexible Morning & Evening Timings
                </p>
              </div>

              <button
                onClick={() => onOpenEnquiry()}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white brand-gradient-bg shadow-md"
              >
                Enquire for Admission
              </button>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-teal-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#087F78] flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#123B3A]">Our Mission</h3>
            <p className="text-xs text-[#4B6B69] leading-relaxed">
              To empower students, school learners, graduates, and working professionals with practical, industry-aligned computer training that fosters confidence, technical competence, and digital career growth.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-teal-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#123B3A]">Our Vision</h3>
            <p className="text-xs text-[#4B6B69] leading-relaxed">
              To be recognized as the premier computer education institute known for practical excellence, individual student care, modern technical curriculum, and verifiable certification standards.
            </p>
          </div>
        </div>

        {/* Trainer Faculty Preview */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider">Experienced Mentors</span>
            <h2 className="text-3xl font-extrabold text-[#123B3A]">Meet Our Trainers</h2>
            <p className="text-xs text-[#4B6B69]">Our faculty members are dedicated computer professionals focused on guiding every student.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACULTY_TRAINERS.map((trainer) => (
              <div key={trainer.id} className="bg-white p-6 rounded-2xl border border-teal-100 text-center space-y-3 shadow-xs">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${trainer.gradient} text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-md`}>
                  {trainer.avatarText}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#123B3A]">{trainer.name}</h4>
                  <p className="text-xs font-semibold text-[#087F78]">{trainer.designation}</p>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{trainer.bio}</p>
                <div className="pt-2 border-t border-gray-100 text-[10px] font-bold text-teal-700">
                  {trainer.experience}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
