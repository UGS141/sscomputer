import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, User, ArrowRight, Search } from 'lucide-react';
import { BLOG_POSTS } from '../data/blog';
import type { BlogPost } from '../data/blog';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SEOHead } from '../seo/SEOHead';
import { generateBreadcrumbSchema } from '../seo/schemas';

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Programming', 'MS Office', 'Web Development', 'Computer Basics'];

  const filteredPosts = BLOG_POSTS.filter((post: BlogPost) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const schemas = [
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
    ]),
  ];

  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen pb-16">
      <SEOHead
        title="Computer & Technology Learning Blog | SSCI Nellore"
        description="Read practical tutorials, coding roadmaps, Excel tips, and computer career guidance from Sri Shanmukha Computer Institute, Nellore."
        canonicalPath="/blog"
        schemas={schemas}
      />
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-teal-200">
            <Breadcrumb items={[{ label: 'Blog & Educational Resources' }]} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            SSCI <span className="text-[#F5B72C]">Tech Articles & Guides</span>
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl leading-relaxed">
            Read programming tutorials, office software tips, database insights, and computer career advice written by SSCI faculty.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Search & Category filter */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-teal-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#087F78] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-[#087F78]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Post Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredPosts.map((post: BlogPost) => (
            <div
              key={post.slug}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-teal-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-effect"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#087F78] font-bold">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-[#F97316]" /> {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4B6B69] leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                  <span className="flex items-center gap-1 font-semibold text-[#123B3A]">
                    <User className="w-3.5 h-3.5 text-[#087F78]" /> {post.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> {post.date}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#087F78] group-hover:text-[#F97316] transition-colors"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
