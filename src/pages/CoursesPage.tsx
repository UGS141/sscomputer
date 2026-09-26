import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, ArrowRight, X } from 'lucide-react';
import { COURSES_DATA } from '../data/courses';
import type { Course } from '../data/courses';
import { COURSE_CATEGORIES } from '../data/categories';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEOHead } from '../seo/SEOHead';
import { generateBreadcrumbSchema } from '../seo/schemas';
import { SEO_CONFIG } from '../seo/config';

interface CoursesPageProps {
  onOpenEnquiry: (courseTitle?: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onOpenEnquiry }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const schemas = [
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Courses', url: '/courses' },
    ]),
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter((course: Course) => {
      // Search term filter
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skillsLearned.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || course.categoryId === selectedCategory;

      // Level filter
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;

      // Duration filter
      let matchesDuration = true;
      if (selectedDuration === 'short') matchesDuration = course.duration.includes('30');
      else if (selectedDuration === 'medium') matchesDuration = course.duration.includes('45');
      else if (selectedDuration === 'long') matchesDuration = course.duration.includes('60') || course.duration.includes('90');

      return matchesSearch && matchesCategory && matchesLevel && matchesDuration;
    });
  }, [searchQuery, selectedCategory, selectedLevel, selectedDuration]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedDuration('all');
    setSearchParams({});
  };

  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen pb-16">
      <SEOHead
        title="Computer & Programming Courses in Nellore | SSCI Course Catalog"
        description="Browse career-oriented computer courses at Sri Shanmukha Computer Institute in Nellore. Python, Tally Prime, MS Office, Java, C++, Full Stack Web Dev, and Data Analytics."
        keywords={SEO_CONFIG.keywordClusters.primaryLocal}
        canonicalPath="/courses"
        schemas={schemas}
      />
      
      {/* Banner */}
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-teal-200">
            <Breadcrumb items={[{ label: 'Courses Catalog' }]} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Explore <span className="text-[#F5B72C]">Computer & Coding Courses</span>
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl leading-relaxed">
            Discover structured classroom training with 100% hands-on lab sessions across 7 technology domains.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Search & Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-teal-100 shadow-sm space-y-4">
          
          {/* Top Search input */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by course name, keyword, or skill (e.g. Python, Excel, Tally, React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div>
            <span className="text-xs font-bold text-[#123B3A] uppercase tracking-wider block mb-2">
              Filter by Domain Category:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchParams({});
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#123B3A] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-[#087F78]'
                }`}
              >
                All Courses ({COURSES_DATA.length})
              </button>

              {COURSE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setSearchParams({ category: cat.slug });
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                      isSelected
                        ? 'bg-[#087F78] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-[#087F78]'
                    }`}
                  >
                    {cat.name} ({cat.courseCount})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#087F78]" />
                <span className="font-bold text-[#123B3A]">Level:</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold text-[#123B3A] outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#123B3A]">Duration:</span>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold text-[#123B3A] outline-none"
                >
                  <option value="all">All Durations</option>
                  <option value="short">Short (30 Days)</option>
                  <option value="medium">Medium (45 Days)</option>
                  <option value="long">Long (60-90 Days)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-semibold">
                Showing <strong className="text-[#087F78] font-extrabold">{filteredCourses.length}</strong> course(s)
              </span>
              {(selectedCategory !== 'all' || selectedLevel !== 'all' || selectedDuration !== 'all' || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-teal-100 space-y-4">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-xl font-bold text-[#123B3A]">No matching courses found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try adjusting your search terms or clearing your category filters to view all available courses.
            </p>
            <button
              onClick={clearFilters}
              className="py-2.5 px-5 rounded-xl text-xs font-bold text-white brand-gradient-bg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course: Course) => (
              <div
                key={course.slug}
                className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-effect"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[#087F78] text-[10px] font-bold">
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
                      {course.skillsLearned.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenEnquiry(course.title)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-white brand-gradient-bg shadow-xs"
                  >
                    Enquire Now
                  </button>

                  <Link
                    to={`/courses/${course.slug}`}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#087F78] border border-teal-200 hover:bg-teal-50 flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
