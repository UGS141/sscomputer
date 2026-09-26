import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cmsStore, type Course } from '../cmsStore';

export const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(cmsStore.getCourses());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setCourses([...cmsStore.getCourses()]);
    });
    return unsubscribe;
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || c.categoryId === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || c.level === selectedLevel;
    return matchesSearch && matchesCat && matchesLevel;
  });

  const handleDelete = (slug: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the course "${title}"?`)) {
      cmsStore.deleteCourse(slug);
    }
  };

  const handleDuplicate = (course: Course) => {
    const newSlug = `${course.slug}-copy-${Date.now().toString().slice(-4)}`;
    cmsStore.saveCourse({
      ...course,
      slug: newSlug,
      title: `${course.title} (Copy)`,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Academics CMS</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Course Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage public course catalog, curriculum modules, and SEO settings</p>
        </div>

        <button
          onClick={() => navigate('/admin/courses/new')}
          className="py-2.5 px-4 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-teal-100/70 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search course title, skills..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#087F78]"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#123B3A] bg-gray-50 focus:outline-none focus:border-[#087F78]"
          >
            <option value="all">All Categories</option>
            <option value="computer-essentials">Computer Essentials</option>
            <option value="programming-languages">Programming Languages</option>
            <option value="web-development">Web Development</option>
            <option value="database-analytics">Data & Analytics</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#123B3A] bg-gray-50 focus:outline-none focus:border-[#087F78]"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Data Table */}
      <div className="bg-white rounded-2xl border border-teal-100/70 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-[#4B6B69] uppercase tracking-wider bg-teal-50/50">
                <th className="py-3.5 px-4">Course Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Modules</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No courses found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.slug} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#087F78] font-extrabold flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors">
                            {course.title}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate max-w-xs">{course.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">{course.categoryName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#087F78]">
                        {course.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-600">{course.duration}</td>
                    <td className="py-3.5 px-4 font-bold text-[#123B3A]">{course.modules?.length || 0} Modules</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/courses/${course.slug}`)}
                          title="Preview Public Page"
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/courses/edit/${course.slug}`)}
                          title="Edit Course & Curriculum"
                          className="p-1.5 rounded-lg bg-teal-50 text-[#087F78] hover:bg-teal-100"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(course)}
                          title="Duplicate Course"
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.slug, course.title)}
                          title="Delete Course"
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
