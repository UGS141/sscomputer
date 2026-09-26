import React, { useState, useEffect } from 'react';
import { Award, Plus, Search, ShieldCheck, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { cmsStore, CertificateRecord } from '../cmsStore';

export const AdminCertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateRecord[]>(cmsStore.getCertificates());
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentName: '',
    courseName: 'Python Programming',
    grade: 'Grade A+',
  });

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setCertificates([...cmsStore.getCertificates()]);
    });
    return unsubscribe;
  }, []);

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.courseName) return;

    cmsStore.issueCertificate(formData);
    setIsModalOpen(false);
    setFormData({ studentName: '', courseName: 'Python Programming', grade: 'Grade A+' });
  };

  const handleRevokeToggle = (certNumber: string) => {
    if (window.confirm(`Toggle status for Certificate "${certNumber}"?`)) {
      cmsStore.revokeCertificate(certNumber);
    }
  };

  const handleCopyLink = (certNum: string) => {
    const link = `${window.location.origin}/verify-certificate?id=${certNum}`;
    navigator.clipboard.writeText(link);
    setCopiedId(certNum);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = certificates.filter(
    (c) =>
      c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Credentials Registry</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Certificate Management</h1>
          <p className="text-xs text-gray-500 mt-1">Issue official verifiable certificates synced with public online verification page</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4" />
          <span>Issue New Certificate</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-teal-100/70 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificate ID, student name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#087F78]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-teal-100/70 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-[#4B6B69] uppercase tracking-wider bg-teal-50/50">
                <th className="py-3.5 px-4">Certificate ID</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Course Name</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Grade</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Verification Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filtered.map((cert) => (
                <tr key={cert.certificateNumber} className="hover:bg-teal-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#087F78]">{cert.certificateNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-[#123B3A]">{cert.studentName}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-700">{cert.courseName}</td>
                  <td className="py-3.5 px-4 text-gray-500">{cert.issueDate}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">{cert.grade}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleRevokeToggle(cert.certificateNumber)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                        cert.status === 'Valid' ? 'bg-emerald-100 text-[#12A77A]' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {cert.status}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleCopyLink(cert.certificateNumber)}
                      className="px-3 py-1 rounded-lg bg-teal-50 text-[#087F78] font-bold text-[11px] hover:bg-teal-100 flex items-center gap-1.5 ml-auto"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedId === cert.certificateNumber ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleIssue} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-[#123B3A]">Issue Official SSCI Certificate</h3>
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Student Full Name</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="e.g. K. Sai Teja"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Completed Course</label>
              <input
                type="text"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Grade</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#123B3A] bg-white"
              >
                <option value="Grade A+">Grade A+ (Distinction)</option>
                <option value="Grade A">Grade A (First Class)</option>
                <option value="Grade B">Grade B (Passed)</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 rounded-xl bg-gray-100 text-xs font-bold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl brand-gradient-bg text-white text-xs font-bold"
              >
                Generate & Issue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
