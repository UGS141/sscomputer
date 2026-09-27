import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, User, LogIn, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { SITE_CONFIG } from '../config/site';

export const StudentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber || !password) {
      setError('Please enter both your Roll Number / Reg ID and Password.');
      return;
    }

    setError(
      'Student Portal Notice: Student accounts are activated upon classroom registration. Please contact your SSCI lab supervisor or administration for your official access credentials.'
    );
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SEOHead
        title="Student Login Portal | Sri Shanmukha Computer Institute"
        description="Access your student portal, enrolled courses, practical lab assignments, and academic learning resources at SSCI Nellore."
        canonicalPath="/student-login"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <img src={SITE_CONFIG.logo} alt={SITE_CONFIG.name} className="h-12 w-auto object-contain" />
          <div className="text-left">
            <span className="text-base font-extrabold text-[#123B3A] block leading-none">SRI SHANMUKHA</span>
            <span className="text-xs font-semibold text-[#087F78] block leading-tight">COMPUTER INSTITUTE</span>
          </div>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-100/80 text-[#087F78] text-xs font-bold uppercase tracking-wider mb-2">
          <GraduationCap className="w-4 h-4 text-[#F97316]" />
          <span>Student Portal</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B3A] tracking-tight">
          Student <span className="brand-gradient-text">Authentication</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#4B6B69]">
          Access your enrolled courses, practical lab schedules, and course resources.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-teal-100 sm:px-10 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1.5">
                Roll Number / Reg ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. SSCI-STD-2026-01"
                  value={rollNumber}
                  onChange={(e) => {
                    setRollNumber(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white brand-gradient-bg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Secure Student Login
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <Link to="/" className="inline-flex items-center gap-1 font-bold text-[#087F78] hover:text-[#055C57]">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>

            <Link to="/admin/login" className="inline-flex items-center gap-1 font-semibold text-gray-500 hover:text-[#087F78]">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" /> Admin Login Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
