import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, BookOpen, Monitor, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

export const InstitutePreview: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-teal-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual & Logo */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F7FAF9] rounded-3xl p-8 border border-teal-100 shadow-lg text-center relative overflow-hidden">
              <img
                src={SITE_CONFIG.logo}
                alt={SITE_CONFIG.name}
                className="h-28 mx-auto object-contain mb-4"
              />
              <h3 className="text-xl font-extrabold text-[#123B3A]">
                Sri Shanmukha Computer Institute
              </h3>
              <p className="text-xs font-bold text-[#087F78] uppercase tracking-widest mt-1">
                {SITE_CONFIG.tagline}
              </p>

              <div className="mt-6 pt-6 border-t border-teal-200/60 grid grid-cols-2 gap-4 text-left text-xs">
                <div className="bg-white p-3 rounded-xl border border-teal-100">
                  <Monitor className="w-5 h-5 text-[#087F78] mb-1" />
                  <span className="font-bold text-[#123B3A] block">100% PC Lab</span>
                  <span className="text-gray-500">Individual workstations</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-100">
                  <BookOpen className="w-5 h-3.5 text-[#F97316] mb-1" />
                  <span className="font-bold text-[#123B3A] block">Structured Syllabus</span>
                  <span className="text-gray-500">Step-by-step guidance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission & Positioning */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#087F78] uppercase tracking-widest block mb-1">
                Empowering Students Through Practical Education
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
                About <span className="brand-gradient-text">SSCI Institute</span>
              </h2>
            </div>

            <p className="text-base text-[#4B6B69] leading-relaxed">
              Sri Shanmukha Computer Institute (SSCI) is focused on helping students build practical computer, programming, digital and professional skills through structured learning and hands-on computer lab training.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#F7FAF9] border border-teal-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#123B3A]">
                  <Target className="w-4 h-4 text-[#087F78]" />
                  <span>Our Mission</span>
                </div>
                <p className="text-xs text-[#4B6B69] leading-relaxed">
                  To deliver accessible, career-focused computer education that equips students with real confidence and job-ready digital capabilities.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7FAF9] border border-teal-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#123B3A]">
                  <Eye className="w-4 h-4 text-[#F97316]" />
                  <span>Our Vision</span>
                </div>
                <p className="text-xs text-[#4B6B69] leading-relaxed">
                  To be the trusted local destination for practical software, programming, and accounting training for school, college, and working learners.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white brand-gradient-bg shadow-md hover:shadow-lg transition-all"
              >
                <span>Read Full Institute Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
