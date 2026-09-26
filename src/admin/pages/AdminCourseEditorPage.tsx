import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  Search,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { cmsStore, type Course } from '../cmsStore';

export const AdminCourseEditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const isNew = !slug || slug === 'new';
  const existingCourse = !isNew ? cmsStore.getCourseBySlug(slug) : null;

  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    slug: '',
    categoryId: 'computer-essentials',
    categoryName: 'Computer Essentials',
    level: 'Beginner',
    duration: '30 Days',
    mode: 'Practical Lab',
    shortDescription: '',
    fullDescription: '',
    targetAudience: ['Students & job seekers'],
    learningOutcomes: ['Practical computer proficiency'],
    skillsLearned: ['Computer Skills'],
    tools: ['Windows OS', 'Software Tools'],
    modules: [
      { title: 'Module 1: Foundations & Setup', topics: ['Introduction & Setup', 'Basic Operations'] }
    ],
    certificationName: 'Certificate in Computer Training',
    projects: ['Capstone Practical Exercise'],
    faqs: [
      { question: 'Do I need prior experience?', answer: 'No, training starts from absolute basics with practical lab practice.' }
    ]
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'curriculum' | 'outcomes' | 'faqs' | 'seo'>('basic');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (existingCourse) {
      setFormData(existingCourse);
    }
  }, [existingCourse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) return;

    cmsStore.saveCourse(formData as Course);
    setSuccessMsg('Course saved and updated on public website!');
    setTimeout(() => {
      setSuccessMsg('');
      navigate('/admin/courses');
    }, 1200);
  };

  // Title to slug generator
  const handleTitleChange = (newTitle: string) => {
    const generatedSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev: Partial<Course>) => ({
      ...prev,
      title: newTitle,
      slug: isNew ? generatedSlug : prev.slug || generatedSlug,
    }));
  };

  // Module helpers
  const addModule = () => {
    setFormData((prev: Partial<Course>) => ({
      ...prev,
      modules: [
        ...(prev.modules || []),
        { title: `Module ${(prev.modules?.length || 0) + 1}: New Module`, topics: ['Topic 1'] }
      ]
    }));
  };

  const removeModule = (mIdx: number) => {
    setFormData((prev: Partial<Course>) => ({
      ...prev,
      modules: prev.modules?.filter((_, idx) => idx !== mIdx)
    }));
  };

  const updateModuleTitle = (mIdx: number, newTitle: string) => {
    setFormData((prev: Partial<Course>) => {
      const updated = [...(prev.modules || [])];
      updated[mIdx].title = newTitle;
      return { ...prev, modules: updated };
    });
  };

  const addTopic = (mIdx: number) => {
    setFormData((prev: Partial<Course>) => {
      const updated = [...(prev.modules || [])];
      updated[mIdx].topics.push('New Lesson Topic');
      return { ...prev, modules: updated };
    });
  };

  const updateTopic = (mIdx: number, tIdx: number, val: string) => {
    setFormData((prev: Partial<Course>) => {
      const updated = [...(prev.modules || [])];
      updated[mIdx].topics[tIdx] = val;
      return { ...prev, modules: updated };
    });
  };

  const removeTopic = (mIdx: number, tIdx: number) => {
    setFormData((prev: Partial<Course>) => {
      const updated = [...(prev.modules || [])];
      updated[mIdx].topics = updated[mIdx].topics.filter((_, idx) => idx !== tIdx);
      return { ...prev, modules: updated };
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/courses')}
            className="p-2 rounded-xl bg-teal-50 text-[#087F78] hover:bg-teal-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#123B3A]">
              {isNew ? 'Create New Course' : `Edit Course: ${formData.title}`}
            </h1>
            <p className="text-xs text-gray-500">Configure course metadata, curriculum modules, and SEO settings</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="py-2.5 px-5 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save & Publish Course</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-[#12A77A] text-xs font-bold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Editor Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'basic', label: 'Basic Info & Category' },
          { id: 'curriculum', label: `Curriculum Builder (${formData.modules?.length || 0})` },
          { id: 'outcomes', label: 'Outcomes & Skills' },
          { id: 'faqs', label: 'Course FAQs' },
          { id: 'seo', label: 'SEO Metadata & Preview' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#087F78] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-[#087F78]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-teal-100/70 shadow-2xs space-y-6">
        {/* BASIC INFO */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Course Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Python Programming"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#087F78]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">URL Slug</label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 bg-gray-50 focus:outline-none focus:border-[#087F78]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Category</label>
              <select
                value={formData.categoryId || 'computer-essentials'}
                onChange={(e) => {
                  const catMap: Record<string, string> = {
                    'computer-essentials': 'Computer Essentials',
                    'programming-languages': 'Programming Languages',
                    'web-development': 'Web Development',
                    'database-analytics': 'Data & Analytics',
                  };
                  setFormData({
                    ...formData,
                    categoryId: e.target.value,
                    categoryName: catMap[e.target.value] || 'Computer Essentials',
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#123B3A] bg-white"
              >
                <option value="computer-essentials">Computer Essentials</option>
                <option value="programming-languages">Programming Languages</option>
                <option value="web-development">Web Development</option>
                <option value="database-analytics">Data & Analytics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Level</label>
              <select
                value={formData.level || 'Beginner'}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#123B3A] bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Duration</label>
              <input
                type="text"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 45 Days (1.5 Hours/day)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Training Mode</label>
              <select
                value={formData.mode || 'Practical Lab'}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#123B3A] bg-white"
              >
                <option value="Practical Lab">Practical Lab (Hands-on)</option>
                <option value="Classroom">Classroom Lectures</option>
                <option value="Hybrid">Hybrid (Classroom + Lab)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Short Description</label>
              <textarea
                rows={2}
                value={formData.shortDescription || ''}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#087F78]"
                placeholder="Brief summary for course cards..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Full Overview</label>
              <textarea
                rows={4}
                value={formData.fullDescription || ''}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#087F78]"
                placeholder="Comprehensive course description..."
              />
            </div>
          </div>
        )}

        {/* CURRICULUM BUILDER */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#123B3A]">Modules & Lesson Topics</h3>
                <p className="text-xs text-gray-500">Build interactive curriculum modules displayed on the public course page</p>
              </div>
              <button
                type="button"
                onClick={addModule}
                className="py-2 px-3.5 rounded-xl bg-teal-50 text-[#087F78] hover:bg-teal-100 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Module</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.modules?.map((mod: { title: string; topics: string[] }, mIdx: number) => (
                <div key={mIdx} className="p-4 rounded-xl border border-teal-100 bg-teal-50/20 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#123B3A]"
                    />
                    <button
                      type="button"
                      onClick={() => removeModule(mIdx)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      title="Remove Module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pl-4 border-l-2 border-teal-200 space-y-2">
                    {mod.topics.map((topic: string, tIdx: number) => (
                      <div key={tIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => updateTopic(mIdx, tIdx, e.target.value)}
                          className="w-full px-3 py-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeTopic(mIdx, tIdx)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addTopic(mIdx)}
                      className="text-xs font-bold text-[#087F78] hover:underline flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Lesson Topic</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO & PREVIEW */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Google Search Preview</span>
              <h4 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer">
                {formData.title || 'Course Title'} Course in Nellore | SSCI
              </h4>
              <p className="text-xs text-emerald-700 font-medium">https://sscomputer.in/courses/{formData.slug || 'course-slug'}</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {formData.shortDescription || 'Sri Shanmukha Computer Institute offers practical computer and programming training in Nellore.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Official Certificate Name</label>
              <input
                type="text"
                value={formData.certificationName || ''}
                onChange={(e) => setFormData({ ...formData, certificationName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/courses')}
            className="py-2.5 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Course Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
