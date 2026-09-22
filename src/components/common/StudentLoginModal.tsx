import React, { useState } from 'react';
import { X, Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({ isOpen, onClose }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber || !password) {
      setError('Please enter both your Roll Number / Registration ID and Password.');
      return;
    }

    // Mock Login Demonstration
    setError('Mock Student Portal Demo: Active student logins are enabled during lab registration. Please contact SSCI lab supervisor for your login credentials.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-teal-100">
        <div className="bg-[#123B3A] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={SITE_CONFIG.logo} alt={SITE_CONFIG.name} className="h-8 w-auto bg-white p-1 rounded-md" />
            <div>
              <span className="text-xs font-bold text-teal-300 block leading-tight">SSCI Student Portal</span>
              <h3 className="text-base font-extrabold text-white">Student Login</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-teal-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1">
                Roll Number / Reg ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. SSCI-2026-9482"
                  value={rollNumber}
                  onChange={(e) => {
                    setRollNumber(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#087F78] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white brand-gradient-bg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Secure Portal Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
