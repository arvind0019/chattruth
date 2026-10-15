import React, { useState } from 'react';
import { Scale, AlertTriangle, CheckCircle2, HeartHandshake, Copy, Check, MessageSquare, Flame, XCircle, ShieldCheck } from 'lucide-react';
import { ConflictVerdict } from '../../shared/types/report';

interface ConflictVerdictCardProps {
  verdict: ConflictVerdict;
}

export const ConflictVerdictCard: React.FC<ConflictVerdictCardProps> = ({ verdict }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const p1 = verdict.accountability[0];
  const p2 = verdict.accountability[1];

  return (
    <div className="bg-[#FFFEFA] rounded-2xl border-2 border-[#E3E1D9] p-6 sm:p-8 space-y-7 shadow-sm overflow-hidden relative">
      {/* Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#DC2626] via-[#D97706] to-[#16A34A]" />

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E3E1D9] pb-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0 shadow-xs">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#92400E]">
                Relationship Reality Check
              </span>
              <span className="text-xs text-[#7F8A7D]">Kon Galat Hai, Kon Sahi Hai?</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#242923] mt-1">
              Who is Wrong & Who is Right? (Faisla)
            </h2>
          </div>
        </div>

        {verdict.triggeredBy && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold self-start md:self-auto">
            <Flame className="w-4 h-4" />
            <span>Friction Escalated By: <strong>{verdict.triggeredBy}</strong></span>
          </div>
        )}
      </div>

      {/* Direct Ruling Banner */}
      {verdict.verdictRuling && (
        <div className="bg-[#FFFBEB] border-2 border-[#F59E0B] rounded-2xl p-5 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0 font-extrabold text-lg">
            ⚖️
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#B45309] block">
              Direct AI Ruling • Final Faisla
            </span>
            <p className="text-base sm:text-lg font-extrabold text-[#242923] leading-snug">
              {verdict.verdictRuling}
            </p>
          </div>
        </div>
      )}

      {/* Side-by-Side: Kon Galat Tha (Wrong) vs Kon Sahi Tha (Right) */}
      {(verdict.whoIsWrong || verdict.whoIsRight) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Who is Wrong Card */}
          {verdict.whoIsWrong && (
            <div className="bg-[#FEF2F2] border-2 border-[#FCA5A5] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#FECACA] pb-2.5">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-[#DC2626]" />
                  <span className="text-sm font-extrabold text-[#991B1B]">
                    GALAT KAUN THA: {verdict.whoIsWrong.name}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]">
                  Primary Fault
                </span>
              </div>
              <p className="text-xs font-semibold text-[#7F1D1D] leading-relaxed">
                {verdict.whoIsWrong.summary}
              </p>
              {verdict.whoIsWrong.reasons && verdict.whoIsWrong.reasons.length > 0 && (
                <ul className="space-y-1.5 pt-1">
                  {verdict.whoIsWrong.reasons.map((r, rIdx) => (
                    <li key={rIdx} className="text-xs text-[#991B1B] flex items-start gap-1.5">
                      <span className="font-bold shrink-0">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Who is Right Card */}
          {verdict.whoIsRight && (
            <div className="bg-[#F0FDF4] border-2 border-[#86EFAC] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#BBF7D0] pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                  <span className="text-sm font-extrabold text-[#166534]">
                    SAHI KAUN THA: {verdict.whoIsRight.name}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]">
                  Justified Stance
                </span>
              </div>
              <p className="text-xs font-semibold text-[#14532D] leading-relaxed">
                {verdict.whoIsRight.summary}
              </p>
              {verdict.whoIsRight.reasons && verdict.whoIsRight.reasons.length > 0 && (
                <ul className="space-y-1.5 pt-1">
                  {verdict.whoIsRight.reasons.map((r, rIdx) => (
                    <li key={rIdx} className="text-xs text-[#166534] flex items-start gap-1.5">
                      <span className="font-bold shrink-0">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Issue Trigger Banner */}
      <div className="bg-[#F7F6F0] rounded-xl p-4 border border-[#E3E1D9] flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-[#5A6559] uppercase tracking-wide block mb-0.5">
            Asli Mudda / Root Trigger
          </span>
          <p className="text-sm font-medium text-[#242923] leading-relaxed">
            {verdict.detectedIssue}
          </p>
        </div>
      </div>

      {/* Responsibility / Fault Split Visualizer */}
      {p1 && p2 && (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-2 text-xs font-bold">
            <span className="text-[#991B1B] break-words">
              {p1.participantName} ({p1.faultPercentage}% Responsibility)
            </span>
            <span className="text-[#166534] break-words">
              {p2.participantName} ({p2.faultPercentage}% Responsibility)
            </span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden bg-[#E3E1D9] flex">
            <div
              className="bg-[#EF4444] h-full transition-all duration-500"
              style={{ width: `${p1.faultPercentage}%` }}
              title={`${p1.participantName}: ${p1.faultPercentage}%`}
            />
            <div
              className="bg-[#10B981] h-full transition-all duration-500"
              style={{ width: `${p2.faultPercentage}%` }}
              title={`${p2.participantName}: ${p2.faultPercentage}%`}
            />
          </div>
        </div>
      )}

      {/* Side-by-Side Detailed Accountability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {verdict.accountability.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-[#E3E1D9] bg-[#FFFEFA] p-5 space-y-4 hover:border-[#CBD5E1] transition-all shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-[#E3E1D9] pb-3">
              <h3 className="text-base font-bold text-[#242923]">
                {item.participantName}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  item.faultPercentage >= 50
                    ? 'bg-[#FEE2E2] text-[#991B1B]'
                    : 'bg-[#DCFCE7] text-[#166534]'
                }`}
              >
                {item.faultPercentage}% Fault Share
              </span>
            </div>

            {/* What they did wrong */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#991B1B]">
                <span>🔴 Kahan Inki Galti Thi (Mistakes)</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed pl-3 border-l-2 border-[#F87171]">
                {item.whatTheyDidWrong}
              </p>
            </div>

            {/* What they did right */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#166534]">
                <span>🟢 Kahan Inki Baat Sahi Thi (Valid Points)</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed pl-3 border-l-2 border-[#4ADE80]">
                {item.whatTheyDidRight}
              </p>
            </div>

            {/* Underlying Intent */}
            <div className="space-y-1 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
              <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wide block">
                💡 Dil Mein Kya Tha (Actual Need / Subtext)
              </span>
              <p className="text-xs text-[#334155] italic leading-relaxed">
                "{item.underlyingIntent}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* The Fair Honest Verdict Box */}
      <div className="bg-[#FFFBEB] rounded-xl border-2 border-[#FDE68A] p-5 sm:p-6 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#92400E] uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4 text-[#D97706]" />
          <span>The Ground Reality & In-Depth Explanation</span>
        </div>
        <p className="text-sm font-semibold text-[#78350F] leading-relaxed">
          {verdict.fairVerdict}
        </p>
      </div>

      {/* Suggested WhatsApp Reply Scripts */}
      {verdict.suggestedReplies && verdict.suggestedReplies.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#304A34]" />
            <h4 className="text-sm font-bold text-[#242923]">
              Abhi Kya Bhejna Chahiye? (Ready-to-Send WhatsApp Reply Scripts)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verdict.suggestedReplies.map((reply, rIdx) => (
              <div
                key={rIdx}
                className="bg-[#F7F6F0] rounded-xl border border-[#E3E1D9] p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#304A34] uppercase tracking-wide">
                      For {reply.forParticipant}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(reply.messageText, rIdx)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5A6559] hover:text-[#242923] bg-[#FFFEFA] border border-[#E3E1D9] px-2.5 py-1 rounded-md transition-all shadow-2xs"
                    >
                      {copiedIdx === rIdx ? (
                        <>
                          <Check className="w-3 h-3 text-[#166534]" />
                          <span className="text-[#166534]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Message Bubble */}
                  <div className="bg-[#E7F8E8] text-[#1E3A1E] text-xs p-3 rounded-lg border border-[#C6ECC7] font-sans leading-relaxed">
                    "{reply.messageText}"
                  </div>
                </div>

                <p className="text-[11px] text-[#7F8A7D]">
                  <strong className="text-[#5A6559]">Kyun kaam karega:</strong> {reply.intentGoal}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
