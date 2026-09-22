import React, { useState } from 'react';
import { Calendar, Clock, Monitor, Users, Filter } from 'lucide-react';
import { UPCOMING_BATCHES } from '../data/batches';
import type { Batch } from '../data/batches';
import { Breadcrumb } from '../components/common/Breadcrumb';

interface BatchesPageProps {
  onOpenEnquiry: (courseTitle?: string) => void;
}

export const BatchesPage: React.FC<BatchesPageProps> = ({ onOpenEnquiry }) => {
  const [selectedTiming, setSelectedTiming] = useState('all');

  const filteredBatches = UPCOMING_BATCHES.filter((batch: Batch) => {
    if (selectedTiming === 'all') return true;
    return batch.timing.toLowerCase() === selectedTiming.toLowerCase();
  });

  return (
    <div className="w-full bg-[#F7FAF9] min-h-screen pb-16">
      
      {/* Banner Header */}
      <div className="bg-gradient-to-b from-[#123B3A] to-[#087F78] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-teal-700">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="text-teal-200">
            <Breadcrumb items={[{ label: 'Batches Schedule' }]} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Upcoming <span className="text-[#F5B72C]">Batch Schedules</span>
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl leading-relaxed">
            Reserve your seat in our upcoming classroom and practical computer lab batches. Flexible morning, afternoon, and evening slots available.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-teal-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-[#087F78] shrink-0" />
            <span className="text-xs font-bold text-[#123B3A] uppercase tracking-wider shrink-0">Filter Timing:</span>
            {['all', 'morning', 'afternoon', 'evening', 'weekend'].map((timing) => (
              <button
                key={timing}
                onClick={() => setSelectedTiming(timing)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all shrink-0 ${
                  selectedTiming === timing
                    ? 'bg-[#087F78] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-[#087F78]'
                }`}
              >
                {timing}
              </button>
            ))}
          </div>

          <div className="text-xs font-semibold text-gray-500">
            Showing <strong className="text-[#087F78]">{filteredBatches.length}</strong> batch(es)
          </div>
        </div>

        {/* Batches Table & Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch: Batch) => {
            const seatsLeft = batch.totalSeats - batch.filledSeats;
            return (
              <div
                key={batch.id}
                className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-effect"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 text-[#087F78] text-xs font-bold">
                      {batch.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold">
                      {batch.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors mb-2">
                    {batch.courseName}
                  </h3>

                  <div className="space-y-2 py-3 border-y border-gray-100 text-xs text-gray-600 mb-6">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#F97316]" /> Start Date:</span>
                      <strong className="text-[#123B3A]">{batch.startDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#087F78]" /> Time Slot:</span>
                      <strong className="text-[#123B3A]">{batch.timeRange}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><Monitor className="w-4 h-4 text-[#12A77A]" /> Faculty Trainer:</span>
                      <strong className="text-[#123B3A]">{batch.trainerName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#F5B72C]" /> Seat Availability:</span>
                      <strong className="text-emerald-700 font-bold">{seatsLeft} seats left</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenEnquiry(batch.courseName)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white brand-gradient-bg shadow-sm hover:shadow-md transition-all text-center"
                >
                  Reserve Your Seat Now
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
