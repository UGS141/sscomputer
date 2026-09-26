import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit3, Trash2, Eye, FolderKanban, MessageSquare, HelpCircle, CheckCircle2 } from 'lucide-react';
import { cmsStore, BlogPost } from '../cmsStore';

export const AdminContentPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'blog' | 'projects' | 'testimonials' | 'faqs'>('blog');

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(cmsStore.getBlogPosts());
  const [projects] = useState(cmsStore.getProjects());
  const [testimonials] = useState(cmsStore.getTestimonials());
  const [faqs] = useState(cmsStore.getFAQs());

  // Blog Editor Modal
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    category: 'Programming',
    excerpt: '',
    content: '',
    readTime: '5 min read',
    tags: ['SSCI', 'Tutorial']
  });

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setBlogPosts([...cmsStore.getBlogPosts()]);
    });
    return unsubscribe;
  }, []);

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogFormData.title) return;

    const slug = blogFormData.slug || blogFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    cmsStore.saveBlogPost({
      ...blogFormData,
      slug,
      title: blogFormData.title,
    } as BlogPost);

    setIsBlogModalOpen(false);
  };

  const handleDeleteBlog = (slug: string) => {
    if (window.confirm('Delete this blog article?')) {
      cmsStore.deleteBlogPost(slug);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Website Content</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Content CMS & Publications</h1>
          <p className="text-xs text-gray-500 mt-1">Manage articles, student capstone projects, testimonials, and FAQs</p>
        </div>

        {activeTab === 'blog' && (
          <button
            onClick={() => {
              setBlogFormData({ title: '', slug: '', category: 'Programming', excerpt: '', content: '', readTime: '5 min read', tags: ['SSCI'] });
              setIsBlogModalOpen(true);
            }}
            className="py-2.5 px-4 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'blog', label: `Blog Articles (${blogPosts.length})`, icon: FileText },
          { id: 'projects', label: `Student Projects (${projects.length})`, icon: FolderKanban },
          { id: 'testimonials', label: `Testimonials (${testimonials.length})`, icon: MessageSquare },
          { id: 'faqs', label: `Global FAQs (${faqs.length})`, icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#087F78] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-[#087F78]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* BLOG CMS TAB */}
      {activeTab === 'blog' && (
        <div className="bg-white rounded-2xl border border-teal-100/70 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-[#4B6B69] uppercase tracking-wider bg-teal-50/50">
                  <th className="py-3.5 px-4">Article Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Read Time</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {blogPosts.map((post) => (
                  <tr key={post.slug} className="hover:bg-teal-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#123B3A]">{post.title}</p>
                      <p className="text-[11px] text-gray-400 truncate max-w-xs">{post.excerpt}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-[#087F78] text-[10px] font-bold">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">{post.date}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-600">{post.readTime}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/blog/${post.slug}`)}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(post.slug)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROJECTS CMS TAB */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white p-5 rounded-2xl border border-teal-100 space-y-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${proj.badgeColor}`}>
                {proj.category}
              </span>
              <h4 className="text-base font-bold text-[#123B3A]">{proj.title}</h4>
              <p className="text-xs text-gray-500">{proj.shortDescription}</p>
            </div>
          ))}
        </div>
      )}

      {/* TESTIMONIALS TAB */}
      {activeTab === 'testimonials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-5 rounded-2xl border border-teal-100 space-y-2">
              <h4 className="text-sm font-bold text-[#123B3A]">{t.name} • <span className="text-[#087F78]">{t.course}</span></h4>
              <p className="text-xs text-gray-600 italic">"{t.content}"</p>
            </div>
          ))}
        </div>
      )}

      {/* FAQS TAB */}
      {activeTab === 'faqs' && (
        <div className="space-y-3 bg-white p-6 rounded-2xl border border-teal-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-gray-50 space-y-1">
              <h4 className="text-xs font-bold text-[#123B3A]">Q: {faq.question}</h4>
              <p className="text-xs text-gray-600">A: {faq.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Write Blog Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveBlog} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-[#123B3A]">Write & Publish Blog Article</h3>
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Article Title</label>
              <input
                type="text"
                value={blogFormData.title || ''}
                onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                placeholder="e.g. Python Loops for Beginners"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Excerpt Summary</label>
              <textarea
                rows={2}
                value={blogFormData.excerpt || ''}
                onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Content (HTML / Markdown)</label>
              <textarea
                rows={4}
                value={blogFormData.content || ''}
                onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsBlogModalOpen(false)}
                className="py-2 px-4 rounded-xl bg-gray-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl brand-gradient-bg text-white text-xs font-bold"
              >
                Publish Article
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
