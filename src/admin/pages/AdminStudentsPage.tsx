import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Award, CheckCircle2 } from 'lucide-react';
import { cmsStore, Student } from '../cmsStore';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(cmsStore.getStudents());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setStudents([...cmsStore.getStudents()]);
    });
    return unsubscribe;
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Student Registry</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Students & Admissions</h1>
          <p className="text-xs text-gray-500 mt-1">Manage active enrolled students, batches, and certificates</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-teal-100/70 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student ID, name, course..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#087F78]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-teal-100/70 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-[#4B6B69] uppercase tracking-wider bg-teal-50/50">
                <th className="py-3.5 px-4">Student ID & Name</th>
                <th className="py-3.5 px-4">Enrolled Course</th>
                <th className="py-3.5 px-4">Batch</th>
                <th className="py-3.5 px-4">Admission Date</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No registered students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#123B3A]">{s.name}</p>
                      <p className="text-[10px] text-[#087F78] font-bold">{s.studentId}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">{s.course}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-600">{s.batch}</td>
                    <td className="py-3.5 px-4 text-gray-500">{s.admissionDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#12A77A]">
                        {s.status}
                      </span>
                    </td>
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
