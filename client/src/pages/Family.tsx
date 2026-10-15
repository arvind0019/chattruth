import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatUploadDropzone } from '../components/forms/ChatUploadDropzone';
import { Home as HomeIcon, Sparkles } from 'lucide-react';

export const Family: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-semibold">
          <HomeIcon className="w-3.5 h-3.5" />
          Family Dynamics Analysis
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242923] editorial-title">
          Family Communication Patterns
        </h1>
        <p className="text-sm text-[#5A6559] max-w-lg mx-auto">
          Understand family check-in habits, support patterns, logistical coordination, and tone nuances across siblings and parents.
        </p>
      </div>

      <ChatUploadDropzone
        initialCategory="family"
        onAnalysisComplete={(id) => navigate(`/reports/${id}`)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-[#FFFEFA] p-6 rounded-xl border border-[#E3E1D9] space-y-2">
          <h4 className="text-sm font-bold text-[#242923] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#718B65]" /> Check-in Cycles
          </h4>
          <p className="text-xs text-[#5A6559] leading-relaxed">
            Discover weekly patterns and ritual check-ins across family members.
          </p>
        </div>

        <div className="bg-[#FFFEFA] p-6 rounded-xl border border-[#E3E1D9] space-y-2">
          <h4 className="text-sm font-bold text-[#242923] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#718B65]" /> Generational Pacing
          </h4>
          <p className="text-xs text-[#5A6559] leading-relaxed">
            Compare message lengths and reply pacing across different generations.
          </p>
        </div>

        <div className="bg-[#FFFEFA] p-6 rounded-xl border border-[#E3E1D9] space-y-2">
          <h4 className="text-sm font-bold text-[#242923] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#718B65]" /> Caring vs Logistics
          </h4>
          <p className="text-xs text-[#5A6559] leading-relaxed">
            See the balance between functional coordination and emotional connection.
          </p>
        </div>
      </div>
    </div>
  );
};
