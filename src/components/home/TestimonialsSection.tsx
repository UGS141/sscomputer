import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { STUDENT_TESTIMONIALS } from '../../data/testimonials';
import type { Testimonial } from '../../data/testimonials';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? STUDENT_TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === STUDENT_TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current: Testimonial = STUDENT_TESTIMONIALS[currentIndex];

  return (
    <section className="py-16 bg-[#F7FAF9] border-b border-teal-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-widest block">
            Student Feedback & Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
            What Our <span className="brand-gradient-text">Students Say</span>
          </h2>
          <p className="text-base text-[#4B6B69]">
            Real experiences from students who transformed their digital & programming confidence at SSCI.
          </p>
        </div>

        {/* Testimonial Carousel Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-teal-100 shadow-xl relative">
          
          <Quote className="w-12 h-12 text-teal-100 absolute top-6 right-6 pointer-events-none" />

          <div className="space-y-6">
            {/* Stars Rating */}
            <div className="flex items-center gap-1">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#F5B72C] text-[#F5B72C]" />
              ))}
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-base sm:text-xl text-[#123B3A] font-medium leading-relaxed italic">
              &quot;{current.quote}&quot;
            </blockquote>

            {/* Student Profile Info */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full brand-gradient-bg text-white font-extrabold text-base flex items-center justify-center shadow-md">
                  {current.avatarText}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#123B3A] flex items-center gap-1.5">
                    {current.name}
                    <span title="Verified SSCI Student">
                      <CheckCircle2 className="w-4 h-4 text-[#12A77A]" />
                    </span>
                  </h4>
                  <p className="text-xs font-semibold text-[#087F78]">
                    {current.course} • <span className="text-gray-500 font-normal">{current.role}</span>
                  </p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full border border-teal-200 text-[#087F78] hover:bg-teal-50 transition-colors"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-gray-400 px-2">
                  {currentIndex + 1} / {STUDENT_TESTIMONIALS.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full border border-teal-200 text-[#087F78] hover:bg-teal-50 transition-colors"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
