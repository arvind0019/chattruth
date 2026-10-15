import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatUploadDropzone } from '../components/forms/ChatUploadDropzone';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const Relationship: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold">
          <Heart className="w-3.5 h-3.5" />
          Relationship & Dating Analysis
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242923] editorial-title">
          Clarity on Connection, Not Assumptions
        </h1>
        <p className="text-sm text-[#5A6559] max-w-lg mx-auto">
          Understand conversational balance, check-in frequencies, emotional warmth, and mutual investment without over-analyzing isolated texts.
        </p>
      </div>

      <ChatUploadDropzone
        initialCategory="relationship"
        onAnalysisComplete={(id) => navigate(`/reports/${id}`)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-[#FFFEFA] p-6 rounded-xl border border-[#E3E1D9] space-y-2">
          <h4 className="text-sm font-bold text-[#242923] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#718B65]" /> Effort Balance
          </h4>
          <p className="text-xs text-[#5A6559] leading-relaxed">
            See participation percentages and initiated conversations rather than relying on feeling.
          </p>
        </div>

        <div className="bg-[#FFFEFA] p-6 rounded-xl border border-[#E3E1D9] space-y-2">
          <h4 className="text-sm font-bold text-[#242923] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#718B65]" /> Rhythm & Pacing
          </h4>
          <p className="text-xs text-[#5A6559] leading-relaxed">
            Distinguish natural weekday work pauses from intentional disengagement with median reply metrics.
          </p>
        </div>

        <div className="bg-[#FFFEFA] p-6 rounded-xl border border-[#E3E1D9] space-y-2">
          <h4 className="text-sm font-bold text-[#242923] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#718B65]" /> Objective & Safe
          </h4>
          <p className="text-xs text-[#5A6559] leading-relaxed">
            We never make definitive psychological accusations or diagnose relationship status.
          </p>
        </div>
      </div>
    </div>
  );
};
