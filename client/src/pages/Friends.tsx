import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatUploadDropzone } from '../components/forms/ChatUploadDropzone';
import { Users, Sparkles, MessageSquare } from 'lucide-react';

export const Friends: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF3EB] text-[#304A34] text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          Friends & Group Chat Analysis
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242923] editorial-title">
          Group Dynamics and Friendship Rhythms
        </h1>
        <p className="text-sm text-[#5A6559] max-w-lg mx-auto">
          Map participation across friends, identify group plan organizers, track inside joke keywords, and understand group communication trends.
        </p>
      </div>

      <ChatUploadDropzone
        initialCategory="friends"
        onAnalysisComplete={(id) => navigate(`/reports/${id}`)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-[#FFFEFA] p-6 rounded-xl border border-[#E3E1D9] space-y-2">
          <h4 className="text-sm font-bold text-[#242923] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#718B65]" /> Group Initiators
          </h4>
          <p className="text-xs text-[#5A6559] leading-relaxed">
            See who keeps the group plans moving and who responds most frequently.
          </p>
        </div>

        <div className="bg-[#FFFEFA] p-6 rounded-xl border border-[#E3E1D9] space-y-2">
          <h4 className="text-sm font-bold text-[#242923] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#718B65]" /> Top Keywords
          </h4>
          <p className="text-xs text-[#5A6559] leading-relaxed">
            Examine recurring words, memes, and shared themes across months of chat.
          </p>
        </div>

        <div className="bg-[#FFFEFA] p-6 rounded-xl border border-[#E3E1D9] space-y-2">
          <h4 className="text-sm font-bold text-[#242923] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#718B65]" /> Peak Hangout Hours
          </h4>
          <p className="text-xs text-[#5A6559] leading-relaxed">
            Visualize late-night banter vs midday banter with 24-hour heatmaps.
          </p>
        </div>
      </div>
    </div>
  );
};
