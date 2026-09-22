import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Clock, ArrowRight } from 'lucide-react';
import { LEARNING_PATHS } from '../../data/learningPaths';
import type { LearningPath } from '../../data/learningPaths';

export const LearningPathsSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#F7FAF9] border-b border-teal-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-[#087F78] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#F97316]" />
            <span>Structured Career Guidance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
            Find Your <span className="brand-gradient-text">Learning Path</span>
          </h2>
          <p className="text-base text-[#4B6B69]">
            Follow a structured step-by-step roadmap tailored to your experience level and career goals.
          </p>
        </div>

        {/* Learning Path Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEARNING_PATHS.slice(0, 3).map((path: LearningPath) => (
            <div
              key={path.slug}
              className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-effect relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-50 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${path.badgeStyle}`}>
                    {path.badge}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-[#087F78]" />
                    {path.totalDuration}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors leading-tight mb-1">
                  {path.title}
                </h3>
                <p className="text-xs font-bold text-[#F97316] mb-3">
                  &quot;{path.tagline}&quot;
                </p>

                <p className="text-xs text-[#4B6B69] leading-relaxed mb-4 line-clamp-3">
                  {path.description}
                </p>

                {/* Skills gained pills */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[11px] font-bold text-[#123B3A] uppercase tracking-wider block">
                    Key Progression Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {path.skillsGained.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-teal-50 text-[11px] font-semibold text-[#087F78]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-500">
                  <span className="text-[#123B3A] font-bold">{path.includedCourses.length}</span> Courses Included
                </div>
                <Link
                  to={`/learning-paths/${path.slug}`}
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-white brand-gradient-bg shadow-xs hover:shadow-md transition-all"
                >
                  <span>Explore Path</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* View All Learning Paths */}
        <div className="mt-10 text-center">
          <Link
            to="/learning-paths"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#087F78] hover:text-[#055C57] underline underline-offset-4 decoration-2 decoration-[#F97316] transition-colors"
          >
            <span>Explore All 5 Career Pathways</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
