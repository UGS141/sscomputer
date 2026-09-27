import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';
import { cmsStore, type AdminUser } from '../cmsStore';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sscomputer.in');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState<AdminUser['role']>('SUPER ADMIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await cmsStore.loginWithBackend(email, password);
      if (res.success) {
        setLoading(false);
        navigate('/admin');
        return;
      }

      setError(res.message || 'Authentication failed. Please check your credentials and server connection.');
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Server login failed. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#123B3A] via-[#087F78] to-[#123B3A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <img src="/ssci-logo.png" alt="SSCI Logo" className="h-14 mx-auto object-contain bg-white p-2 rounded-2xl shadow-md" />
          <div>
            <h1 className="text-2xl font-extrabold text-[#123B3A]">Admin Workspace Login</h1>
            <p className="text-xs font-medium text-[#087F78] mt-1">Sri Shanmukha Computer Institute CMS & CRM</p>
          </div>
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#123B3A] focus:outline-none focus:border-[#087F78] focus:ring-2 focus:ring-teal-100 transition-all"
                placeholder="admin@sscomputer.in"
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#123B3A] focus:outline-none focus:border-[#087F78] focus:ring-2 focus:ring-teal-100 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Role Preset Selector */}
          <div>
            <label className="block text-xs font-bold text-[#123B3A] mb-1.5 uppercase tracking-wider">
              Login Role Preset
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as AdminUser['role'])}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#087F78] bg-teal-50/50 focus:outline-none focus:border-[#087F78]"
            >
              <option value="SUPER ADMIN">Super Admin (Full Master Control)</option>
              <option value="ADMIN">Admin (Website & CRM Control)</option>
              <option value="COUNSELLOR">Admissions Counsellor (Leads & Follow-ups)</option>
              <option value="CONTENT MANAGER">Content Manager (Blog & Courses)</option>
            </select>
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

        <div className="pt-4 border-t border-gray-100 text-center text-[11px] text-gray-500 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#12A77A]" />
          <span>Protected SSCI Administrative Portal</span>
        </div>
      </div>
    </div>
  );
};
