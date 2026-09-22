import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Clock, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { getLearningPathBySlug } from '../data/learningPaths';
import { Breadcrumb } from '../components/common/Breadcrumb';

interface LearningPathDetailPageProps {
  onOpenEnquiry: (courseTitle?: string) => void;
}

export const LearningPathDetailPage: React.FC<LearningPathDetailPageProps> = ({ onOpenEnquiry }) => {
  const { slug } = useParams<{ slug: string }>();
  const path = getLearningPathBySlug(slug || '');

  if (!path) {
    return <Navigate to="/learning-paths" replace />;
  }

  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-teal-200">
            <Breadcrumb
              items={[
                { label: 'Learning Paths', path: '/learning-paths' },
                { label: path.title },
              ]}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${path.badgeStyle}`}>
              {path.badge}
            </span>
            <span className="flex items-center gap-1 text-xs text-teal-200 font-semibold">
              <Clock className="w-4 h-4 text-[#F97316]" /> Duration: {path.totalDuration}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {path.title}
          </h1>

          <p className="text-sm sm:text-base text-teal-100/90 max-w-3xl leading-relaxed">
            {path.description}
          </p>

          <div className="pt-2">
            <button
              onClick={() => onOpenEnquiry(path.title)}
              className="py-3 px-6 rounded-xl text-sm font-bold text-[#123B3A] bg-[#F5B72C] hover:bg-yellow-400 shadow-md"
            >
              Enquire For This Learning Path
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Target Audience & Skills Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-[#123B3A]">Who Is This Path Designed For?</h3>
            <p className="text-xs text-[#4B6B69] leading-relaxed">{path.targetAudience}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-[#123B3A]">Key Skills You Will Master</h3>
            <div className="flex flex-wrap gap-1.5">
              {path.skillsGained.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-teal-50 text-xs font-semibold text-[#087F78]">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Step-by-Step Course Sequence Roadmap */}
        <div className="space-y-6">
          <h3 className="text-2xl font-extrabold text-[#123B3A]">Step-by-Step Learning Progression</h3>

          <div className="space-y-4">
            {path.steps.map((step) => (
              <div key={step.stepNumber} className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl brand-gradient-bg text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                    0{step.stepNumber}
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-[#123B3A]">{step.title}</h4>
                    <p className="text-xs text-[#4B6B69] mt-0.5">{step.description}</p>
                  </div>
                </div>

                <Link
                  to={`/courses/${step.courseSlug}`}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-[#087F78] border border-teal-200 hover:bg-teal-50 shrink-0 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
