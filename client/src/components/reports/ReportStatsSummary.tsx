import React from 'react';
import { ChatStatistics } from '../../shared/types/chat';
import { MessageSquare, Clock, Zap, Users } from 'lucide-react';

interface ReportStatsSummaryProps {
  statistics: ChatStatistics;
}

export const ReportStatsSummary: React.FC<ReportStatsSummaryProps> = ({ statistics }) => {
  const {
    totalMessages,
    participants,
    participationBalance,
    durationDays,
    messagesPerDay,
    startDate,
    endDate,
  } = statistics;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-6 lg:p-8 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#E3E1D9] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[#242923]">Verified Conversation Metrics</h3>
          <p className="text-xs text-[#7F8A7D]">
            Objectively calculated from message headers and timestamps
          </p>
        </div>
        <div className="text-xs font-medium text-[#5A6559] bg-[#F7F6F0] px-3 py-1.5 rounded-lg border border-[#E3E1D9] inline-flex items-center gap-1.5">
          <span>Timespan:</span>
          <span className="font-semibold text-[#242923]">
            {formatDate(startDate)} – {formatDate(endDate)} ({durationDays} days)
          </span>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#F7F6F0] p-4 rounded-xl border border-[#E3E1D9]">
          <div className="flex items-center gap-2 text-xs text-[#5A6559] mb-1">
            <MessageSquare className="w-3.5 h-3.5 text-[#718B65]" />
            <span>Total Messages</span>
          </div>
          <p className="text-2xl font-bold text-[#242923]">{totalMessages.toLocaleString()}</p>
          <span className="text-[11px] text-[#7F8A7D]">{messagesPerDay} messages / day</span>
        </div>

        <div className="bg-[#F7F6F0] p-4 rounded-xl border border-[#E3E1D9]">
          <div className="flex items-center gap-2 text-xs text-[#5A6559] mb-1">
            <Zap className="w-3.5 h-3.5 text-[#718B65]" />
            <span>Balance Index</span>
          </div>
          <p className="text-2xl font-bold text-[#242923]">
            {(participationBalance * 100).toFixed(0)}%
          </p>
          <span className="text-[11px] text-[#7F8A7D]">
            {participationBalance >= 0.8 ? 'Equally balanced' : 'Moderate asymmetry'}
          </span>
        </div>

        <div className="bg-[#F7F6F0] p-4 rounded-xl border border-[#E3E1D9]">
          <div className="flex items-center gap-2 text-xs text-[#5A6559] mb-1">
            <Users className="w-3.5 h-3.5 text-[#718B65]" />
            <span>Active Members</span>
          </div>
          <p className="text-2xl font-bold text-[#242923]">{participants.length}</p>
          <span className="text-[11px] text-[#7F8A7D]">Verified in conversation</span>
        </div>

        <div className="bg-[#F7F6F0] p-4 rounded-xl border border-[#E3E1D9]">
          <div className="flex items-center gap-2 text-xs text-[#5A6559] mb-1">
            <Clock className="w-3.5 h-3.5 text-[#718B65]" />
            <span>Reply Pacing</span>
          </div>
          <p className="text-2xl font-bold text-[#242923]">
            {participants[0]?.medianReplyTimeMinutes != null
              ? `${participants[0].medianReplyTimeMinutes}m`
              : 'N/A'}
          </p>
          <span className="text-[11px] text-[#7F8A7D]">Median reply interval</span>
        </div>
      </div>

      {/* Participation Share Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center text-xs font-semibold text-[#5A6559]">
          <span>Participation Distribution</span>
          <span className="text-[#7F8A7D]">By total volume</span>
        </div>

        {/* Stacked Bar */}
        <div className="h-4 w-full bg-[#E3E1D9] rounded-full overflow-hidden flex shadow-inner">
          {participants.map((p, idx) => (
            <div
              key={p.name}
              style={{ width: `${p.percentage}%` }}
              className={`h-full ${
                idx === 0
                  ? 'bg-[#304A34]'
                  : idx === 1
                  ? 'bg-[#718B65]'
                  : 'bg-[#A3B899]'
              }`}
              title={`${p.name}: ${p.percentage}% (${p.messageCount} messages)`}
            />
          ))}
        </div>

        {/* Participant breakdown items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {participants.map((p, idx) => (
            <div
              key={p.name}
              className="flex items-center justify-between p-3 rounded-lg border border-[#E3E1D9] bg-[#F7F6F0]"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-3 h-3 rounded-full ${
                    idx === 0 ? 'bg-[#304A34]' : 'bg-[#718B65]'
                  }`}
                />
                <span className="text-sm font-semibold text-[#242923]">{p.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#242923]">{p.percentage}%</span>
                <span className="text-xs text-[#7F8A7D] ml-2">({p.messageCount} msgs)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
