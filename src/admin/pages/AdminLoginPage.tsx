import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cmsStore } from '../cmsStore';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const checkActiveSession = async () => {
      const isValid = await cmsStore.verifySession();
      if (isMounted) {
        if (isValid) {
          navigate('/admin', { replace: true });
        } else {
          setCheckingSession(false);
        }
      }
    };
    checkActiveSession();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await cmsStore.loginWithBackend(email, password);
      if (res.success) {
        setLoading(false);
        navigate('/admin', { replace: true });
        return;
      }
      setError(res.message || 'Authentication failed. Please check your credentials and server connection.');
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Server login failed. Please check your connection.');
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#123B3A] via-[#087F78] to-[#123B3A] flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3 text-white">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wider uppercase text-teal-200">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#123B3A] via-[#087F78] to-[#123B3A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          {/* Dual Product & Client Logos */}
          <div className="inline-flex items-center justify-center gap-3 bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100 max-w-[340px] mx-auto">
            <img src="/ugs-logo.png" alt="UGS IT Solutions Logo" className="h-8 sm:h-9 w-auto object-contain" />
            <span className="text-gray-300 text-xs font-bold">×</span>
            <img src="/ssci-logo.png" alt="SSCI Logo" className="h-8 sm:h-9 w-auto object-contain" />
          </div>

          <div className="space-y-1">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/60 text-[10px] font-extrabold text-[#087F78] uppercase tracking-widest">
              UGS ADMIN SUITE
            </div>
            <h1 className="text-2xl font-extrabold text-[#123B3A] tracking-tight">Admin Workspace Login</h1>
            <p className="text-xs font-semibold text-gray-500">Sri Shanmukha Computer Institute Administration Portal</p>
          </div>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-teal-200 to-transparent mx-auto pt-1" />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2 border border-red-200">
            <Shield className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#123B3A] mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#123B3A] focus:outline-none focus:border-[#087F78] focus:ring-2 focus:ring-teal-100 transition-all"
                placeholder="Enter your admin email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#123B3A] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#123B3A] focus:outline-none focus:border-[#087F78] focus:ring-2 focus:ring-teal-100 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center space-y-1">
          <div className="text-[11px] text-gray-600 font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#12A77A]" />
            <span>Protected SSCI Administrative Portal</span>
          </div>
          <p className="text-[10px] font-medium text-gray-400">A product by UGS IT Solutions</p>
        </div>
      </div>
    </div>
  );
};
