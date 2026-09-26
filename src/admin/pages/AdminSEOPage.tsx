import React from 'react';
import { Search, Globe, ShieldCheck, CheckCircle2, FileText, Code } from 'lucide-react';

export const AdminSEOPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs space-y-1">
        <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">SEO Control Center</span>
        <h1 className="text-2xl font-extrabold text-[#123B3A]">Search Engine & GEO / AEO Manager</h1>
        <p className="text-xs text-gray-500">Monitor website indexing, automated XML sitemap, schema markup, and NAP consistency</p>
      </div>

      {/* SEO Health Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Technical SEO Score', value: '100 / 100', status: 'Perfect', icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'JSON-LD Schemas', value: '7 Active', status: 'Verified', icon: Code, color: 'text-[#087F78]' },
          { label: 'XML Sitemap', value: '35 URLs', status: 'Generated', icon: FileText, color: 'text-amber-600' },
          { label: 'NAP Consistency', value: '100% Exact', status: 'Nellore, AP', icon: ShieldCheck, color: 'text-blue-600' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-teal-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{card.label}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <h3 className="text-xl font-extrabold text-[#123B3A]">{card.value}</h3>
              <span className="text-xs font-bold text-[#087F78] block">{card.status}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-teal-100 space-y-4">
        <h3 className="text-sm font-bold text-[#123B3A]">Generated Public Robots.txt & Sitemap Files</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-gray-900 text-gray-200 space-y-1 overflow-x-auto">
            <span className="text-[#F5B72C] font-bold block mb-2">// public/robots.txt</span>
            <p>User-agent: *</p>
            <p>Allow: /</p>
            <p>Allow: /courses/*</p>
            <p>Disallow: /admin</p>
            <p>Sitemap: https://sscomputer.in/sitemap.xml</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900 text-gray-200 space-y-1 overflow-x-auto">
            <span className="text-[#F5B72C] font-bold block mb-2">// public/sitemap.xml</span>
            <p>&lt;urlset xmlns="..."&gt;</p>
            <p>&nbsp;&nbsp;&lt;loc&gt;https://sscomputer.in/&lt;/loc&gt;</p>
            <p>&nbsp;&nbsp;&lt;loc&gt;https://sscomputer.in/courses/python-programming&lt;/loc&gt;</p>
            <p>&nbsp;&nbsp;&lt;loc&gt;https://sscomputer.in/courses/tally-prime-gst-accounting&lt;/loc&gt;</p>
            <p>&lt;/urlset&gt;</p>
          </div>
        </div>
      </div>
    </div>
  );
};
