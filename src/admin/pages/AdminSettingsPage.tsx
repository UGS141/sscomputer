import React, { useState } from 'react';
import { Settings, Save, Building2, Phone, Mail, MapPin, Shield, CheckCircle2 } from 'lucide-react';
import { cmsStore, type SiteSettings } from '../cmsStore';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(cmsStore.getSettings());
  const [saveMessage, setSaveMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cmsStore.updateSettings(settings);
    setSaveMessage('Institute NAP settings & centralized contact information saved!');
    setTimeout(() => setSaveMessage(''), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Institute Configuration</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Settings & NAP Control</h1>
          <p className="text-xs text-gray-500 mt-1">Manage centralized NAP (Name, Address, Phone), WhatsApp, and social media channels</p>
        </div>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-[#12A77A] text-xs font-bold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{saveMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs space-y-6">
        <h3 className="text-sm font-bold text-[#123B3A] border-b border-gray-100 pb-2">Master Business NAP Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#123B3A] mb-1">Official Business Name</label>
            <input
              type="text"
              value={settings.instituteName}
              onChange={(e) => setSettings({ ...settings, instituteName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B3A] mb-1">Brand Abbreviation</label>
            <input
              type="text"
              value={settings.shortName}
              onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B3A] mb-1">Official Phone Number</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B3A] mb-1">WhatsApp Business Number</label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B3A] mb-1">Official Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B3A] mb-1">Working Hours</label>
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#123B3A] mb-1">Campus Physical Address</label>
            <textarea
              rows={2}
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs font-medium"
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
