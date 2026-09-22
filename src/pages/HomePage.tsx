import React from 'react';
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
  return (
    <main className="w-full overflow-hidden">
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
