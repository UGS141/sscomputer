import React from 'react';
import { SEOHead } from '../seo/SEOHead';
import { generateLocalBusinessSchema, generateOrganizationSchema, generateWebSiteSchema, generateFAQSchema } from '../seo/schemas';
import { SEO_CONFIG } from '../seo/config';
import { GLOBAL_FAQS } from '../data/faqs';

import { Hero } from '../components/home/Hero';
import { StatsSection } from '../components/home/StatsSection';
import { UpcomingBatchesSection } from '../components/home/UpcomingBatchesSection';
import { CourseCategoriesSection } from '../components/home/CourseCategoriesSection';
import { LearningPathsSection } from '../components/home/LearningPathsSection';
import { WhySSCI } from '../components/home/WhySSCI';
import { LearningExperience } from '../components/home/LearningExperience';
import { TechnologySection } from '../components/home/TechnologySection';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { StudentJourney } from '../components/home/StudentJourney';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { InstitutePreview } from '../components/home/InstitutePreview';
import { FAQSection } from '../components/home/FAQSection';
import { CTASection } from '../components/home/CTASection';

interface HomePageProps {
  onOpenEnquiry: (courseTitle?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenEnquiry }) => {
  const schemas = [
    generateLocalBusinessSchema(),
    generateOrganizationSchema(),
    generateWebSiteSchema(),
    generateFAQSchema(GLOBAL_FAQS),
  ];

  return (
    <main className="w-full overflow-hidden">
      <SEOHead
        title="Sri Shanmukha Computer Institute | Computer Courses in Nellore"
        description="Sri Shanmukha Computer Institute offers practical computer, programming, software and career-focused training in Nellore. Explore courses, batches and hands-on learning."
        keywords={SEO_CONFIG.keywordClusters.primaryLocal}
        canonicalPath="/"
        schemas={schemas}
      />
      <Hero onOpenEnquiry={onOpenEnquiry} />
      <StatsSection />
      <UpcomingBatchesSection onOpenEnquiry={onOpenEnquiry} />
      <CourseCategoriesSection />
      <LearningPathsSection />
      <WhySSCI />
      <LearningExperience />
      <TechnologySection />
      <ProjectsSection />
      <StudentJourney />
      <TestimonialsSection />
      <InstitutePreview />
      <FAQSection />
      <CTASection onOpenEnquiry={onOpenEnquiry} />
    </main>
  );
};
