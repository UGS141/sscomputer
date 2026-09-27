import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { cmsStore } from '../../admin/cmsStore';
import type { Course } from '../../data/courses';
import { HorizontalAutoCarousel } from '../common/HorizontalAutoCarousel';

export const CourseCategoriesSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(() => cmsStore.getCourses() || []);

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setCourses([...(cmsStore.getCourses() || [])]);
    });
    return unsubscribe;
  }, []);

  return (
    <section className="py-16 bg-white border-b border-teal-100/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#087F78] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Job-Ready Academic Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
              Featured <span className="brand-gradient-text">Computer & Coding Courses</span>
            </h2>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#087F78] hover:text-[#055C57] transition-colors shrink-0"
          >
            <span>Browse All Courses ({courses.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Courses Horizontal Auto-Scrolling Carousel */}
        <HorizontalAutoCarousel
          items={courses}
          getItemKey={(course) => course.slug}
          speedSeconds={25}
          ariaLabel="Featured courses carousel"
          itemClassName="w-[85vw] sm:w-[350px] md:w-[370px] lg:w-[390px] shrink-0"
          renderItem={(course: Course) => (
            <Link
              to={`/courses/${course.slug}`}
              className="bg-[#F7FAF9] rounded-2xl p-6 border border-teal-100 hover:bg-white hover:border-[#087F78] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-effect relative overflow-hidden h-full block"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-teal-200 text-[#087F78] text-[10px] font-bold">
                    {course.categoryName}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-[#F97316]" /> {course.duration}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors mb-2 leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-[#4B6B69] leading-relaxed mb-4 line-clamp-3">
                  {course.shortDescription}
                </p>

                <div className="space-y-1.5 mb-6">
                  <span className="text-[10px] font-bold text-[#123B3A] uppercase tracking-wider block">
                    Skills & Tools:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(course.skillsLearned || []).slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white text-gray-700 text-[10px] font-semibold border border-gray-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200/80 flex items-center justify-between mt-auto">
                <span className="text-xs font-bold text-[#087F78] group-hover:text-[#F97316] transition-colors flex items-center gap-1">
                  <span>View Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {course.level}
                </span>
              </div>
            </Link>
          )}
        />

        {/* View All Courses Footer Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#087F78] hover:text-[#055C57]"
          >
            <span>Browse Full Course Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

