import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatUploadDropzone } from '../components/forms/ChatUploadDropzone';
import { ShieldCheck, Smartphone, Apple, HelpCircle } from 'lucide-react';

export const Analyze: React.FC = () => {
  const navigate = useNavigate();
  const [platformTab, setPlatformTab] = useState<'iphone' | 'android'>('iphone');

  const handleAnalysisComplete = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242923] editorial-title">
          Analyze Your Conversation
        </h1>
        <p className="text-sm text-[#5A6559] max-w-lg mx-auto">
          Upload an exported WhatsApp plain-text file (.txt) to calculate measurable dynamics and generate AI communication insights.
        </p>
      </div>

      {/* Main Upload Dropzone */}
      <ChatUploadDropzone onAnalysisComplete={handleAnalysisComplete} />

      {/* Export Instructions Accordion */}
      <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#E3E1D9] pb-4">
          <HelpCircle className="w-5 h-5 text-[#304A34]" />
          <h3 className="text-base font-bold text-[#242923]">How to export a WhatsApp chat</h3>
        </div>

        {/* Platform Tabs */}
        <div className="flex gap-2 border-b border-[#E3E1D9] pb-3">
          <button
            type="button"
            onClick={() => setPlatformTab('iphone')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              platformTab === 'iphone'
                ? 'bg-[#304A34] text-[#FFFEFA]'
                : 'bg-[#F7F6F0] text-[#5A6559] hover:text-[#242923]'
            }`}
          >
            <Apple className="w-4 h-4" />
            iPhone (iOS)
          </button>
          <button
            type="button"
            onClick={() => setPlatformTab('android')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              platformTab === 'android'
                ? 'bg-[#304A34] text-[#FFFEFA]'
                : 'bg-[#F7F6F0] text-[#5A6559] hover:text-[#242923]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Android
          </button>
        </div>

        {/* Steps */}
        {platformTab === 'iphone' ? (
          <ol className="space-y-3 text-xs text-[#5A6559] list-decimal list-inside leading-relaxed">
            <li>Open the WhatsApp conversation you wish to analyze.</li>
            <li>Tap the contact or group name at the top of the screen to open Chat Info.</li>
            <li>Scroll down and tap <strong>Export Chat</strong>.</li>
            <li>Choose <strong>Without Media</strong> (media files like videos and photos are not analyzed).</li>
            <li>Save the resulting <code>.txt</code> file to your device Files or share it to your computer.</li>
          </ol>
        ) : (
          <ol className="space-y-3 text-xs text-[#5A6559] list-decimal list-inside leading-relaxed">
            <li>Open the WhatsApp chat you wish to analyze.</li>
            <li>Tap the <strong>three dots</strong> in the top right corner.</li>
            <li>Tap <strong>More &gt; Export chat</strong>.</li>
            <li>Select <strong>Without media</strong>.</li>
            <li>Save or email the <code>.txt</code> file to yourself and upload it above.</li>
          </ol>
        )}

        <div className="pt-3 border-t border-[#E3E1D9] flex items-center gap-2 text-xs text-[#7F8A7D]">
          <ShieldCheck className="w-4 h-4 text-[#718B65]" />
          <span>Chats are processed in-memory. We never store raw chat contents permanently.</span>
        </div>
      </div>
    </div>
  );
};
