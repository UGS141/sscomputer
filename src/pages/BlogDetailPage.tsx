import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Clock, Calendar, User, ArrowLeft } from 'lucide-react';
import { getBlogPostBySlug } from '../data/blog';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug || '');

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen pb-16">
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-teal-200">
            <Breadcrumb
              items={[
                { label: 'Blog', path: '/blog' },
                { label: post.title },
              ]}
            />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold uppercase tracking-wider">
            {post.category}
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-teal-100/90 pt-2 flex-wrap">
            <span className="flex items-center gap-1 font-semibold">
              <User className="w-3.5 h-3.5 text-[#F5B72C]" /> {post.author} ({post.authorRole})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-300" /> {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#F97316]" /> {post.readTime}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-teal-100 shadow-xl space-y-6">
          <p className="text-base font-semibold text-[#123B3A] leading-relaxed border-l-4 border-[#087F78] pl-4 italic bg-teal-50/50 py-2">
            {post.excerpt}
          </p>

          <div className="space-y-4 text-sm sm:text-base text-[#4B6B69] leading-relaxed">
            {post.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-teal-50 text-xs font-bold text-[#087F78]">
                  #{t}
                </span>
              ))}
            </div>

            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087F78] hover:text-[#F97316] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
