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
  AlertTriangle,
  Loader2,
  Trash2,
  X,
  Send,
  Sparkles,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { cmsStore, type Lead } from '../cmsStore';

export const AdminEnquiriesPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(cmsStore.getLeads());
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteModalLead, setDeleteModalLead] = useState<Lead | null>(null);

  // Note form input
  const [noteInput, setNoteInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

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

  const handleExportToExcel = () => {
    const dataToExport = filteredLeads.length > 0 ? filteredLeads : leads;

    if (dataToExport.length === 0) {
      showNotification('error', 'No lead records available to export.');
      return;
    }

    const headers = [
      'Lead ID',
      'Candidate Name',
      'Phone Number',
      'Email Address',
      'Interested Course',
      'Preferred Batch',
      'Channel / Source',
      'Pipeline Status',
      'Enquiry Date',
      'Counselor Notes',
      'Message',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const stringified = String(str).replace(/"/g, '""');
      return `"${stringified}"`;
    };

    const rows = dataToExport.map((l: Lead) => [
      escapeCsv(l.id),
      escapeCsv(l.name),
      escapeCsv(l.phone),
      escapeCsv(l.email || 'N/A'),
      escapeCsv(l.courseInterested || 'General Enquiry'),
      escapeCsv(l.preferredBatch || 'Any Batch'),
      escapeCsv(l.source || 'Website'),
      escapeCsv(l.status),
      escapeCsv(new Date(l.createdAt).toLocaleString()),
      escapeCsv(l.notes?.map((n: any) => `${n.author}: ${n.text}`).join('; ') || 'No notes'),
      escapeCsv(l.message || 'N/A'),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row: string[]) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const todayStr = new Date().toISOString().split('T')[0];

    link.setAttribute('href', url);
    link.setAttribute('download', `SSCI_Leads_Enquiries_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('success', `Exported ${dataToExport.length} lead enquiries to Excel file.`);
  };

  const handleStatusChange = (id: string, newStatus: Lead['status']) => {
    cmsStore.updateLeadStatus(id, newStatus);
    showNotification('success', `Lead status updated to "${newStatus}".`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteInput.trim()) return;

    cmsStore.addLeadNote(selectedLead.id, noteInput);
    setNoteInput('');
    showNotification('success', 'Counselor note saved.');
  };

  const handleConvert = async (id: string) => {
    if (window.confirm('Convert this lead into an official registered SSCI Student?')) {
      setActionLoading(true);
      try {
        await cmsStore.convertLeadToStudent(id);
        showNotification('success', 'Lead successfully converted into registered SSCI Student.');
      } catch (err: any) {
        showNotification('error', err.message || 'Failed to convert lead.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleConfirmDeleteLead = async () => {
    if (!deleteModalLead) return;

    setActionLoading(true);
    try {
      await cmsStore.deleteLead(deleteModalLead.id);
      showNotification('success', `Lead enquiry for "${deleteModalLead.name}" deleted successfully.`);
      if (selectedLead?.id === deleteModalLead.id) {
        setSelectedLead(null);
      }
      setDeleteModalLead(null);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete lead enquiry.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-md transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <p className="text-xs font-bold">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">CRM & Admissions</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Leads & Website Enquiries</h1>
          <p className="text-xs text-gray-500 mt-1">Track incoming enquiries, manage status pipelines, add notes & schedule follow-ups</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportToExcel}
            title="Export all lead enquiries to Microsoft Excel"
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-white brand-gradient-bg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>
          <span className="px-3 py-2 rounded-xl bg-orange-100 text-[#F97316] text-xs font-bold shrink-0">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'brand-gradient-bg text-white shadow-xs'
                    : 'bg-teal-50/60 text-[#4B6B69] hover:bg-teal-100/50'
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
                        <button
                          onClick={() => setDeleteModalLead(lead)}
                          title="Delete Lead Enquiry"
                          className="p-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
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

            <div className="space-y-2 pt-4 border-t border-gray-100">
              {selectedLead.status !== 'Converted' ? (
                <button
                  onClick={() => handleConvert(selectedLead.id)}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Convert to Registered SSCI Student</span>
                </button>
              ) : (
                <a
                  href={`/admin/students?search=${encodeURIComponent(selectedLead.name)}`}
                  className="w-full py-3 rounded-xl bg-teal-50 text-[#087F78] text-xs font-bold border border-teal-200 hover:bg-teal-100 transition-colors flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-[#12A77A]" />
                  <span>Registered Student — View / Edit Record</span>
                </a>
              )}

              <button
                onClick={() => setDeleteModalLead(selectedLead)}
                className="w-full py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Delete Lead Enquiry Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE LEAD CONFIRMATION MODAL */}
      {deleteModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModalLead(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-red-100 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 rounded-full bg-red-100 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#123B3A]">Delete Lead Enquiry?</h3>
                <p className="text-xs text-red-600 font-bold">{deleteModalLead.id}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-red-50/50 p-3 rounded-xl border border-red-100">
              You are about to delete the lead enquiry from{' '}
              <strong className="text-[#123B3A]">{deleteModalLead.name}</strong> ({deleteModalLead.phone}).
              This action will permanently delete the enquiry record from MongoDB Atlas.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalLead(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmDeleteLead}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
