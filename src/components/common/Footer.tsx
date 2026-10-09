import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#123B3A] text-white pt-16 pb-8 border-t-4 border-[#087F78]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-teal-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={SITE_CONFIG.logo}
                alt={SITE_CONFIG.name}
                className="h-12 w-auto object-contain bg-white/90 p-1.5 rounded-xl shadow-md"
              />
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight leading-tight">
                  SRI SHANMUKHA
                </h3>
                <p className="text-xs font-semibold text-[#12A77A] tracking-widest">
                  COMPUTER INSTITUTE
                </p>
              </div>
            </Link>

            <p className="text-teal-100/80 text-sm leading-relaxed max-w-sm">
              Build practical computer skills, programming knowledge, and career-ready digital capabilities with structured classroom training and 100% hands-on lab sessions.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-900/60 border border-teal-700/50 text-xs font-semibold text-[#F5B72C]">
              <span className="w-2 h-2 rounded-full bg-[#12A77A] animate-pulse" />
              {SITE_CONFIG.tagline}
            </div>

            {/* Social Icons (Custom Inline SVGs) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-teal-900/80 hover:bg-[#F97316] flex items-center justify-center text-teal-200 hover:text-white transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-teal-900/80 hover:bg-[#087F78] flex items-center justify-center text-teal-200 hover:text-white transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href={SITE_CONFIG.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-teal-900/80 hover:bg-red-600 flex items-center justify-center text-teal-200 hover:text-white transition-all duration-200"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-teal-900/80 hover:bg-[#12A77A] flex items-center justify-center text-teal-200 hover:text-white transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-teal-800/80 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-teal-100/80">
              <li>
                <Link to="/" className="hover:text-[#12A77A] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#F97316]" /> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#12A77A] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#F97316]" /> About SSCI
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-[#12A77A] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#F97316]" /> All Courses
                </Link>
              </li>
              <li>
                <Link to="/learning-paths" className="hover:text-[#12A77A] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#F97316]" /> Learning Paths
                </Link>
              </li>
              <li>
                <Link to="/batches" className="hover:text-[#12A77A] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#F97316]" /> Upcoming Batches
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[#12A77A] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#F97316]" /> Student Projects
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#12A77A] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#F97316]" /> Blog & Resources
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#12A77A] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#F97316]" /> Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/verify-certificate"
                  className="inline-flex items-center gap-1.5 text-[#F5B72C] font-semibold hover:underline pt-1"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#12A77A]" /> Verify Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-teal-800/80 pb-2">
              Course Categories
            </h4>
            <ul className="space-y-2 text-sm text-teal-100/80">
              <li>
                <Link to="/courses?category=computer-essentials" className="hover:text-[#12A77A] transition-colors">
                  Computer Essentials
                </Link>
              </li>
              <li>
                <Link to="/courses?category=programming" className="hover:text-[#12A77A] transition-colors">
                  Programming Languages
                </Link>
              </li>
              <li>
                <Link to="/courses?category=web-development" className="hover:text-[#12A77A] transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses?category=database" className="hover:text-[#12A77A] transition-colors">
                  Database & SQL
                </Link>
              </li>
              <li>
                <Link to="/courses?category=data-ai" className="hover:text-[#12A77A] transition-colors">
                  Data & AI Tools
                </Link>
              </li>
              <li>
                <Link to="/courses?category=creative-design" className="hover:text-[#12A77A] transition-colors">
                  Creative & Design
                </Link>
              </li>
              <li>
                <Link to="/courses?category=kids-technology" className="hover:text-[#12A77A] transition-colors">
                  Kids Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-teal-800/80 pb-2">
              Contact SSCI
            </h4>
            <div className="space-y-2.5 text-xs text-teal-100/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.contact.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#12A77A] shrink-0" />
                <a href={`tel:${SITE_CONFIG.contact.phonePrimary}`} className="hover:text-white">
                  {SITE_CONFIG.contact.phonePrimary}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F5B72C] shrink-0" />
                <a href={`mailto:${SITE_CONFIG.contact.email}`} className="hover:text-white">
                  {SITE_CONFIG.contact.email}
                </a>
              </p>
              <p className="flex items-start gap-2 pt-1 border-t border-teal-800/50">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.contact.workingHours}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-200/70 gap-3">
          <p>© 2026 Sri Shanmukha Computer Institute (SSCI). All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link to="/verify-certificate" className="hover:text-white transition-colors">
              Certificate Portal
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Campus Address
            </Link>
            <span className="text-teal-300/80 font-medium">Developed by UGS IT Solutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
