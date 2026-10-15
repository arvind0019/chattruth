import React from 'react';
import { PracticalSuggestion } from '../../shared/types/report';
import { Compass, Lightbulb } from 'lucide-react';

interface SuggestionsListProps {
  suggestions: PracticalSuggestion[];
}

export const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#E3E1D9] pb-4">
        <h3 className="text-xl font-bold text-[#242923] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#304A34]" />
          Practical Suggestions
        </h3>
        <p className="text-sm text-[#7F8A7D]">
          Actionable, non-judgmental habits to enhance mutual understanding
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((sug) => (
          <div
            key={sug.id}
            className="bg-[#FFFEFA] rounded-xl border border-[#E3E1D9] p-5 space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#718B65] shrink-0" />
                <h4 className="text-sm font-bold text-[#242923]">{sug.title}</h4>
              </div>
              {sug.targetAudience && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EDF3EB] text-[#304A34]">
                  {sug.targetAudience}
                </span>
              )}
            </div>

            <p className="text-xs text-[#242923] leading-relaxed">
              {sug.suggestion}
            </p>

            <div className="pt-2 border-t border-[#E3E1D9] text-xs text-[#5A6559]">
              <strong className="text-[#304A34]">Why it helps:</strong> {sug.whyItHelps}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
