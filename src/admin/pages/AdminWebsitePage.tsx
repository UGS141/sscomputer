import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Edit3, Save, CheckCircle2, Sparkles, Layers, Cpu, Code2, Database } from 'lucide-react';
import { cmsStore, type FloatingSkill, type HeroContent, type Announcement } from '../cmsStore';

export const AdminWebsitePage: React.FC = () => {
  const [hero, setHero] = useState<HeroContent>(cmsStore.getHeroContent());
  const [announcement, setAnnouncement] = useState<Announcement>(cmsStore.getAnnouncement());
  const [floatingSkills, setFloatingSkills] = useState<FloatingSkill[]>(cmsStore.getFloatingSkills());
  const [activeTab, setActiveTab] = useState<'hero' | 'floating' | 'announcement'>('hero');
  const [saveMessage, setSaveMessage] = useState('');

  // Floating Skill Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<FloatingSkill | null>(null);
  const [skillFormData, setSkillFormData] = useState<Partial<FloatingSkill>>({
    name: 'Python',
    category: 'Programming Language',
    accentColor: 'from-amber-500 to-[#F97316]',
    dotColor: 'bg-[#F97316]',
    badgeBg: 'bg-amber-50 border-amber-200/60',
    duration: '6.2s',
    delay: '0.2s',
    positionClass: 'top-10 left-4 lg:left-[5%]',
  });

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setHero({ ...cmsStore.getHeroContent() });
      setAnnouncement({ ...cmsStore.getAnnouncement() });
      setFloatingSkills([...cmsStore.getFloatingSkills()]);
    });
    return unsubscribe;
  }, []);

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    cmsStore.updateHeroContent(hero);
    setSaveMessage('Homepage Hero section updated!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillFormData.name) return;

    const id = editingSkill ? editingSkill.id : `skill-${Date.now()}`;
    const newSkill: FloatingSkill = {
      id,
      name: skillFormData.name,
      category: skillFormData.category || 'Skill',
      icon: Code2, // default fallback icon component
      accentColor: skillFormData.accentColor || 'from-[#087F78] to-[#12A77A]',
      dotColor: skillFormData.dotColor || 'bg-[#087F78]',
      badgeBg: skillFormData.badgeBg || 'bg-teal-50 border-teal-200/60',
      duration: skillFormData.duration || '6.0s',
      delay: skillFormData.delay || '0s',
      positionClass: skillFormData.positionClass || 'top-20 right-4',
    };

    cmsStore.saveFloatingSkill(newSkill);
    setIsSkillModalOpen(false);
  };

  const handleDeleteSkill = (id: string) => {
    if (window.confirm('Remove this floating skill chip from the homepage hero?')) {
      cmsStore.deleteFloatingSkill(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Homepage & Layout CMS</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Website Layout & Floating Ecosystem</h1>
          <p className="text-xs text-gray-500 mt-1">Control landing hero copy, floating technology chips, and announcement banners</p>
        </div>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-[#12A77A] text-xs font-bold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hero' ? 'bg-[#087F78] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-teal-50'
          }`}
        >
          Landing Hero Content
        </button>
        <button
          onClick={() => setActiveTab('floating')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'floating' ? 'bg-[#087F78] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-teal-50'
          }`}
        >
          Floating Technologies ({floatingSkills.length})
        </button>
      </div>

      {/* HERO EDITOR TAB */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-[#123B3A]">Edit Landing Hero Headlines & CTAs</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Hero Top Badge</label>
              <input
                type="text"
                value={hero.badge}
                onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Headline Main Text</label>
              <input
                type="text"
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Highlight Gradient Text</label>
              <input
                type="text"
                value={hero.highlightText}
                onChange={(e) => setHero({ ...hero, highlightText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Primary CTA Button Label</label>
              <input
                type="text"
                value={hero.primaryCtaText}
                onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Hero Description</label>
              <textarea
                rows={3}
                value={hero.description}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Update Hero Section</span>
            </button>
          </div>
        </form>
      )}

      {/* FLOATING TECHNOLOGIES TAB */}
      {activeTab === 'floating' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-teal-100">
            <div>
              <h3 className="text-sm font-bold text-[#123B3A]">Hero Floating Skill Chips</h3>
              <p className="text-xs text-gray-500">Add, edit, or remove technology chips floating naturally around the hero</p>
            </div>
            <button
              onClick={() => {
                setEditingSkill(null);
                setSkillFormData({ name: 'Python', category: 'Programming Language' });
                setIsSkillModalOpen(true);
              }}
              className="py-2 px-3.5 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Floating Skill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {floatingSkills.map((skill) => (
              <div key={skill.id} className="bg-white p-4 rounded-2xl border border-teal-100 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${skill.dotColor}`} />
                  <div>
                    <h4 className="text-sm font-bold text-[#123B3A]">{skill.name}</h4>
                    <span className="text-[10px] text-gray-500">{skill.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    title="Remove Chip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveSkill} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-[#123B3A]">Add Hero Floating Technology Chip</h3>
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Technology / Course Name</label>
              <input
                type="text"
                value={skillFormData.name || ''}
                onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                placeholder="e.g. Python, Tally Prime, React, MS Excel..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#123B3A] mb-1">Category Label</label>
              <input
                type="text"
                value={skillFormData.category || ''}
                onChange={(e) => setSkillFormData({ ...skillFormData, category: e.target.value })}
                placeholder="e.g. Programming, Accounting, Web Dev..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsSkillModalOpen(false)}
                className="py-2 px-4 rounded-xl bg-gray-100 text-xs font-bold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl brand-gradient-bg text-white text-xs font-bold"
              >
                Save Floating Skill
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
