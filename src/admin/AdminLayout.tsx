import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  BookOpen,
  Calendar,
  Inbox,
  Users,
  GraduationCap,
  FileText,
  Award,
  Image as ImageIcon,
  Search,
  Settings,
  Shield,
  LogOut,
  Bell,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Command,
  UserCheck,
  Building2,
  MessageSquare
} from 'lucide-react';
import { cmsStore, AdminUser, Lead } from './cmsStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(cmsStore.getCurrentUser());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications Popover
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  // Profile Popover
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Subscribe to CMS Store updates
  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setCurrentUser(cmsStore.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    cmsStore.logout();
    navigate('/admin/login');
  };

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'ACADEMICS & CURRICULUM',
      items: [
        { label: 'Courses CMS', path: '/admin/courses', icon: BookOpen },
        { label: 'Upcoming Batches', path: '/admin/batches', icon: Calendar },
      ],
    },
    {
      title: 'CRM & ADMISSIONS',
      items: [
        { label: 'Leads & Enquiries', path: '/admin/enquiries', icon: Inbox, badge: cmsStore.getLeads().filter(l => l.status === 'New').length },
        { label: 'Students Roster', path: '/admin/students', icon: Users },
      ],
    },
    {
      title: 'WEBSITE & CONTENT CMS',
      items: [
        { label: 'Website CMS & Hero', path: '/admin/website', icon: Globe },
        { label: 'Content (Blog & Projects)', path: '/admin/blog', icon: FileText },
        { label: 'Faculty & Trainers', path: '/admin/trainers', icon: GraduationCap },
        { label: 'Certificates Registry', path: '/admin/certificates', icon: Award },
        { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
      ],
    },
    {
      title: 'SYSTEM & ANALYTICS',
      items: [
        { label: 'SEO Control Center', path: '/admin/seo', icon: Search },
        { label: 'Analytics Reports', path: '/admin/analytics', icon: Sparkles },
        { label: 'Settings & Security', path: '/admin/settings', icon: Settings },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: Shield },
      ],
    },
  ];

  // Breadcrumb generator
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/admin') return ['Dashboard'];
    const parts = path.split('/').filter(Boolean);
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  };

  const breadcrumbs = getBreadcrumbs();

  // Search Results
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { title: string; subtitle: string; path: string; category: string }[] = [];

    // Courses
    cmsStore.getCourses().forEach((c) => {
      if (c.title.toLowerCase().includes(q) || c.skillsLearned.some((s) => s.toLowerCase().includes(q))) {
        results.push({ title: c.title, subtitle: `Course (${c.level})`, path: '/admin/courses', category: 'Course' });
      }
    });

    // Batches
    cmsStore.getBatches().forEach((b) => {
      if (b.courseName.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)) {
        results.push({ title: b.courseName, subtitle: `Batch ${b.id} • ${b.timing}`, path: '/admin/batches', category: 'Batch' });
      }
    });

    // Leads
    cmsStore.getLeads().forEach((l) => {
      if (l.name.toLowerCase().includes(q) || l.phone.includes(q) || (l.email && l.email.toLowerCase().includes(q))) {
        results.push({ title: l.name, subtitle: `Lead (${l.courseInterested}) • ${l.status}`, path: '/admin/enquiries', category: 'CRM Lead' });
      }
    });

    // Blog
    cmsStore.getBlogPosts().forEach((b) => {
      if (b.title.toLowerCase().includes(q)) {
        results.push({ title: b.title, subtitle: `Blog Post • ${b.category}`, path: '/admin/blog', category: 'Blog' });
      }
    });

    // Certificates
    cmsStore.getCertificates().forEach((c) => {
      if (c.certificateNumber.toLowerCase().includes(q) || c.studentName.toLowerCase().includes(q)) {
        results.push({ title: c.certificateNumber, subtitle: `${c.studentName} - ${c.courseName}`, path: '/admin/certificates', category: 'Certificate' });
      }
    });

    return results.slice(0, 8);
  };

  const searchResults = getSearchResults();

  return (
    <div className="min-h-screen bg-[#F6F9F8] text-[#123B3A] font-sans flex flex-col">
      {/* Search Modal (Ctrl+K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-teal-100 max-w-xl w-full overflow-hidden animate-fadeIn">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-[#087F78]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, leads, students, batches, certificates..."
                className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder-gray-400"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-3 space-y-1">
              {!searchQuery.trim() ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  Type to search across SSCI Courses, Leads, Batches, Certificates, and Content...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500">
                  No matching results found for "{searchQuery}".
                </div>
              ) : (
                searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      navigate(item.path);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-teal-50/70 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#123B3A] group-hover:text-[#087F78]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">{item.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-teal-100/80 text-[#087F78] uppercase tracking-wider">
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Wrapper */}
      <div className="flex flex-1 relative">
        {/* Left Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-[#123B3A] text-white flex flex-col transition-all duration-300 border-r border-teal-900/50 ${
            isSidebarOpen ? 'w-64' : 'w-20'
          } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          {/* Logo Header */}
          <div className="p-4 border-b border-teal-800/60 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <img src="/ssci-logo.png" alt="SSCI Logo" className="h-9 w-auto bg-white p-1 rounded-lg" />
              {isSidebarOpen && (
                <div>
                  <h1 className="text-sm font-extrabold text-white tracking-wide leading-none">SSCI ADMIN</h1>
                  <span className="text-[10px] font-semibold text-teal-300 tracking-wider">MASTER CMS & CRM</span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-lg bg-teal-900/50 hover:bg-teal-800 text-teal-200 transition-colors"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {isSidebarOpen && (
                  <h3 className="px-3 text-[10px] font-bold text-teal-400 tracking-widest uppercase mb-2">
                    {section.title}
                  </h3>
                )}
                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={iIdx}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-[#087F78] to-[#12A77A] text-white shadow-lg shadow-teal-900/40'
                          : 'text-teal-100/80 hover:bg-teal-900/40 hover:text-white'
                      }`}
                      title={!isSidebarOpen ? item.label : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-teal-300 group-hover:text-white'}`} />
                        {isSidebarOpen && <span>{item.label}</span>}
                      </div>
                      {isSidebarOpen && item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F97316] text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User Footer Card */}
          <div className="p-3 border-t border-teal-800/60 bg-teal-950/40">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#087F78] to-[#F5B72C] text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                  {currentUser?.name.charAt(0) || 'A'}
                </div>
                {isSidebarOpen && (
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-white truncate">{currentUser?.name || 'Admin User'}</h4>
                    <span className="text-[10px] font-semibold text-amber-400 block">{currentUser?.role || 'SUPER ADMIN'}</span>
                  </div>
                )}
              </div>
              {isSidebarOpen && (
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-teal-300 hover:text-white hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-white border-b border-teal-100/60 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
            {/* Left: Mobile Menu Toggle & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-teal-50 text-[#087F78] hover:bg-teal-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#4B6B69]">
                <Link to="/admin" className="hover:text-[#087F78] transition-colors flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    <span className={idx === breadcrumbs.length - 1 ? 'text-[#087F78] font-bold' : ''}>
                      {crumb}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Search trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#F6F9F8] border border-gray-200 text-xs text-gray-500 hover:border-teal-300 hover:bg-white transition-all shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-[#087F78]" />
                <span>Search system...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-200 text-[10px] font-bold text-gray-600">Ctrl+K</kbd>
              </button>

              {/* View Public Website */}
              <Link
                to="/"
                target="_blank"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-[#087F78] hover:bg-teal-100 text-xs font-bold transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>View Site</span>
              </Link>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-teal-50 text-gray-600 hover:text-[#087F78] transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F97316] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-teal-100 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#123B3A]">System Alerts</h4>
                      <button
                        onClick={() => setUnreadCount(0)}
                        className="text-[10px] text-[#087F78] font-semibold hover:underline"
                      >
                        Mark read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                      {cmsStore.getLeads().slice(0, 3).map((lead, idx) => (
                        <div key={idx} className="p-3 hover:bg-teal-50/50 transition-colors flex items-start gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-[#F97316] mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-[#123B3A]">New Website Enquiry</p>
                            <p className="text-[11px] text-gray-600">{lead.name} requested details for {lead.courseInterested}.</p>
                            <span className="text-[10px] text-gray-400 block mt-1">{new Date(lead.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-teal-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full brand-gradient-bg text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    {currentUser?.name.charAt(0) || 'A'}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <span className="text-xs font-bold text-[#123B3A] block">{currentUser?.name}</span>
                    <span className="text-[10px] font-semibold text-[#087F78]">{currentUser?.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-teal-100 py-2 z-50 animate-fadeIn space-y-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-[#123B3A]">{currentUser?.name}</p>
                      <p className="text-[10px] text-gray-500">{currentUser?.email}</p>
                    </div>
                    <Link
                      to="/admin/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-teal-50 hover:text-[#087F78]"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Security Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
