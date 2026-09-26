import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { cmsStore, Trainer } from '../cmsStore';

export const AdminTrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>(cmsStore.getTrainers());

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setTrainers([...cmsStore.getTrainers()]);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-[#087F78] uppercase tracking-wider block">Faculty CMS</span>
          <h1 className="text-2xl font-extrabold text-[#123B3A]">Trainers & Educators</h1>
          <p className="text-xs text-gray-500 mt-1">Manage experienced educators and practical computer lab mentors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="bg-white rounded-2xl p-6 border border-teal-100/70 shadow-2xs text-center space-y-3">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${trainer.gradient} text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md`}>
              {trainer.avatarText}
            </div>
            <h3 className="text-base font-bold text-[#123B3A]">{trainer.name}</h3>
            <p className="text-xs font-bold text-[#087F78]">{trainer.designation}</p>
            <p className="text-xs text-gray-500 line-clamp-2">{trainer.bio}</p>
            <div className="flex flex-wrap justify-center gap-1 pt-2">
              {trainer.specialization.map((spec, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-teal-50 text-[10px] font-semibold text-[#087F78]">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
