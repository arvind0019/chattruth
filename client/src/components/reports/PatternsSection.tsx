import React from 'react';
import { CommunicationPattern } from '../../shared/types/report';
import { Sparkles, AlertTriangle, Activity } from 'lucide-react';

interface PatternsSectionProps {
  patterns: CommunicationPattern[];
  positiveObservations: string[];
  potentialFrictionPoints: string[];
}

export const PatternsSection: React.FC<PatternsSectionProps> = ({
  patterns,
  positiveObservations,
  potentialFrictionPoints,
}) => {
  return (
    <div className="space-y-8">
      {/* Positive Observations & Friction Points Two-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Observations Card */}
        <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#166534] border-b border-[#E3E1D9] pb-3">
            <Sparkles className="w-5 h-5 text-[#166534]" />
            <h4 className="text-base font-bold text-[#242923]">Positive Patterns Observed</h4>
          </div>
          <ul className="space-y-2.5">
            {positiveObservations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#242923] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#166534] shrink-0 mt-1.5" />
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Potential Friction Points Card */}
        <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#B45309] border-b border-[#E3E1D9] pb-3">
            <AlertTriangle className="w-5 h-5 text-[#B45309]" />
            <h4 className="text-base font-bold text-[#242923]">Potential Friction Signals</h4>
          </div>
          <ul className="space-y-2.5">
            {potentialFrictionPoints.map((fric, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#242923] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] shrink-0 mt-1.5" />
                <span>{fric}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Identified Communication Patterns */}
      <div className="space-y-4">
        <div className="border-b border-[#E3E1D9] pb-3">
          <h4 className="text-base font-bold text-[#242923] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#718B65]" />
            Recurring Interaction Patterns
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {patterns.map((pat) => (
            <div
              key={pat.id}
              className="bg-[#FFFEFA] rounded-xl border border-[#E3E1D9] p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#242923]">{pat.name}</span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    pat.type === 'positive'
                      ? 'bg-[#DCFCE7] text-[#166534]'
                      : pat.type === 'friction'
                      ? 'bg-[#FEE2E2] text-[#991B1B]'
                      : 'bg-[#F7F6F0] text-[#5A6559]'
                  }`}
                >
                  {pat.frequency}
                </span>
              </div>
              <p className="text-xs text-[#5A6559] leading-relaxed">{pat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
