import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Inbox,
  BookOpen,
  Calendar,
  Users,
  Award,
  FileText,
  TrendingUp,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Eye,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cmsStore, type Lead } from '../cmsStore';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>(cmsStore.getLeads());
  const [coursesCount, setCoursesCount] = useState(cmsStore.getCourses().length);
  const [batchesCount, setBatchesCount] = useState(cmsStore.getBatches().length);
  const [studentsCount, setStudentsCount] = useState(cmsStore.getStudents().length);
  const [certificatesCount, setCertificatesCount] = useState(cmsStore.getCertificates().length);
  const [blogCount, setBlogCount] = useState(cmsStore.getBlogPosts().length);

  // Subscribe to real-time store changes
  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setLeads([...cmsStore.getLeads()]);
      setCoursesCount(cmsStore.getCourses().length);
      setBatchesCount(cmsStore.getBatches().length);
      setStudentsCount(cmsStore.getStudents().length);
      setCertificatesCount(cmsStore.getCertificates().length);
      setBlogCount(cmsStore.getBlogPosts().length);
    });
    return unsubscribe;
  }, []);

  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const followUpLeads = leads.filter((l) => l.status === 'Follow-up' || l.followUpDate);

  // Quick Status change handler
  const handleStatusChange = (id: string, newStatus: Lead['status']) => {
    cmsStore.updateLeadStatus(id, newStatus);
  };

  const kpiCards = [
    {
      title: 'TOTAL ENQUIRIES',
      value: leads.length.toString(),
      subtext: `${newLeadsCount} new unread leads`,
      icon: Inbox,
      gradient: 'from-[#087F78] to-[#12A77A]',
      path: '/admin/enquiries',
      badge: newLeadsCount > 0 ? `${newLeadsCount} NEW` : undefined,
    },
    {
      title: 'PUBLISHED COURSES',
      value: coursesCount.toString(),
      subtext: 'Active curriculum catalog',
      icon: BookOpen,
      gradient: 'from-[#123B3A] to-[#087F78]',
      path: '/admin/courses',
    },
    {
      title: 'ACTIVE BATCHES',
      value: batchesCount.toString(),
      subtext: 'Upcoming & open batches',
      icon: Calendar,
      gradient: 'from-[#F97316] to-amber-500',
      path: '/admin/batches',
    },
    {
      title: 'REGISTERED STUDENTS',
      value: studentsCount.toString(),
      subtext: 'Active students & alumni',
      icon: Users,
      gradient: 'from-[#087F78] to-teal-600',
      path: '/admin/students',
    },
    {
      title: 'ISSUED CERTIFICATES',
      value: certificatesCount.toString(),
      subtext: 'Verifiable credentials',
      icon: Award,
      gradient: 'from-[#F5B72C] to-amber-600',
      path: '/admin/certificates',
    },
    {
      title: 'BLOG ARTICLES',
      value: blogCount.toString(),
      subtext: 'Published tutorials & tips',
      icon: FileText,
      gradient: 'from-[#12A77A] to-emerald-600',
      path: '/admin/blog',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-[#123B3A] via-[#087F78] to-[#123B3A] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Control Center</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good Morning, <span className="text-[#F5B72C]">Administrator</span>
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Here's what is happening with Sri Shanmukha Computer Institute today. Manage website courses, leads, batches, content, and student certificates in real-time.
          </p>
        </div>

        {/* Quick Actions Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => navigate('/admin/courses')}
            className="py-2.5 px-4 rounded-xl bg-white text-[#123B3A] hover:bg-teal-50 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#087F78]" />
            <span>Add Course</span>
          </button>
          <button
            onClick={() => navigate('/admin/batches')}
            className="py-2.5 px-4 rounded-xl bg-[#F97316] text-white hover:bg-orange-600 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Batch</span>
          </button>
          <button
            onClick={() => navigate('/admin/certificates')}
            className="py-2.5 px-4 rounded-xl bg-[#F5B72C] text-[#123B3A] hover:bg-amber-400 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Issue Cert</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.path}
              className="bg-white rounded-2xl p-5 border border-teal-100/70 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group card-hover-effect"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.gradient} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {card.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-[#F97316] text-white text-[10px] font-extrabold animate-pulse">
                      {card.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-[11px] font-bold text-[#4B6B69] uppercase tracking-wider">{card.title}</h3>
                <p className="text-2xl font-extrabold text-[#123B3A] group-hover:text-[#087F78] transition-colors mt-1">
                  {card.value}
                </p>
              </div>
              <p className="text-[11px] font-semibold text-teal-600/80 mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span>{card.subtext}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#087F78]" />
              </p>
            </Link>
          );
        })}
      </div>

      {/* Analytics Charts Section (Pure SVG Professional SaaS Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiries Over Time Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-teal-100/70 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#123B3A]">Enquiries & Lead Trend</h3>
              <p className="text-xs text-gray-500 font-medium">Monthly lead volume and conversion progression</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-teal-50 text-[#087F78] text-xs font-bold">Last 30 Days</span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-56 w-full pt-4 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#087F78" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#087F78" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#F1F5F9" strokeWidth="1" />

              {/* Area */}
              <path
                d="M 0,140 Q 75,90 150,110 T 300,50 T 450,70 L 500,40 L 500,180 L 0,180 Z"
                fill="url(#chartGradient)"
              />
              {/* Stroke */}
              <path
                d="M 0,140 Q 75,90 150,110 T 300,50 T 450,70 L 500,40"
                fill="none"
                stroke="#087F78"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Points */}
              <circle cx="150" cy="110" r="5" fill="#087F78" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="300" cy="50" r="5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="500" cy="40" r="5" fill="#087F78" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            {/* Labels */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold mt-2">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4 (Current)</span>
            </div>
          </div>
        </div>

        {/* Course Interest Distribution */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-teal-100/70 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#123B3A]">Top Course Enquiries</h3>
            <span className="text-xs font-bold text-[#087F78]">By Interest</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { course: 'Python Programming', percent: 85, count: '38 leads', color: 'bg-[#087F78]' },
              { course: 'Tally Prime & GST', percent: 72, count: '29 leads', color: 'bg-[#F97316]' },
              { course: 'MS Office & Excel', percent: 64, count: '24 leads', color: 'bg-[#12A77A]' },
              { course: 'Full Stack Web Dev', percent: 58, count: '21 leads', color: 'bg-[#F5B72C]' },
              { course: 'C & C++ Programming', percent: 45, count: '16 leads', color: 'bg-[#123B3A]' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#123B3A]">{item.course}</span>
                  <span className="text-gray-500 font-semibold">{item.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Enquiries & Today's Follow-ups Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-teal-100/70 shadow-2xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-[#123B3A]">Recent Enquiries & Web Leads</h3>
              <p className="text-xs text-gray-500">Live incoming student enquiries from website</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-[#087F78] hover:underline flex items-center gap-1"
            >
              <span>View All Enquiries</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-[#4B6B69] uppercase tracking-wider bg-teal-50/50">
                  <th className="py-3 px-3 rounded-l-xl">Lead Info</th>
                  <th className="py-3 px-3">Course</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right rounded-r-xl">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#123B3A]">{lead.name}</p>
                      <p className="text-[11px] text-gray-500 font-semibold">{lead.phone}</p>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-700">{lead.courseInterested}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold focus:outline-none cursor-pointer ${
                          lead.status === 'New'
                            ? 'bg-orange-100 text-[#F97316]'
                            : lead.status === 'Converted'
                            ? 'bg-emerald-100 text-[#12A77A]'
                            : lead.status === 'Follow-up'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-teal-100 text-[#087F78]'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Interested">Interested</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${lead.phone}`}
                          title="Call Candidate"
                          className="p-1.5 rounded-lg bg-teal-50 text-[#087F78] hover:bg-teal-100"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp Candidate"
                          className="p-1.5 rounded-lg bg-emerald-50 text-[#12A77A] hover:bg-emerald-100"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => navigate('/admin/enquiries')}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheduled Follow-ups Widget (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-teal-100/70 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#123B3A]">Scheduled Follow-ups</h3>
              <Clock className="w-4 h-4 text-[#F97316]" />
            </div>

            <div className="space-y-3">
              {followUpLeads.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  No pending follow-ups scheduled for today.
                </div>
              ) : (
                followUpLeads.slice(0, 3).map((lead, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-teal-50/60 border border-teal-100/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#123B3A]">{lead.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#087F78] font-semibold">{lead.courseInterested}</p>
                    {lead.notes.length > 0 && (
                      <p className="text-[10px] text-gray-500 italic truncate">"{lead.notes[0].text}"</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/enquiries')}
            className="w-full py-2.5 rounded-xl bg-teal-50 text-[#087F78] hover:bg-teal-100 text-xs font-bold transition-colors text-center"
          >
            Manage All Lead Follow-ups
          </button>
        </div>
      </div>
    </div>
  );
};
