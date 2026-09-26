import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit3, Trash2, Users, Clock } from 'lucide-react';
import { cmsStore, type Batch } from '../cmsStore';

export const AdminBatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>(cmsStore.getBatches());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const [formData, setFormData] = useState<Partial<Batch>>({
    courseName: 'Python Programming',
    courseSlug: 'python-programming',
    category: 'Programming',
    level: 'Beginner to Advanced',
    duration: '60 Days',
    startDate: 'October 5, 2026',
    timing: 'Morning',
    timeRange: '08:00 AM – 10:00 AM',
    mode: 'Practical Lab',
    status: 'Starting Soon',
    filledSeats: 8,
    totalSeats: 20,
    trainerName: 'Senior SSCI Faculty',
  });

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setBatches([...cmsStore.getBatches()]);
    });
    return unsubscribe;
  }, []);

  const handleOpenCreate = () => {
    setEditingBatch(null);
    setFormData({
      courseName: 'Python Programming',
      courseSlug: 'python-programming',
      category: 'Programming',
      level: 'Beginner to Advanced',
      duration: '60 Days',
      startDate: 'October 5, 2026',
      timing: 'Morning',
      timeRange: '08:00 AM – 10:00 AM',
      mode: 'Practical Lab',
      status: 'Starting Soon',
      filledSeats: 8,
      totalSeats: 20,
      trainerName: 'Senior SSCI Faculty',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setFormData(batch);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    cmsStore.saveBatch({
      ...formData,
      id: editingBatch ? editingBatch.id : `BATCH-${Date.now().toString().slice(-4)}`,
      courseName: formData.courseName || 'Computer Course',
    } as Batch);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Are you sure you want to delete batch "${id}"?`)) {
      cmsStore.deleteBatch(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Batches & Schedule</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Batch Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage upcoming computer lab schedules, seat availability, and batch statuses</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="py-2.5 px-4 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Batch</span>
        </button>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {batches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-2xl p-6 border border-teal-100/70 shadow-2xs space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-[#087F78] uppercase">
                  {batch.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  batch.status === 'Open' || batch.status === 'Starting Soon'
                    ? 'bg-emerald-100 text-[#12A77A]'
                    : batch.status === 'Filling Fast' || batch.status === 'Few Seats Left'
                    ? 'bg-orange-100 text-[#F97316]'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {batch.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors">
                {batch.courseName}
              </h3>

              <div className="space-y-1.5 text-xs text-gray-600">
                <p className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#087F78]" />
                  <span>Starts: <strong>{batch.startDate}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Timing: {batch.timing} ({batch.timeRange})</span>
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#12A77A]" />
                  <span>Trainer: {batch.trainerName || 'SSCI Faculty'}</span>
                </p>
              </div>

              {/* Seat Indicator */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span className="text-gray-500">Seats Enrolled</span>
                  <span className="text-[#087F78]">{batch.filledSeats} / {batch.totalSeats}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full brand-gradient-bg"
                    style={{ width: `${Math.min(100, Math.round((batch.filledSeats / batch.totalSeats) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(batch)}
                className="text-xs font-bold text-[#087F78] hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Batch</span>
              </button>

              <button
                onClick={() => handleDelete(batch.id)}
                className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-[#123B3A]">
              {editingBatch ? 'Edit Batch' : 'Create New Batch'}
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Course Name</label>
              <input
                type="text"
                value={formData.courseName || ''}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Start Date</label>
                <input
                  type="text"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  placeholder="e.g. October 5, 2026"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Timing Slot</label>
                <select
                  value={formData.timing || 'Morning'}
                  onChange={(e) => setFormData({ ...formData, timing: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Time Range</label>
                <input
                  type="text"
                  value={formData.timeRange || ''}
                  onChange={(e) => setFormData({ ...formData, timeRange: e.target.value })}
                  placeholder="e.g. 08:00 AM – 10:00 AM"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Status</label>
                <select
                  value={formData.status || 'Starting Soon'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                >
                  <option value="Starting Soon">Starting Soon</option>
                  <option value="Open">Open</option>
                  <option value="Few Seats Left">Few Seats Left</option>
                  <option value="Filling Fast">Filling Fast</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Filled Seats</label>
                <input
                  type="number"
                  value={formData.filledSeats || 0}
                  onChange={(e) => setFormData({ ...formData, filledSeats: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B3A] mb-1 uppercase tracking-wider">Total Seats</label>
                <input
                  type="number"
                  value={formData.totalSeats || 20}
                  onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 20 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md"
              >
                Save Batch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
