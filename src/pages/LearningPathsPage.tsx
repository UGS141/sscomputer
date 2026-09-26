import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { LEARNING_PATHS } from '../data/learningPaths';
import type { LearningPath } from '../data/learningPaths';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEOHead } from '../seo/SEOHead';
import { generateBreadcrumbSchema } from '../seo/schemas';

export const LearningPathsPage: React.FC = () => {
  const schemas = [
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Learning Paths', url: '/learning-paths' },
    ]),
  ];

  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen pb-16">
      <SEOHead
        title="Structured Career Learning Paths | SSCI Computer Training Nellore"
        description="Explore step-by-step learning paths in Programming, Web Development, Data Analytics, and Office Automation at Sri Shanmukha Computer Institute, Nellore."
        canonicalPath="/learning-paths"
        schemas={schemas}
      />
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-teal-200">
            <Breadcrumb items={[{ label: 'Learning Paths' }]} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Structured <span className="text-[#F5B72C]">Learning Pathways</span>
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl leading-relaxed">
            Follow clear, multi-course learning roadmaps tailored to your target technical proficiency and career aspirations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEARNING_PATHS.map((path: LearningPath) => (
            <div
              key={path.slug}
              className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-effect"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${path.badgeStyle}`}>
                    {path.badge}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-[#087F78]" /> {path.totalDuration}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors mb-1">
                  {path.title}
                </h3>
                <p className="text-xs font-bold text-[#F97316] mb-3">&quot;{path.tagline}&quot;</p>

                <p className="text-xs text-[#4B6B69] leading-relaxed mb-4">
                  {path.description}
                </p>

                <div className="space-y-1.5 mb-6">
                  <span className="text-[10px] font-bold text-[#123B3A] uppercase tracking-wider block">
                    Skill Progression:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {path.skillsGained.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded bg-teal-50 text-[11px] font-semibold text-[#087F78]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  <strong className="text-[#123B3A]">{path.steps.length}</strong> Progression Steps
                </span>
                <Link
                  to={`/learning-paths/${path.slug}`}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-white brand-gradient-bg shadow-xs flex items-center gap-1"
                >
                  <span>Explore Pathway</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
