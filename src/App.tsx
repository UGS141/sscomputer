import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Common Components
import { Navbar } from './components/common/Navbar';
import { MobileMenu } from './components/common/MobileMenu';
import { Footer } from './components/common/Footer';
import { EnquiryModal } from './components/common/EnquiryModal';
import { StudentLoginModal } from './components/common/StudentLoginModal';
import { LaunchOfferModal } from './components/common/LaunchOfferModal';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ReturnToTop } from './components/common/ReturnToTop';
import { InstagramFloat } from './components/common/InstagramFloat';
import { ScrollToTop } from './components/common/ScrollToTop';
import { LAUNCH_OFFER_CONFIG } from './config/launchOffer';

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
import { StudentLoginPage } from './pages/StudentLoginPage';

// Admin CMS & CRM Components
import { AdminLayout } from './admin/AdminLayout';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminCoursesPage } from './admin/pages/AdminCoursesPage';
import { AdminCourseEditorPage } from './admin/pages/AdminCourseEditorPage';
import { AdminBatchesPage } from './admin/pages/AdminBatchesPage';
import { AdminEnquiriesPage } from './admin/pages/AdminEnquiriesPage';
import { AdminStudentsPage } from './admin/pages/AdminStudentsPage';
import { AdminTrainersPage } from './admin/pages/AdminTrainersPage';
import { AdminContentPage } from './admin/pages/AdminContentPage';
import { AdminCertificatesPage } from './admin/pages/AdminCertificatesPage';
import { AdminWebsitePage } from './admin/pages/AdminWebsitePage';
import { AdminSEOPage } from './admin/pages/AdminSEOPage';
import { AdminAnalyticsPage } from './admin/pages/AdminAnalyticsPage';
import { AdminSettingsPage } from './admin/pages/AdminSettingsPage';
import { AdminMediaPage } from './admin/pages/AdminMediaPage';
import { AdminAuditLogsPage } from './admin/pages/AdminAuditLogsPage';

export const App: React.FC = () => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLaunchOfferOpen, setIsLaunchOfferOpen] = useState(false);
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState<string | undefined>(undefined);

  const handleOpenEnquiry = (courseTitle?: string) => {
    setSelectedCourseForEnquiry(courseTitle);
    setIsEnquiryOpen(true);
  };

  React.useEffect(() => {
    if (!LAUNCH_OFFER_CONFIG.enabled) return;

    // Verify fixed campaign timestamp hasn't expired
    const isCampaignActive = new Date().getTime() < new Date(LAUNCH_OFFER_CONFIG.expiresAt).getTime();
    if (!isCampaignActive) return;

    // Check session dismissal state
    const isDismissed = sessionStorage.getItem('ssci_launch_offer_dismissed') === 'true';
    if (isDismissed) return;

    // Trigger popup after 800ms delay on initial visit
    const timer = setTimeout(() => {
      setIsLaunchOfferOpen(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseLaunchOffer = () => {
    setIsLaunchOfferOpen(false);
    sessionStorage.setItem('ssci_launch_offer_dismissed', 'true');
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Dashboard Protected Layout & Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/courses" element={<AdminCoursesPage />} />
                <Route path="/courses/new" element={<AdminCourseEditorPage />} />
                <Route path="/courses/edit/:slug" element={<AdminCourseEditorPage />} />
                <Route path="/batches" element={<AdminBatchesPage />} />
                <Route path="/enquiries" element={<AdminEnquiriesPage />} />
                <Route path="/students" element={<AdminStudentsPage />} />
                <Route path="/trainers" element={<AdminTrainersPage />} />
                <Route path="/blog" element={<AdminContentPage />} />
                <Route path="/certificates" element={<AdminCertificatesPage />} />
                <Route path="/website" element={<AdminWebsitePage />} />
                <Route path="/seo" element={<AdminSEOPage />} />
                <Route path="/analytics" element={<AdminAnalyticsPage />} />
                <Route path="/settings" element={<AdminSettingsPage />} />
                <Route path="/media" element={<AdminMediaPage />} />
                <Route path="/audit-logs" element={<AdminAuditLogsPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AdminLayout>
          }
        />

        {/* Public Website Routes */}
        <Route
          path="/*"
          element={
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
                  <Route path="/student-login" element={<StudentLoginPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              {/* Global Footer */}
              <Footer />

              {/* Global Floating UI Controls */}
              <InstagramFloat />
              <WhatsAppButton />
              <ReturnToTop />

              {/* Modals */}
              <LaunchOfferModal
                isOpen={isLaunchOfferOpen}
                onClose={handleCloseLaunchOffer}
                onRegisterNow={(courseTitle) => {
                  handleCloseLaunchOffer();
                  handleOpenEnquiry(courseTitle);
                }}
              />

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
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

