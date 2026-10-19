import React, { useState, useMemo } from 'react';
import { Search, UserCheck, X, CheckSquare, Square, AlertCircle, Users } from 'lucide-react';
import { cmsStore, type Student } from '../../admin/cmsStore';

interface StudentSelectorProps {
  selectedStudentIds: string[];
  onChange: (ids: string[]) => void;
  alreadyEnrolledStudentIds?: string[];
  multiple?: boolean;
  label?: string;
  helperText?: string;
  className?: string;
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({
  selectedStudentIds,
  onChange,
  alreadyEnrolledStudentIds = [],
  multiple = true,
  label = 'Select Students',
  helperText,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const allStudents = cmsStore.getStudents();

  const enrolledSet = useMemo(
    () => new Set(alreadyEnrolledStudentIds),
    [alreadyEnrolledStudentIds]
  );

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allStudents;
    return allStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.studentId.toLowerCase().includes(query) ||
        s.phone.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)
    );
  }, [allStudents, searchQuery]);

  // Selected students full objects
  const selectedStudents = useMemo(() => {
    const idSet = new Set(selectedStudentIds);
    return allStudents.filter((s) => idSet.has(s.studentId) || idSet.has(s.id));
  }, [allStudents, selectedStudentIds]);

  const toggleStudent = (student: Student) => {
    if (enrolledSet.has(student.studentId) || enrolledSet.has(student.id)) {
      return; // Already enrolled, cannot toggle
    }

    const id = student.studentId || student.id;
    if (multiple) {
      if (selectedStudentIds.includes(id)) {
        onChange(selectedStudentIds.filter((item) => item !== id));
      } else {
        onChange([...selectedStudentIds, id]);
      }
    } else {
      if (selectedStudentIds.includes(id)) {
        onChange([]);
      } else {
        onChange([id]);
      }
    }
  };

  const removeSelected = (id: string) => {
    onChange(selectedStudentIds.filter((item) => item !== id));
  };

  const handleSelectAllFiltered = () => {
    const selectable = filteredStudents
      .filter((s) => !enrolledSet.has(s.studentId) && !enrolledSet.has(s.id))
      .map((s) => s.studentId || s.id);

    const merged = Array.from(new Set([...selectedStudentIds, ...selectable]));
    onChange(merged);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label and Selected Counts */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary-600" />
            {label}
            {multiple && (
              <span className="text-xs font-normal text-gray-500">
                ({selectedStudentIds.length} selected)
              </span>
            )}
          </label>
          {helperText && <p className="text-xs text-gray-500 mt-0.5">{helperText}</p>}
        </div>

        {multiple && selectedStudentIds.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline"
          >
            Clear Selected ({selectedStudentIds.length})
          </button>
        )}
      </div>

      {/* Selected Student Chips */}
      {selectedStudents.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-lg max-h-28 overflow-y-auto">
          {selectedStudents.map((s) => (
            <span
              key={s.studentId || s.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-primary-200 text-primary-900 rounded-md text-xs font-medium shadow-2xs"
            >
              <span>{s.name}</span>
              <span className="text-gray-400 font-normal">({s.studentId})</span>
              <button
                type="button"
                onClick={() => removeSelected(s.studentId || s.id)}
                className="text-gray-400 hover:text-rose-600 transition-colors"
                title="Remove student"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input & Filter Actions */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name, SSCI ID, phone, or email..."
          className="w-full pl-9 pr-24 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
        {multiple && filteredStudents.length > 0 && (
          <button
            type="button"
            onClick={handleSelectAllFiltered}
            className="absolute right-2 top-2 text-xs text-primary-600 hover:text-primary-800 font-medium px-2 py-0.5 bg-primary-50 rounded hover:bg-primary-100 transition-colors"
          >
            Select All
          </button>
        )}
      </div>

      {/* Student List Container */}
      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-56 overflow-y-auto bg-white">
        {filteredStudents.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            No matching students found for "{searchQuery}".
          </div>
        ) : (
          filteredStudents.map((student) => {
            const sid = student.studentId || student.id;
            const isEnrolled = enrolledSet.has(student.studentId) || enrolledSet.has(student.id);
            const isSelected = selectedStudentIds.includes(sid);

            return (
              <div
                key={sid}
                onClick={() => !isEnrolled && toggleStudent(student)}
                className={`flex items-center justify-between p-2.5 text-sm transition-colors ${
                  isEnrolled
                    ? 'bg-gray-50 opacity-60 cursor-not-allowed'
                    : isSelected
                    ? 'bg-primary-50/60 cursor-pointer hover:bg-primary-50'
                    : 'cursor-pointer hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {!isEnrolled ? (
                    multiple ? (
                      isSelected ? (
                        <CheckSquare className="w-4 h-4 text-primary-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300 shrink-0" />
                      )
                    ) : (
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    )
                  ) : (
                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}

                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {student.name}
                      <span className="text-xs text-gray-500 font-normal">
                        ({student.studentId})
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                      <span>{student.phone}</span>
                      <span>•</span>
                      <span>{student.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isEnrolled ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Already Enrolled
                    </span>
                  ) : isSelected ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-primary-100 text-primary-700">
                      Selected
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {alreadyEnrolledStudentIds.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            {alreadyEnrolledStudentIds.length} student(s) already have active enrollments in this course and are disabled from selection.
          </span>
        </div>
      )}
    </div>
  );
};
