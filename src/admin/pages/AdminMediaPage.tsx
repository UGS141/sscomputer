import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Copy, Trash2, Search, CheckCircle2 } from 'lucide-react';
import { cmsStore, MediaItem } from '../cmsStore';

export const AdminMediaPage: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>(cmsStore.getMedia());
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setMedia([...cmsStore.getMedia()]);
    });
    return unsubscribe;
  }, []);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newMedia: MediaItem = {
      id: `m-${Date.now()}`,
      filename: file.name,
      url: `/ssci-logo.png`, // demo image placeholder fallback
      size: `${Math.round(file.size / 1024)} KB`,
      type: file.type.split('/')[1]?.toUpperCase() || 'PNG',
      uploadedAt: new Date().toISOString().split('T')[0],
      category: 'Website Images'
    };

    cmsStore.getState().media.unshift(newMedia);
    cmsStore.getState().auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Super Admin',
      action: 'UPLOAD_MEDIA',
      module: 'Media',
      details: `Uploaded media asset "${file.name}".`,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Asset Library</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Media & Image Manager</h1>
          <p className="text-xs text-gray-500 mt-1">Upload and organize course graphics, blog images, and brand assets</p>
        </div>

        <label className="py-2.5 px-4 rounded-xl brand-gradient-bg text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
          <input type="file" accept="image/*" onChange={handleSimulateUpload} className="hidden" />
        </label>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-teal-100/70 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filename..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#087F78]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {media.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-teal-100 shadow-2xs space-y-3 group">
            <div className="h-32 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
              <img src={item.url} alt={item.filename} className="h-full w-auto object-contain p-2" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-[#123B3A] truncate">{item.filename}</p>
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>{item.size}</span>
                <span>{item.uploadedAt}</span>
              </div>
            </div>

            <button
              onClick={() => handleCopyUrl(item.id, item.url)}
              className="w-full py-1.5 rounded-lg bg-teal-50 text-[#087F78] hover:bg-teal-100 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedId === item.id ? 'Copied URL!' : 'Copy Asset URL'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
