import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail, Menu, CheckCircle, UserRound, MessageSquare, ArrowRight, ChevronDown, GraduationCap, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG, generateWhatsAppUrl } from '../../config/site';

interface NavbarProps {
  onOpenEnquiry: (courseTitle?: string) => void;
  onOpenLogin: () => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnquiry, onOpenMobileMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const loginDropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target as Node)) {
        setIsLoginDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLoginDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* =========================================================
          MOBILE NAVBAR (UNTOUCHED - ONLY FOR < 1024px)
         ========================================================= */}
      <header className="sticky top-0 z-40 w-full lg:hidden">
        {/* Top Utility Announcement Bar */}
        <div className="bg-[#123B3A] text-white text-xs py-2 px-4 border-b border-teal-800/50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
              <span className="flex items-center gap-1.5 text-teal-200">
                <Phone className="w-3.5 h-3.5 text-[#F97316]" />
                <a href={`tel:${SITE_CONFIG.contact.phonePrimary}`} className="hover:text-white transition-colors">
                  {SITE_CONFIG.contact.phonePrimary}
                </a>
              </span>
              <span className="hidden md:inline text-teal-600">|</span>
              <span className="hidden md:flex items-center gap-1.5 text-teal-200">
                <Mail className="w-3.5 h-3.5 text-[#F5B72C]" />
                <a href={`mailto:${SITE_CONFIG.contact.email}`} className="hover:text-white transition-colors">
                  {SITE_CONFIG.contact.email}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/verify-certificate"
                className="flex items-center gap-1 text-teal-200 hover:text-white transition-colors underline decoration-teal-500/50 underline-offset-4"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#12A77A]" />
                Verify Certificate
              </Link>
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-medium transition-colors"
              >
                <MessageSquare className="w-3 h-3 text-emerald-400" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Main Mobile Nav Bar */}
        <nav
          className={`w-full transition-all duration-300 ${
            scrolled
              ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-teal-100 py-3'
              : 'bg-white border-b border-teal-50 py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={SITE_CONFIG.logo} alt={SITE_CONFIG.name} className="h-10 sm:h-12 w-auto object-contain" />
              <div className="hidden sm:block">
                <div className="text-sm font-extrabold text-[#123B3A] leading-none">SRI SHANMUKHA</div>
                <div className="text-[10px] font-semibold text-[#087F78] leading-tight">COMPUTER INSTITUTE</div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenEnquiry()}
                className="md:hidden px-3.5 py-1.5 rounded-lg text-xs font-bold text-white brand-gradient-bg shadow-sm"
              >
                Enquire
              </button>
              <button
                onClick={onOpenMobileMenu}
                className="p-2 rounded-lg text-[#123B3A] hover:bg-teal-50 hover:text-[#087F78] transition-colors"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* =========================================================
          DESKTOP FLOATING GLASS NAVBAR (ONLY FOR >= 1024px)
         ========================================================= */}
      <header className="hidden lg:block sticky top-3 z-50 w-full px-6 xl:px-12 transition-all duration-300">
        <div className="max-w-[1440px] mx-auto space-y-2">
          
          {/* Top Utility Glass Bar */}
          <div
            className={`transition-all duration-300 rounded-full px-6 py-1.5 flex items-center justify-between text-xs border ${
              scrolled
                ? 'bg-white/85 backdrop-blur-xl border-white/60 shadow-xs text-[#123B3A]'
                : 'bg-white/60 backdrop-blur-lg border-white/50 text-[#123B3A]'
            }`}
          >
            <div className="flex items-center gap-5">
              <a
                href={`tel:${SITE_CONFIG.contact.phonePrimary}`}
                className="flex items-center gap-1.5 font-semibold text-[#087F78] hover:text-[#123B3A] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#F97316]" />
                <span>{SITE_CONFIG.contact.phonePrimary}</span>
              </a>

              <span className="text-teal-300">|</span>

              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="flex items-center gap-1.5 font-medium text-gray-700 hover:text-[#087F78] transition-colors truncate max-w-[280px] xl:max-w-none"
              >
                <Mail className="w-3.5 h-3.5 text-[#087F78]" />
                <span className="truncate">{SITE_CONFIG.contact.email}</span>
              </a>
            </div>

            <div className="flex items-center gap-2 font-bold text-[#F5B72C] tracking-widest text-[11px] uppercase bg-[#123B3A]/90 px-3 py-0.5 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#12A77A] animate-pulse" />
              <span>{SITE_CONFIG.tagline}</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/verify-certificate"
                className="flex items-center gap-1.5 font-bold text-[#087F78] hover:text-[#F97316] transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#12A77A]" />
                <span>Verify Certificate</span>
              </Link>

              <span className="text-teal-300">|</span>

              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 hover:bg-emerald-500/25 font-bold text-[11px] transition-colors border border-emerald-500/20"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Main Floating Glass Pill Header */}
          <div
            className={`w-full transition-all duration-300 rounded-[24px] px-6 py-3 border flex items-center justify-between gap-4 ${
              scrolled
                ? 'bg-white/85 backdrop-blur-[20px] backdrop-saturate-[160%] border-white/80 shadow-[0_12px_45px_rgba(8,127,120,0.14)]'
                : 'bg-white/65 backdrop-blur-[18px] backdrop-saturate-[150%] border-white/60 shadow-[0_10px_40px_rgba(8,127,120,0.08)]'
            }`}
          >
            {/* SSCI Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <img
                src={SITE_CONFIG.logo}
                alt={SITE_CONFIG.name}
                className="h-11 xl:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div>
                <div className="text-sm xl:text-base font-extrabold text-[#123B3A] tracking-tight leading-none group-hover:text-[#087F78] transition-colors">
                  SRI SHANMUKHA
                </div>
                <div className="text-[10px] font-semibold text-[#087F78] tracking-widest leading-tight">
                  COMPUTER INSTITUTE
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="flex items-center gap-1 xl:gap-1.5">
              {SITE_CONFIG.navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap relative ${
                      active
                        ? 'text-[#087F78] bg-teal-50/90 shadow-xs'
                        : 'text-[#123B3A] hover:text-[#087F78] hover:bg-teal-50/60'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#087F78] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Login Selector Dropdown Trigger */}
              <div className="relative" ref={loginDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsLoginDropdownOpen((prev) => !prev)}
                  aria-label="Login"
                  aria-expanded={isLoginDropdownOpen}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold text-[#087F78] bg-white/60 border border-teal-200/80 hover:bg-white hover:border-[#087F78] transition-all duration-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#087F78]/30"
                >
                  <UserRound className="w-4 h-4 text-[#087F78]" />
                  <span className="whitespace-nowrap">Login</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#087F78] transition-transform duration-200 ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Login Dropdown Menu */}
                {isLoginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-teal-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#087F78] block">
                        Select Portal Login
                      </span>
                    </div>

                    {/* Student Login Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginDropdownOpen(false);
                        navigate('/student-login');
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/80 text-left transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-teal-50 text-[#087F78] group-hover:bg-[#087F78] group-hover:text-white transition-colors shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors">
                          Student Login
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
                          Access student portal, courses & resources
                        </div>
                      </div>
                    </button>

                    {/* Admin Login Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginDropdownOpen(false);
                        navigate('/admin/login');
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/80 text-left transition-colors group mt-0.5"
                    >
                      <div className="p-2 rounded-lg bg-orange-50 text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white transition-colors shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#123B3A] group-hover:text-[#087F78] transition-colors">
                          Admin Login
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
                          Manage institute CMS, batches & website
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Enquire Now Button */}
              <button
                onClick={() => onOpenEnquiry()}
                className="px-5 py-2 rounded-xl text-xs xl:text-sm font-bold text-white bg-gradient-to-r from-[#087F78] to-[#12A77A] shadow-md shadow-teal-700/20 hover:shadow-lg hover:shadow-teal-700/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5 group"
              >
                <span className="whitespace-nowrap">Enquire Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </header>
    </>
  );
};
