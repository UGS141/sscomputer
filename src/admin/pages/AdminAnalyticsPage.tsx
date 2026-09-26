import React from 'react';
import { Sparkles, TrendingUp, Users, Inbox, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { cmsStore } from '../cmsStore';

export const AdminAnalyticsPage: React.FC = () => {
  const leads = cmsStore.getLeads();
  const students = cmsStore.getStudents();
  const convertedCount = leads.filter((l) => l.status === 'Converted').length;
  const conversionRate = leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs space-y-1">
        <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Analytics & Funnel</span>
        <h1 className="text-2xl font-extrabold text-[#123B3A]">Conversion Reports & Analytics</h1>
        <p className="text-xs text-gray-500">Track student inquiry conversions, lead channels, and course demand</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversion Rate</span>
          <h3 className="text-3xl font-extrabold text-[#123B3A]">{conversionRate}%</h3>
          <p className="text-xs text-[#12A77A] font-semibold">{convertedCount} leads converted into enrolled students</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Enquiries</span>
          <h3 className="text-3xl font-extrabold text-[#123B3A]">{leads.length}</h3>
          <p className="text-xs text-[#087F78] font-semibold">Incoming lead enquiries across all channels</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Enrolled Students</span>
          <h3 className="text-3xl font-extrabold text-[#123B3A]">{students.length}</h3>
          <p className="text-xs text-amber-600 font-semibold">Registered SSCI active students</p>
        </div>
      </div>
    </div>
  );
};
