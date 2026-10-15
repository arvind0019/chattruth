import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { AnalysisReport, ReportPreview } from '../shared/types/report';
import { ReportStatsSummary } from '../components/reports/ReportStatsSummary';
import { FindingsList } from '../components/reports/FindingsList';
import { PatternsSection } from '../components/reports/PatternsSection';
import { SuggestionsList } from '../components/reports/SuggestionsList';
import { HourlyChart } from '../components/charts/HourlyChart';
import { PaywallModal } from '../components/reports/PaywallModal';
import { ConflictVerdictCard } from '../components/reports/ConflictVerdictCard';
import { Loader2, AlertCircle, Lock, CheckCircle2, ShieldCheck, Trash2, ArrowLeft, Sparkles } from 'lucide-react';

export const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [preview, setPreview] = useState<ReportPreview | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleInstantUnlock = async () => {
    if (!id) return;
    try {
      await apiRequest(`/reports/${id}/unlock`, { method: 'POST' });
      await fetchReport();
    } catch (err: any) {
      alert(err.message || 'Failed to unlock report');
    }
  };

  const fetchReport = async () => {
    if (!id) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await apiRequest<{ report?: AnalysisReport; preview?: ReportPreview; isPaid?: boolean }>(
        `/reports/${id}`
      );

      if (data.report) {
        setReport(data.report);
        setIsPaid(data.report.isPaid);
      } else if (data.preview) {
        setPreview(data.preview);
        setIsPaid(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this report? This will permanently erase it.')) {
      return;
    }

    setDeleting(true);
    try {
      await apiRequest(`/reports/${id}`, { method: 'DELETE' });
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to delete report.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#304A34]" />
        <p className="text-xs text-[#5A6559]">Loading report data...</p>
      </div>
    );
  }

  if (errorMsg || (!report && !preview)) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#242923]">Report Not Found</h3>
        <p className="text-xs text-[#5A6559]">{errorMsg || 'This report may have been deleted.'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-lg bg-[#304A34] text-[#FFFEFA] text-xs font-semibold hover:bg-[#263B29] transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const title = report?.title || preview?.title || 'Conversation Report';
  const category = report?.category || preview?.category || 'general';
  const summary = report?.conciseSummary || preview?.conciseSummary || '';

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Top Navigation Row */}
      <div className="flex justify-between items-center text-xs text-[#5A6559]">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 hover:text-[#242923] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 text-[#991B1B] hover:text-[#7F1D1D] font-medium transition-colors p-1.5 rounded-md hover:bg-[#FEE2E2]"
        >
          <Trash2 className="w-4 h-4" /> Delete Report
        </button>
      </div>

      {/* Free Preview Banner if unpaid */}
      {!isPaid && (
        <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#92400E]">
              <Lock className="w-3.5 h-3.5" />
              Free Preview Mode
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#242923]">
              Basic verified statistics unlocked
            </h2>
            <p className="text-xs text-[#5A6559] max-w-lg leading-relaxed">
              Unlock the comprehensive report to reveal all key findings, verbatim supporting excerpts, 24-hour activity heatmaps, and tailored communication suggestions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleInstantUnlock}
              className="px-4 py-3.5 rounded-xl bg-[#EDF3EB] hover:bg-[#DCE7DA] text-[#304A34] font-bold text-xs whitespace-nowrap transition-colors"
            >
              Instant Free Unlock (Dev)
            </button>
            <button
              onClick={() => setPaywallOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] font-semibold text-xs whitespace-nowrap shadow-xs transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#A3B899]" />
              Unlock Full Report
            </button>
          </div>
        </div>
      )}

      {/* Report Header */}
      <div className="space-y-4 border-b border-[#E3E1D9] pb-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F6F0] text-[#5A6559] border border-[#E3E1D9] uppercase tracking-wider">
            {category}
          </span>
          {isPaid ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Full Report Unlocked
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309] flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Free Preview
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242923] editorial-title">
          {title}
        </h1>

        <div className="bg-[#FFFEFA] rounded-xl border border-[#E3E1D9] p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#5A6559] uppercase tracking-wider block mb-1">
            Executive Summary
          </span>
          <p className="text-sm text-[#242923] leading-relaxed">{summary}</p>
        </div>
      </div>

      {/* Conflict & Accountability Verdict Card ("Kon Galat Hai, Kon Sahi Hai") */}
      {(report?.conflictVerdict || preview?.conflictVerdict) && (
        <ConflictVerdictCard verdict={report?.conflictVerdict || preview!.conflictVerdict!} />
      )}

      {/* Statistics Section */}
      {report?.verifiedStatistics && (
        <ReportStatsSummary statistics={report.verifiedStatistics} />
      )}

      {/* Time-of-day Chart (Full report only) */}
      {isPaid && report?.verifiedStatistics?.hourlyDistribution && (
        <HourlyChart distribution={report.verifiedStatistics.hourlyDistribution} />
      )}

      {/* Key Findings List */}
      {isPaid && report?.keyFindings && (
        <FindingsList findings={report.keyFindings} />
      )}

      {/* Preview Sample Findings if unpaid */}
      {!isPaid && preview?.sampleFindings && (
        <FindingsList
          findings={preview.sampleFindings}
          lockedCount={preview.lockedFindingsCount}
          onUnlockClick={() => setPaywallOpen(true)}
        />
      )}

      {/* Patterns & Positive Observations (Full Report) */}
      {isPaid && report && (
        <PatternsSection
          patterns={report.communicationPatterns || []}
          positiveObservations={report.positiveObservations || []}
          potentialFrictionPoints={report.potentialFrictionPoints || []}
        />
      )}

      {/* Practical Suggestions (Full Report) */}
      {isPaid && report?.practicalSuggestions && (
        <SuggestionsList suggestions={report.practicalSuggestions} />
      )}

      {/* Ethical AI & Limitations Disclaimer */}
      <div className="bg-[#FFFEFA] rounded-xl border border-[#E3E1D9] p-6 space-y-3 text-xs text-[#5A6559]">
        <div className="flex items-center gap-2 font-bold text-[#242923]">
          <ShieldCheck className="w-4 h-4 text-[#718B65]" />
          <span>Ethical AI & Limitations Disclaimer</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[#7F8A7D]">
          <li>Text messages lack vocal inflection, eye contact, and in-person emotional warmth.</li>
          <li>Analysis is strictly bounded to the uploaded chat export and cannot account for context outside this conversation.</li>
          <li>ChatTruth is designed for constructive personal insight and does not constitute psychological diagnosis or forensic proof.</li>
        </ul>
      </div>

      {/* Checkout Paywall Modal */}
      {id && (
        <PaywallModal
          reportId={id}
          isOpen={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          onPaymentSuccess={() => {
            fetchReport();
          }}
        />
      )}
    </div>
  );
};
