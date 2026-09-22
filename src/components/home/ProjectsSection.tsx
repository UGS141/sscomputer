import React from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, ArrowRight, Code2, Layers } from 'lucide-react';
import { STUDENT_PROJECTS } from '../../data/projects';
import type { StudentProject } from '../../data/projects';

export const ProjectsSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#F7FAF9] border-b border-teal-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-[#087F78] text-xs font-bold uppercase tracking-wider mb-3">
              <FolderKanban className="w-4 h-4 text-[#F97316]" />
              <span>Lab Capstone Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
              Learn by Building <span className="brand-gradient-text">Real Projects</span>
            </h2>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#087F78] hover:text-[#055C57] transition-colors"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDENT_PROJECTS.slice(0, 6).map((project: StudentProject) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-effect"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${project.badgeColor}`}>
                    {project.category}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">Lab Capstone</span>
                </div>

                <h3 className="text-xl font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="text-xs text-[#4B6B69] leading-relaxed mb-4 line-clamp-3">
                  {project.shortDescription}
                </p>

                {/* Skills tags */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold text-[#123B3A] uppercase tracking-wider block">
                    Tools & Technologies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skillsUsed.map((skill, idx) => (
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

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#087F78]">
                <span className="text-gray-500 font-normal">Created in: {project.courseOrigin}</span>
                <Link
                  to="/projects"
                  className="hover:text-[#F97316] transition-colors flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
