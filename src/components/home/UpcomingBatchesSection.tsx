import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Monitor, Users, ArrowRight, Sparkles } from 'lucide-react';
import { cmsStore } from '../../admin/cmsStore';
import type { Batch } from '../../data/batches';
import { HorizontalAutoCarousel } from '../common/HorizontalAutoCarousel';

interface UpcomingBatchesSectionProps {
  onOpenEnquiry: (courseTitle?: string) => void;
}

export const UpcomingBatchesSection: React.FC<UpcomingBatchesSectionProps> = ({ onOpenEnquiry }) => {
  const [batches, setBatches] = useState<Batch[]>(() => cmsStore.getBatches() || []);

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setBatches([...(cmsStore.getBatches() || [])]);
    });
    return unsubscribe;
  }, []);

  return (
    <section className="py-16 bg-[#F7FAF9] border-b border-teal-100/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-[#087F78] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Classroom & Lab Schedules</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
            Start Learning With Our <span className="brand-gradient-text">Upcoming Batches</span>
          </h2>
          <p className="text-base text-[#4B6B69]">
            Choose a course, select a convenient schedule, and begin your learning journey with dedicated practical lab guidance.
          </p>
        </div>

        {/* Batches Horizontal Auto-Scrolling Carousel */}
        <HorizontalAutoCarousel
          items={batches}
          getItemKey={(batch) => batch.id}
          speedSeconds={28}
          ariaLabel="Upcoming batches carousel"
          itemClassName="w-[85vw] sm:w-[350px] md:w-[370px] lg:w-[390px] shrink-0"
          renderItem={(batch: Batch) => {
            const seatsLeft = batch.totalSeats - batch.filledSeats;
            return (
              <div
                className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-effect relative overflow-hidden h-full"
              >
                {/* Top Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#087F78] text-xs font-bold">
                    {batch.category}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                      batch.status === 'Few Seats Left'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : batch.status === 'Filling Fast'
                        ? 'bg-orange-100 text-orange-800 border border-orange-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                {/* Course Info */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors leading-snug">
                    {batch.courseName}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                    <span className="px-2 py-0.5 rounded bg-gray-100 font-semibold text-gray-700">
                      {batch.level}
                    </span>
                    <span>•</span>
                    <span>Duration: <strong className="text-[#123B3A]">{batch.duration}</strong></span>
                  </div>
                </div>

                {/* Batch Details list */}
                <div className="space-y-2.5 py-4 border-y border-gray-100 text-xs text-gray-600 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-[#F97316]" /> Starting Date:
                    </span>
                    <strong className="text-[#123B3A] font-bold">{batch.startDate}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-[#087F78]" /> Timing Slot:
                    </span>
                    <strong className="text-[#123B3A] font-semibold">{batch.timeRange} ({batch.timing})</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Monitor className="w-4 h-4 text-[#12A77A]" /> Learning Mode:
                    </span>
                    <strong className="text-[#123B3A]">{batch.mode}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-4 h-4 text-[#F5B72C]" /> Available Seats:
                    </span>
                    <span className="font-bold text-emerald-700">{seatsLeft} seats remaining</span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="flex items-center gap-3 pt-2 mt-auto">
                  <button
                    onClick={() => onOpenEnquiry(batch.courseName)}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white brand-gradient-bg shadow-sm hover:shadow-md transition-all text-center"
                  >
                    Reserve Your Seat
                  </button>

                  <Link
                    to={`/courses/${batch.courseSlug}`}
                    className="p-2.5 rounded-xl border border-teal-200 text-[#087F78] hover:bg-teal-50 transition-colors"
                    title="View Course Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            );
          }}
        />

        {/* View All Batches Footer Trigger */}
        <div className="mt-10 text-center">
          <Link
            to="/batches"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#087F78] hover:text-[#055C57] underline underline-offset-4 decoration-2 decoration-[#F97316] transition-colors"
          >
            <span>View All Upcoming Batch Schedules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

