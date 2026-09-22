import React, { useState } from 'react';
import { BookOpen, Code2, Rocket, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

export const LEARNING_TABS = [
  {
    id: 'learn',
    title: 'LEARN',
    label: '01. Learn Concepts',
    icon: BookOpen,
    heading: 'Structured Concept Explanations',
    description: 'Every session begins with clear, visual concept breakdowns by experienced faculty using practical real-life examples before moving to the computer lab.',
    features: [
      'Interactive classroom explanation with visual diagrams',
      'Step-by-step topic decomposition for easy understanding',
      'Curated learning notes and code reference cheat sheets',
      'Individual student Q&A and concept clarification'
    ],
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    accentColor: 'from-teal-600 to-emerald-600'
  },
  {
    id: 'practice',
    title: 'PRACTICE',
    label: '02. Lab Practice',
    icon: Code2,
    heading: 'Daily 1:1 Hands-on Computer Practice',
    description: 'Theory is only 20% of the equation. You get dedicated time on individual workstations to implement every formula, program, or design taught in class.',
    features: [
      'Dedicated individual PC workstation for every student',
      'Guided lab exercise sheets with instant trainer assistance',
      'Typing, shortcut mastery, and coding syntax drills',
      'Hands-on troubleshooting when errors occur'
    ],
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    accentColor: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'build',
    title: 'BUILD',
    label: '03. Build Projects',
    icon: Rocket,
    heading: 'Real-World Portfolio Projects',
    description: 'Transform theoretical knowledge into tangible proof of skill by constructing real projects — from billing applications to full-stack web platforms.',
    features: [
      'Industry-relevant capstone project assignments',
      'Mentor code reviews and performance optimization',
      'Building resume-ready project portfolios',
      'Presenting project demos to peers and faculty'
    ],
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    accentColor: 'from-orange-500 to-amber-600'
  },
  {
    id: 'assess',
    title: 'ASSESS',
    label: '04. Certification',
    icon: CheckCircle,
    heading: 'Practical Assessment & Certification',
    description: 'Validate your competence with structured practical lab exams and receive an officially recognized SSCI certificate verifiable online.',
    features: [
      'Hands-on practical skill evaluations in the lab',
      'Detailed feedback on strengths and areas of improvement',
      'Official SSCI Course Completion Certificate',
      'Online QR and certificate ID verification'
    ],
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    accentColor: 'from-amber-500 to-teal-600'
  }
];

export const LearningExperience: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState('learn');
  const activeTab = LEARNING_TABS.find((t) => t.id === activeTabId) || LEARNING_TABS[0];

  return (
    <section className="py-16 bg-[#F7FAF9] border-b border-teal-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-[#087F78] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F97316]" />
            <span>Practical Learning Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
            More Than a <span className="brand-gradient-text">Classroom</span>
          </h2>
          <p className="text-base text-[#4B6B69]">
            Our 4-step learning ecosystem ensures you don’t just memorize concepts — you master them practically.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 overflow-x-auto pb-2 px-2">
          {LEARNING_TABS.map((tab) => {
            const isActive = tab.id === activeTabId;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[#123B3A] text-white shadow-md'
                    : 'bg-white text-[#123B3A] border border-teal-100 hover:bg-teal-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5B72C]' : 'text-[#087F78]'}`} />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Animated Tab Content Panel */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-teal-100 shadow-xl max-w-5xl mx-auto relative overflow-hidden">
          <div
            key={activeTab.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-300 animate-in fade-in zoom-in-95"
          >
            <div className="lg:col-span-7 space-y-4">
              <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full border ${activeTab.badgeColor}`}>
                {activeTab.label}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#123B3A] leading-tight">
                {activeTab.heading}
              </h3>

              <p className="text-sm text-[#4B6B69] leading-relaxed">
                {activeTab.description}
              </p>

              <div className="pt-2 space-y-2.5">
                {activeTab.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#123B3A] font-medium">
                    <CheckCircle className="w-4 h-4 text-[#12A77A] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className={`p-8 rounded-2xl bg-gradient-to-br ${activeTab.accentColor} text-white shadow-lg space-y-4 text-center relative overflow-hidden`}>
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-[#F5B72C]">
                  <activeTab.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-extrabold tracking-tight">{activeTab.title} STAGE</h4>
                <p className="text-xs text-teal-100/90 leading-relaxed max-w-xs mx-auto">
                  Designed to build real capability and practical confidence for every enrolled student.
                </p>
                <div className="pt-2 text-xs font-bold text-[#F5B72C] flex items-center justify-center gap-1">
                  <span>SSCI Lab Methodology</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
