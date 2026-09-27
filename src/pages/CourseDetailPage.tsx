import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Clock, Award, CheckCircle2, ChevronDown, Monitor, Sparkles, FolderKanban, ShieldCheck } from 'lucide-react';
import { getCourseBySlug as getStaticCourseBySlug, type Course } from '../data/courses';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEOHead } from '../seo/SEOHead';
import { generateCourseSchema, generateBreadcrumbSchema, generateFAQSchema } from '../seo/schemas';
import { trackSEOEvent } from '../seo/analytics';
import { cmsStore } from '../admin/cmsStore';
import { apiService } from '../services/api';

interface CourseDetailPageProps {
  onOpenEnquiry: (courseTitle?: string) => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ onOpenEnquiry }) => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | undefined>(() => 
    cmsStore.getCourseBySlug(slug || '') || getStaticCourseBySlug(slug || '')
  );
  const [loading, setLoading] = useState(!course);

  const [openModuleIdx, setOpenModuleIdx] = useState<number | null>(0);

  useEffect(() => {
    if (!slug) return;
    const storeMatch = cmsStore.getCourseBySlug(slug);
    if (storeMatch) setCourse(storeMatch);

    apiService.getCourseBySlug(slug).then((res) => {
      if (res?.success && res.course) {
        setCourse(res.course);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (course) {
      trackSEOEvent('course_view', { course_slug: course.slug, course_title: course.title });
    }
  }, [course]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAF9] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#087F78] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#123B3A]">Loading Course Details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const toggleModule = (idx: number) => {
    setOpenModuleIdx(openModuleIdx === idx ? null : idx);
  };

  const schemas = [
    generateCourseSchema(course),
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Courses', url: '/courses' },
      { name: course.title, url: `/courses/${course.slug}` },
    ]),
    ...(course.faqs ? [generateFAQSchema(course.faqs)] : []),
  ];

  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen pb-16">
      <SEOHead
        title={`${course.title} Course in Nellore`}
        description={`${course.shortDescription} Practical training at Sri Shanmukha Computer Institute, Nellore.`}
        keywords={[
          `${course.title} course in Nellore`,
          `${course.title} training Nellore`,
          ...course.skillsLearned,
        ]}
        canonicalPath={`/courses/${course.slug}`}
        schemas={schemas}
      />
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-teal-200">
            <Breadcrumb
              items={[
                { label: 'Courses', path: '/courses' },
                { label: course.title },
              ]}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              {course.categoryName}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#F97316] text-white text-xs font-bold uppercase tracking-wider">
              {course.level}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-bold">
              {course.mode}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {course.title}
          </h1>

          <p className="text-base sm:text-lg text-teal-100/90 max-w-3xl leading-relaxed">
            {course.fullDescription}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenEnquiry(course.title)}
              className="py-3.5 px-7 rounded-xl text-sm font-bold text-[#123B3A] bg-[#F5B72C] hover:bg-yellow-400 shadow-lg transition-all"
            >
              Enquire Now & Book Seat
            </button>
            <a
              href="#curriculum"
              className="py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-teal-400/40 transition-all"
            >
              View Curriculum
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-teal-100 shadow-sm text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Duration</span>
            <span className="text-lg font-extrabold text-[#123B3A] flex items-center justify-center sm:justify-start gap-1.5">
              <Clock className="w-5 h-5 text-[#F97316]" /> {course.duration}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Training Format</span>
            <span className="text-lg font-extrabold text-[#123B3A] flex items-center justify-center sm:justify-start gap-1.5">
              <Monitor className="w-5 h-5 text-[#087F78]" /> {course.mode}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Difficulty</span>
            <span className="text-lg font-extrabold text-[#123B3A] flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-5 h-5 text-[#F5B72C]" /> {course.level}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Certification</span>
            <span className="text-lg font-extrabold text-[#123B3A] flex items-center justify-center sm:justify-start gap-1.5 truncate">
              <Award className="w-5 h-5 text-[#12A77A] shrink-0" /> Verified
            </span>
          </div>
        </div>

        {/* 2-Column Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Main Details */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Who is this course for */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-4">
              <h3 className="text-xl font-extrabold text-[#123B3A]">Who Is This Course For?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.targetAudience.map((target, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F7FAF9] text-xs font-medium text-[#123B3A]">
                    <CheckCircle2 className="w-4 h-4 text-[#087F78] shrink-0 mt-0.5" />
                    <span>{target}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-4">
              <h3 className="text-xl font-extrabold text-[#123B3A]">What You Will Learn</h3>
              <div className="space-y-2.5">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-[#123B3A]">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div id="curriculum" className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-[#123B3A]">Course Curriculum Syllabus</h3>
                  <p className="text-xs text-gray-500">{course.modules.length} Detailed Syllabus Modules</p>
                </div>
              </div>

              <div className="space-y-3">
                {course.modules.map((mod, idx) => {
                  const isOpen = openModuleIdx === idx;
                  return (
                    <div key={idx} className="border border-teal-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleModule(idx)}
                        className="w-full p-4 text-left font-bold text-[#123B3A] bg-[#F7FAF9] flex items-center justify-between gap-4"
                      >
                        <span className="text-sm sm:text-base">{mod.title}</span>
                        <ChevronDown className={`w-5 h-5 text-[#087F78] transition-transform ${isOpen ? 'rotate-180 text-[#F97316]' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white border-t border-teal-100 text-xs text-[#4B6B69] space-y-2">
                          <span className="font-bold text-[#123B3A] uppercase tracking-wider block">Key Module Topics Covered:</span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mod.topics.map((t, tidx) => (
                              <li key={tidx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#087F78]" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Practical Capstone Projects */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-4">
              <h3 className="text-xl font-extrabold text-[#123B3A] flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-[#F97316]" /> Practical Capstone Projects
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 text-xs font-bold text-[#123B3A] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#087F78]" />
                    <span>{proj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            {course.faqs && course.faqs.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-4">
                <h3 className="text-xl font-extrabold text-[#123B3A]">Course FAQs</h3>
                <div className="space-y-3">
                  {course.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#F7FAF9] space-y-1">
                      <h4 className="text-sm font-bold text-[#123B3A]">Q: {faq.question}</h4>
                      <p className="text-xs text-[#4B6B69]">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sticky Enrollment Card */}
            <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-lg space-y-5 sticky top-24">
              <div className="text-center pb-4 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase">Classroom & Lab Admission</span>
                <h4 className="text-xl font-extrabold text-[#123B3A] mt-1">{course.title}</h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Batch Duration:</span>
                  <strong className="text-[#123B3A]">{course.duration}</strong>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Practice Format:</span>
                  <strong className="text-[#087F78]">100% Hands-on Lab</strong>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Certificate:</span>
                  <strong className="text-[#12A77A]">Official SSCI Cert</strong>
                </div>
              </div>

              <button
                onClick={() => onOpenEnquiry(course.title)}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white brand-gradient-bg shadow-md hover:shadow-lg transition-all"
              >
                Enquire for Admission
              </button>

              <div className="pt-2 text-[11px] text-gray-500 text-center leading-relaxed">
                Need help deciding? Contact SSCI admission team for guidance.
              </div>
            </div>

            {/* Certification Card Showcase */}
            <div className="bg-gradient-to-br from-[#123B3A] to-[#087F78] p-6 rounded-2xl text-white space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#F5B72C]" />
              <h4 className="text-base font-bold">Official SSCI Certification</h4>
              <p className="text-xs text-teal-100/90 leading-relaxed">
                Upon course completion and practical lab assessment, you receive an authentic SSCI Certificate: <strong className="text-[#F5B72C]">{course.certificationName}</strong>.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
