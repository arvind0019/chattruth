import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, Users, Calendar } from 'lucide-react';
import { apiRequest, ApiError } from '../../lib/api';
import { AnalysisCategory } from '../../shared/types/report';

interface ChatUploadDropzoneProps {
  initialCategory?: AnalysisCategory;
  onAnalysisComplete: (reportId: string, isPaid: boolean) => void;
}

interface ParsePreviewData {
  totalMessages: number;
  systemMessageCount: number;
  participants: string[];
  startDate: string | null;
  endDate: string | null;
  formatDetected: string;
  warnings: string[];
  previewExcerpts: { sender: string; content: string; timestamp: string | null }[];
}

export const ChatUploadDropzone: React.FC<ChatUploadDropzoneProps> = ({
  initialCategory = 'general',
  onAnalysisComplete,
}) => {
  const [category, setCategory] = useState<AnalysisCategory>(initialCategory);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewData, setPreviewData] = useState<ParsePreviewData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (selectedFile: File) => {
    setErrorMessage(null);
    setPreviewData(null);

    // Validate size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit. Please upload a smaller WhatsApp export.');
      return;
    }

    // Validate file type
    if (!selectedFile.name.toLowerCase().endsWith('.txt') && selectedFile.type !== 'text/plain') {
      setErrorMessage('Please upload a plain-text WhatsApp export (.txt). Other formats are not supported.');
      return;
    }

    setFile(selectedFile);
    setIsParsing(true);

    try {
      const text = await selectedFile.text();
      setFileContent(text);

      // Call server preview API
      const preview = await apiRequest<ParsePreviewData>('/uploads/preview', {
        method: 'POST',
        body: JSON.stringify({ rawText: text }),
      });

      setPreviewData(preview);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to read and parse the file. Please verify it is a valid WhatsApp chat export.');
      }
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleTriggerAnalysis = async () => {
    if (!fileContent) return;
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const result = await apiRequest<{ reportId: string; isPaid: boolean }>('/reports', {
        method: 'POST',
        body: JSON.stringify({
          rawText: fileContent,
          category,
        }),
      });

      onAnalysisComplete(result.reportId, result.isPaid);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during AI analysis. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Category Selector */}
      <div className="bg-[#FFFEFA] p-4 rounded-xl border border-[#E3E1D9] shadow-xs">
        <label className="block text-xs font-semibold text-[#5A6559] uppercase tracking-wider mb-2.5">
          Select Conversation Context
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['relationship', 'friends', 'family', 'general'] as AnalysisCategory[]).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`py-2 px-3 text-xs font-medium rounded-lg capitalize border transition-all text-center ${
                category === cat
                  ? 'bg-[#304A34] text-[#FFFEFA] border-[#304A34]'
                  : 'bg-[#FFFEFA] text-[#242923] border-[#E3E1D9] hover:bg-[#F7F6F0]'
              }`}
            >
              {cat === 'relationship' ? 'Relationship' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dropzone Container */}
      {!previewData ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-[#304A34] bg-[#EDF3EB]'
              : 'border-[#E3E1D9] bg-[#FFFEFA] hover:border-[#718B65] hover:bg-[#F7F6F0]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
          />

          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#EDF3EB] text-[#304A34] flex items-center justify-center">
            {isParsing ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-[#242923] mb-1">
            {isParsing ? 'Inspecting WhatsApp export...' : 'Drag and drop your WhatsApp export (.txt)'}
          </h3>
          <p className="text-sm text-[#7F8A7D] max-w-md mx-auto mb-2">
            Supports exported chats from Android and iPhone without media.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-[#EDF3EB] border border-[#D5E2D2] text-[#304A34] text-xs font-medium">
            <span>🇮🇳 Full Hinglish & Indian WhatsApp context understanding enabled</span>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#304A34] text-[#FFFEFA] hover:bg-[#263B29] transition-colors"
          >
            <FileText className="w-4 h-4" />
            Browse Files
          </button>
        </div>
      ) : (
        /* Parsed Preview Card */
        <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between border-b border-[#E3E1D9] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#166534] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#242923]">Chat Export Verified</h4>
                <p className="text-xs text-[#7F8A7D]">
                  {file?.name} ({(file ? file.size / 1024 : 0).toFixed(1)} KB)
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPreviewData(null);
                setFileContent('');
              }}
              className="text-xs font-medium text-[#7F8A7D] hover:text-[#242923] transition-colors underline"
            >
              Choose different file
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#F7F6F0] p-3 rounded-lg border border-[#E3E1D9]">
              <div className="flex items-center gap-1.5 text-xs text-[#5A6559] mb-1">
                <Users className="w-3.5 h-3.5 text-[#718B65]" />
                <span>Participants ({previewData.participants.length})</span>
              </div>
              <p className="text-sm font-bold text-[#242923] truncate">
                {previewData.participants.join(', ')}
              </p>
            </div>

            <div className="bg-[#F7F6F0] p-3 rounded-lg border border-[#E3E1D9]">
              <div className="flex items-center gap-1.5 text-xs text-[#5A6559] mb-1">
                <FileText className="w-3.5 h-3.5 text-[#718B65]" />
                <span>Total Messages</span>
              </div>
              <p className="text-sm font-bold text-[#242923]">
                {previewData.totalMessages.toLocaleString()}
              </p>
            </div>

            <div className="bg-[#F7F6F0] p-3 rounded-lg border border-[#E3E1D9] col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-[#5A6559] mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#718B65]" />
                <span>Format</span>
              </div>
              <p className="text-sm font-bold text-[#242923] uppercase">
                {previewData.formatDetected.replace('whatsapp_', '')}
              </p>
            </div>
          </div>

          {/* Sample Snippet */}
          {previewData.previewExcerpts.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#5A6559] uppercase tracking-wider">
                Excerpts Preview
              </span>
              <div className="bg-[#F7F6F0] rounded-lg p-3 text-xs space-y-1.5 max-h-32 overflow-y-auto border border-[#E3E1D9]">
                {previewData.previewExcerpts.map((ex, i) => (
                  <div key={i} className="flex gap-2 text-[#242923]">
                    <span className="font-semibold text-[#304A34] min-w-[70px] truncate">{ex.sender}:</span>
                    <span className="text-[#5A6559] truncate">{ex.content}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleTriggerAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3.5 px-4 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-xs"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing communication dynamics with AI...
              </>
            ) : (
              <>
                Start Analysis & Generate Report
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}
    </div>
  );
};
