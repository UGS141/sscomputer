import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Monitor, ArrowRight, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';
import { FloatingTechnologies } from './FloatingTechnologies';

interface HeroProps {
  onOpenEnquiry: (courseTitle?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7FAF9] via-teal-50/30 to-[#F7FAF9] pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-teal-100/50">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-teal-200/30 to-emerald-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-200/20 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left transition-all duration-500">
            {/* Institute Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-300/60 text-[#087F78] text-xs font-bold tracking-wide uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Sri Shanmukha Computer Institute</span>
              <span className="hidden sm:inline text-teal-400">•</span>
              <span className="hidden sm:inline text-[#F5B72C]">{SITE_CONFIG.tagline}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#123B3A] tracking-tight leading-[1.15]">
              Learn Today.{' '}
              <span className="brand-gradient-text block sm:inline">
                Build Your Future Tomorrow.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#4B6B69] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Practical computer education, programming, digital skills and career-focused training designed to help students learn with confidence through 100% hands-on lab practice.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/courses"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold text-white brand-gradient-bg shadow-lg shadow-teal-700/25 hover:shadow-xl hover:shadow-teal-700/35 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => onOpenEnquiry()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold text-[#087F78] bg-white border-2 border-teal-200 hover:border-[#087F78] hover:bg-teal-50/50 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
              >
                Enquire Now
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-teal-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-[#12A77A] shrink-0" />
                <span className="text-xs font-bold text-[#123B3A]">Practical Training</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0" />
                <span className="text-xs font-bold text-[#123B3A]">Experienced Trainers</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-[#087F78] shrink-0" />
                <span className="text-xs font-bold text-[#123B3A]">Hands-on Lab</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-[#F5B72C] shrink-0" />
                <span className="text-xs font-bold text-[#123B3A]">Certification</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Composition */}
          <div className="lg:col-span-5 relative transition-all duration-500">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Floating Technology Chips Ecosystem */}
              <FloatingTechnologies />

              {/* Main Card Graphic Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-100/80 relative overflow-hidden z-10">
                <div className="absolute top-0 right-0 w-32 h-32 brand-gradient-bg opacity-10 rounded-bl-full pointer-events-none" />

                {/* Primary Brand Logo Presentation */}
                <div className="text-center pb-6 border-b border-gray-100">
                  <img
                    src={SITE_CONFIG.logo}
                    alt={SITE_CONFIG.name}
                    className="h-24 sm:h-28 mx-auto object-contain drop-shadow-sm"
                  />
                  <div className="mt-3">
                    <span className="text-[#087F78] font-extrabold text-sm tracking-widest uppercase block">
                      SSCI ACADEMY
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase block">
                      Structured Classroom & Lab Education
                    </span>
                  </div>
                </div>

                {/* Code Snippet Card Preview */}
                <div className="mt-6 bg-[#123B3A] rounded-2xl p-4 text-left shadow-inner font-mono text-xs text-teal-200 space-y-2 border border-teal-800">
                  <div className="flex items-center justify-between border-b border-teal-800 pb-2 mb-2 text-[10px] text-teal-400 font-sans">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="ml-2 font-medium">ssci_learning_lab.py</span>
                    </div>
                    <span className="text-[#F5B72C] font-semibold">&lt;/&gt; SSCI</span>
                  </div>
                  <p className="text-[#F97316]">class <span className="text-white">SSCIStudent</span>:</p>
                  <p className="pl-4 text-teal-300">def <span className="text-amber-300">__init__</span>(self, goal):</p>
                  <p className="pl-8 text-white">self.learn = <span className="text-emerald-400">&quot;Practical Concepts&quot;</span></p>
                  <p className="pl-8 text-white">self.practice = <span className="text-emerald-400">&quot;Daily Computer Lab&quot;</span></p>
                  <p className="pl-[32px] text-white">self.grow = <span className="text-[#F5B72C]">&quot;Career Certification&quot;</span></p>
                </div>

                {/* Interactive Feature Tags */}
                <div className="mt-6 flex items-center justify-around text-center pt-2">
                  <div className="p-2">
                    <Monitor className="w-6 h-6 text-[#087F78] mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-[#123B3A] block">1:1 PC Lab</span>
                  </div>
                  <div className="p-2 border-x border-gray-100">
                    <Code2 className="w-6 h-6 text-[#F97316] mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-[#123B3A] block">Real Projects</span>
                  </div>
                  <div className="p-2">
                    <Award className="w-6 h-6 text-[#F5B72C] mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-[#123B3A] block">Certifications</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Top Left */}
              <div
                className="absolute -top-4 -left-4 bg-white p-3 rounded-2xl shadow-xl border border-teal-100 flex items-center gap-3 animate-pulse-subtle"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#087F78] flex items-center justify-center font-bold text-lg">
                  100%
                </div>
                <div>
                  <span className="text-xs font-bold text-[#123B3A] block leading-tight">Practical Learning</span>
                  <span className="text-[10px] text-gray-500 block">Hands-on Experience</span>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Right */}
              <div
                className="absolute -bottom-4 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-teal-100 flex items-center gap-3 animate-pulse-subtle"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#123B3A] block leading-tight">Verified Certification</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Online Verification</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
