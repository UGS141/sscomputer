import React from 'react';
import { STUDENT_PROJECTS } from '../data/projects';
import type { StudentProject } from '../data/projects';
import { Breadcrumb } from '../components/common/Breadcrumb';

interface ProjectsPageProps {
  onOpenEnquiry: (courseTitle?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenEnquiry }) => {
  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen pb-16">
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-teal-200">
            <Breadcrumb items={[{ label: 'Student Projects' }]} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Practical <span className="text-[#F5B72C]">Student Capstone Projects</span>
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl leading-relaxed">
            Discover real-world applications constructed by SSCI students during practical computer lab sessions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDENT_PROJECTS.map((project: StudentProject) => (
            <div key={project.id} className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-effect">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${project.badgeColor}`}>
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="text-xs text-[#4B6B69] leading-relaxed mb-4">
                  {project.shortDescription}
                </p>

                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-bold text-[#123B3A] uppercase tracking-wider block">Key Features Implemented:</span>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {project.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#087F78]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">{project.courseOrigin}</span>
                <button
                  onClick={() => onOpenEnquiry(project.courseOrigin)}
                  className="py-2 px-3.5 rounded-xl text-xs font-bold text-white brand-gradient-bg"
                >
                  Build This
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
