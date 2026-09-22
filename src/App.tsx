import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Common Components
import { Navbar } from './components/common/Navbar';
import { MobileMenu } from './components/common/MobileMenu';
import { Footer } from './components/common/Footer';
import { EnquiryModal } from './components/common/EnquiryModal';
import { StudentLoginModal } from './components/common/StudentLoginModal';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ScrollToTop } from './components/common/ScrollToTop';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LearningPathsPage } from './pages/LearningPathsPage';
import { LearningPathDetailPage } from './pages/LearningPathDetailPage';
import { BatchesPage } from './pages/BatchesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TrainersPage } from './pages/TrainersPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ContactPage } from './pages/ContactPage';
import { CertificateVerificationPage } from './pages/CertificateVerificationPage';

export const App: React.FC = () => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState<string | undefined>(undefined);

  const handleOpenEnquiry = (courseTitle?: string) => {
    setSelectedCourseForEnquiry(courseTitle);
    setIsEnquiryOpen(true);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#F7FAF9] text-[#123B3A]">
        {/* Sticky Navbar */}
        <Navbar
          onOpenEnquiry={handleOpenEnquiry}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Mobile Slide-out Drawer */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onOpenEnquiry={handleOpenEnquiry}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        {/* Main Route Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/about" element={<AboutPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/courses" element={<CoursesPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/courses/:slug" element={<CourseDetailPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/learning-paths" element={<LearningPathsPage />} />
            <Route path="/learning-paths/:slug" element={<LearningPathDetailPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/batches" element={<BatchesPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/projects" element={<ProjectsPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/trainers" element={<TrainersPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/verify-certificate" element={<CertificateVerificationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global Footer */}
        <Footer />

        {/* Floating WhatsApp Quick Action */}
        <WhatsAppButton />

        {/* Modals */}
        <EnquiryModal
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          prefilledCourse={selectedCourseForEnquiry}
        />

        <StudentLoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
