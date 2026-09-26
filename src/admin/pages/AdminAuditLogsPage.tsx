import React, { useState, useEffect } from 'react';
import { Shield, Clock, Search, Filter } from 'lucide-react';
import { cmsStore, type AuditLog } from '../cmsStore';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(cmsStore.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setLogs([...cmsStore.getAuditLogs()]);
    });
    return unsubscribe;
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Security & Governance</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">System Audit Logs</h1>
          <p className="text-xs text-gray-500 mt-1">Immutable security recording of administrative actions, edits, and authentication events</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-teal-100/70 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, user, details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#087F78]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-teal-100/70 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-[#4B6B69] uppercase tracking-wider bg-teal-50/50">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Admin User</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No security audit logs recorded.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#123B3A]">{log.user}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-teal-50 text-[#087F78] text-[10px] font-bold">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-700">{log.action}</td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
