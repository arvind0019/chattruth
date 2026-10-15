import React, { useState } from 'react';
import { FindingItem } from '../../shared/types/report';
import { Quote, CheckCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FindingsListProps {
  findings: FindingItem[];
  lockedCount?: number;
  onUnlockClick?: () => void;
}

export const FindingsList: React.FC<FindingsListProps> = ({
  findings,
  lockedCount = 0,
  onUnlockClick,
}) => {
  const [expandedAlternatives, setExpandedAlternatives] = useState<Record<string, boolean>>({});

  const toggleAlternative = (id: string) => {
    setExpandedAlternatives(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getConfidenceBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#DCFCE7] text-[#166534]">High Confidence</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#EDF3EB] text-[#304A34]">Moderate Confidence</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#FEF3C7] text-[#B45309]">Tentative Context</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-[#E3E1D9] pb-4">
        <div>
          <h3 className="text-xl font-bold text-[#242923]">Observed Dynamics & Evidence</h3>
          <p className="text-sm text-[#7F8A7D]">
            Grounding findings in actual conversational excerpts with plausible alternative explanations
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {findings.map((finding) => (
          <div
            key={finding.id}
            className="bg-[#FFFEFA] rounded-xl border border-[#E3E1D9] p-6 shadow-xs space-y-4"
          >
            {/* Header: Title + Tag + Confidence */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#304A34] shrink-0" />
                <h4 className="text-base font-bold text-[#242923] break-words">{finding.title}</h4>
                <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#F7F6F0] text-[#5A6559] border border-[#E3E1D9] shrink-0">
                  {finding.categoryTag}
                </span>
              </div>
              <div className="shrink-0">{getConfidenceBadge(finding.confidence)}</div>
            </div>

            {/* Observation Body */}
            <p className="text-sm text-[#242923] leading-relaxed">
              {finding.observation}
            </p>

            {/* Supporting Quotes / Excerpts */}
            {finding.supportingEvidence && finding.supportingEvidence.length > 0 && (
              <div className="bg-[#F7F6F0] rounded-lg p-3.5 border border-[#E3E1D9] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5A6559]">
                  <Quote className="w-3.5 h-3.5 text-[#718B65]" />
                  <span>Verified Excerpts From Chat</span>
                </div>
                {finding.supportingEvidence.map((ev, idx) => (
                  <div key={idx} className="text-xs pl-3 border-l-2 border-[#718B65] space-y-0.5">
                    <p className="italic text-[#242923]">"{ev.quote}"</p>
                    <div className="flex items-center gap-2 text-[11px] text-[#7F8A7D]">
                      {ev.sender && <span className="font-medium text-[#304A34]">— {ev.sender}</span>}
                      {ev.verifiedInSource && (
                        <span className="inline-flex items-center gap-1 text-[#166534]">
                          <CheckCircle className="w-3 h-3" /> Verified in source
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Alternative Explanation Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleAlternative(finding.id)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#718B65] hover:text-[#304A34] transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Plausible alternative interpretation</span>
                {expandedAlternatives[finding.id] ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {expandedAlternatives[finding.id] && (
                <div className="mt-2.5 p-3 rounded-lg bg-[#EDF3EB] border border-[#DCE8D6] text-xs text-[#304A34] leading-relaxed">
                  <strong>Alternative Context:</strong> {finding.alternativeExplanation}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Locked Preview Teaser Card if Unpaid */}
        {lockedCount > 0 && (
          <div className="relative bg-[#FFFEFA] rounded-xl border border-dashed border-[#E3E1D9] p-8 text-center space-y-3">
            <div className="absolute inset-0 bg-[#FFFEFA]/60 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center p-6">
              <h4 className="text-base font-bold text-[#242923] mb-1">
                Unlock {lockedCount} Additional Key Findings
              </h4>
              <p className="text-xs text-[#5A6559] max-w-md mb-4">
                Access deep topic transition analysis, friction root causes, complete pattern charts, and tailored communication suggestions.
              </p>
              {onUnlockClick && (
                <button
                  type="button"
                  onClick={onUnlockClick}
                  className="px-5 py-2.5 rounded-lg bg-[#304A34] hover:bg-[#263B29] text-[#FFFEFA] text-xs font-semibold shadow-xs transition-colors"
                >
                  Unlock Full Report
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
