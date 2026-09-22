import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { GLOBAL_FAQS } from '../../data/faqs';
import type { FAQItem } from '../../data/faqs';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(GLOBAL_FAQS[0].id);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-[#F7FAF9] border-b border-teal-100/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-[#087F78] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-[#F97316]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123B3A] tracking-tight">
            Frequently Asked <span className="brand-gradient-text">Questions</span>
          </h2>
          <p className="text-base text-[#4B6B69]">
            Everything you need to know about SSCI computer courses, lab practice, and certifications.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {GLOBAL_FAQS.map((faq: FAQItem) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-teal-100 overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base font-bold text-[#123B3A] hover:text-[#087F78] transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#087F78] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#F97316]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#4B6B69] leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
