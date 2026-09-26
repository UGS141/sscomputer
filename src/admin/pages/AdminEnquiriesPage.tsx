import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Mail,
  UserCheck,
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { cmsStore, type Lead } from '../cmsStore';

export const AdminEnquiriesPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(cmsStore.getLeads());
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Note form input
  const [noteInput, setNoteInput] = useState('');
  const [followUpDateInput, setFollowUpDateInput] = useState('');

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setLeads([...cmsStore.getLeads()]);
      if (selectedLead) {
        const updated = cmsStore.getLeads().find((l) => l.id === selectedLead.id);
        if (updated) setSelectedLead(updated);
      }
    });
    return unsubscribe;
  }, [selectedLead]);

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.courseInterested && l.courseInterested.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      activeTab === 'all'
        ? true
        : activeTab === 'new'
        ? l.status === 'New'
        : activeTab === 'followup'
        ? l.status === 'Follow-up'
        : activeTab === 'converted'
        ? l.status === 'Converted'
        : l.status.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: Lead['status']) => {
    cmsStore.updateLeadStatus(id, newStatus);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteInput.trim()) return;

    cmsStore.addLeadNote(selectedLead.id, noteInput);
    setNoteInput('');
  };

  const handleConvert = (id: string) => {
    if (window.confirm('Convert this lead into an official registered SSCI Student?')) {
      cmsStore.convertLeadToStudent(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">CRM & Admissions</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Leads & Website Enquiries</h1>
          <p className="text-xs text-gray-500 mt-1">Track incoming enquiries, manage status pipelines, add notes & schedule follow-ups</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-orange-100 text-[#F97316] text-xs font-bold">
            {leads.filter((l) => l.status === 'New').length} Unread Leads
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-teal-100/70 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'all', label: 'All Enquiries' },
              { id: 'new', label: 'New' },
              { id: 'followup', label: 'Follow-ups' },
              { id: 'interested', label: 'Interested' },
              { id: 'converted', label: 'Converted' },
              { id: 'closed', label: 'Closed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#087F78] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-[#087F78]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, course..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#087F78]"
            />
          </div>
        </div>
      </div>

      {/* Leads Data Table */}
      <div className="bg-white rounded-2xl border border-teal-100/70 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-[#4B6B69] uppercase tracking-wider bg-teal-50/50">
                <th className="py-3.5 px-4">Lead Candidate</th>
                <th className="py-3.5 px-4">Interested Course</th>
                <th className="py-3.5 px-4">Channel / Source</th>
                <th className="py-3.5 px-4">Enquiry Date</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No leads found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#123B3A]">{lead.name}</div>
                      <div className="text-[11px] text-gray-500 font-semibold">{lead.phone} • {lead.email || 'No Email'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">{lead.courseInterested}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-bold">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-medium">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-3 py-1 rounded-lg bg-teal-50 text-[#087F78] hover:bg-teal-100 font-bold text-xs"
                        >
                          View Details
                        </button>
                        {lead.status !== 'Converted' && (
                          <button
                            onClick={() => handleConvert(lead.id)}
                            title="Convert to Registered Student"
                            className="p-1 rounded-lg bg-emerald-50 text-[#12A77A] hover:bg-emerald-100"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-lg p-6 space-y-6 overflow-y-auto shadow-2xl animate-fadeIn border-l border-teal-100 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-[#087F78]">
                    {selectedLead.id}
                  </span>
                  <h2 className="text-xl font-extrabold text-[#123B3A] mt-1">{selectedLead.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Communication Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="py-2.5 px-3 rounded-xl bg-teal-50 text-[#087F78] hover:bg-teal-100 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {selectedLead.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 text-[#12A77A] hover:bg-emerald-100 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Lead</span>
                </a>
              </div>

              {/* Key Lead Info */}
              <div className="p-4 rounded-2xl bg-gray-50 space-y-2 text-xs">
                <p><strong>Interested Course:</strong> {selectedLead.courseInterested}</p>
                <p><strong>Preferred Batch:</strong> {selectedLead.preferredBatch}</p>
                <p><strong>Lead Source:</strong> {selectedLead.source}</p>
                {selectedLead.message && (
                  <p className="pt-2 border-t border-gray-200 text-gray-700 italic">
                    "{selectedLead.message}"
                  </p>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="block text-xs font-bold text-[#123B3A]">Add Counselor Note</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="e.g. Student agreed to join morning batch..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#087F78]"
                  />
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl brand-gradient-bg text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </form>

              {/* Activity & Notes Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#123B3A] uppercase tracking-wider">Activity Timeline</h4>
                <div className="space-y-2.5">
                  {selectedLead.timeline?.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-teal-50/40 border border-teal-100/60 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#123B3A]">{item.title}</span>
                        <span className="text-[10px] text-gray-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-[11px]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {selectedLead.status !== 'Converted' && (
              <button
                onClick={() => handleConvert(selectedLead.id)}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Convert to Registered SSCI Student</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
