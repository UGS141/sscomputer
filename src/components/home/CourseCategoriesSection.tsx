import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Code, Globe, Database, BarChart3, Palette, Cpu, ArrowRight } from 'lucide-react';
import { COURSE_CATEGORIES } from '../../data/categories';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Monitor,
  Code,
  Globe,
  Database,
  BarChart3,
  Palette,
  Cpu,
};

export const CourseCategoriesSection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-teal-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-[#087F78] uppercase tracking-widest block mb-1">
              Course Catalog Spectrum
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
              Explore Our <span className="brand-gradient-text">Training Domains</span>
            </h2>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#087F78] hover:text-[#055C57] transition-colors"
          >
            <span>Browse All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COURSE_CATEGORIES.map((cat) => {
            const IconComponent = ICON_MAP[cat.iconName] || Code;
            return (
              <Link
                key={cat.id}
                to={`/courses?category=${cat.slug}`}
                className="group p-6 rounded-2xl bg-[#F7FAF9] border border-teal-100 hover:bg-white hover:border-[#087F78] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white shadow-xs text-[#087F78] group-hover:bg-[#087F78] group-hover:text-white transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
                      {cat.courseCount} Courses
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors mb-2">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-[#4B6B69] leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-100/80 flex items-center justify-between text-xs font-bold text-[#087F78] group-hover:text-[#F97316] transition-colors">
                  <span>Explore Category</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
