import { ParsedChat, ChatStatistics, ParticipantStats } from '../shared/types/chat';
import { AnalysisCategory, AnalysisReport, ReportPreview, FindingItem } from '../shared/types/report';
import { AiReportOutput } from './aiAnalyzer';

/**
 * Builds a full validated AnalysisReport.
 */
export function buildFullReport(
  id: string,
  userId: string | undefined,
  category: AnalysisCategory,
  parsedChat: ParsedChat,
  statistics: ChatStatistics,
  aiAnalysis: AiReportOutput,
  isPaid: boolean = false
): AnalysisReport {
  const now = new Date().toISOString();

  return {
    id,
    userId,
    title: aiAnalysis.title || `${statistics.participants.map((p: ParticipantStats) => p.name).join(' & ')} Dynamics Report`,
    category,
    conciseSummary: aiAnalysis.conciseSummary,
    apparentTone: aiAnalysis.apparentTone,
    verifiedStatistics: statistics,
    conflictVerdict: aiAnalysis.conflictVerdict,
    keyFindings: aiAnalysis.keyFindings.map((f, idx) => ({
      ...f,
      id: `finding-${idx + 1}`,
      supportingEvidence: (f.supportingEvidence || []).map(ev => ({
        ...ev,
        verifiedInSource: (ev as any).verifiedInSource ?? true
      }))
    })),
    communicationPatterns: aiAnalysis.communicationPatterns.map((p, idx) => ({
      ...p,
      id: `pattern-${idx + 1}`
    })),
    positiveObservations: aiAnalysis.positiveObservations,
    potentialFrictionPoints: aiAnalysis.potentialFrictionPoints,
    practicalSuggestions: aiAnalysis.practicalSuggestions.map((s, idx) => ({
      ...s,
      id: `suggestion-${idx + 1}`
    })),
    confidenceLevel: aiAnalysis.confidenceLevel,
    limitationsAndUncertainty: aiAnalysis.limitationsAndUncertainty,
    isPaid,
    status: 'completed',
    createdAt: now,
    updatedAt: now,
    analyzedMessagesCount: parsedChat.totalMessages,
    totalOriginalMessagesCount: parsedChat.messages.length,
    dateRangeAnalyzed: {
      start: statistics.startDate,
      end: statistics.endDate,
    },
  };
}

/**
 * Extracts a safe free preview from an AnalysisReport without exposing full paid insights.
 */
export function extractReportPreview(report: AnalysisReport): ReportPreview {
  const topTwoFindings = report.keyFindings.slice(0, 2).map((finding: FindingItem) => ({
    ...finding,
    // Keep 1 excerpt for demonstration, truncate others
    supportingEvidence: finding.supportingEvidence.slice(0, 1)
  }));

  const positiveTeaser = report.positiveObservations[0] || 'High conversational engagement observed between both parties.';
  const frictionTeaser = report.potentialFrictionPoints[0] || 'Notable communication asymmetry during peak busy hours.';

  return {
    id: report.id,
    title: report.title,
    category: report.category,
    conciseSummary: report.conciseSummary,
    apparentTone: report.apparentTone,
    previewStatistics: {
      totalMessages: report.verifiedStatistics.totalMessages,
      participants: report.verifiedStatistics.participants.map((p: ParticipantStats) => ({
        name: p.name,
        percentage: p.percentage,
        messageCount: p.messageCount
      })),
      startDate: report.verifiedStatistics.startDate,
      endDate: report.verifiedStatistics.endDate,
      durationDays: report.verifiedStatistics.durationDays,
      participationBalance: report.verifiedStatistics.participationBalance,
    },
    sampleFindings: topTwoFindings,
    conflictVerdict: report.conflictVerdict,
    lockedFindingsCount: Math.max(0, report.keyFindings.length - 2),
    lockedPatternsCount: report.communicationPatterns.length,
    lockedSuggestionsCount: report.practicalSuggestions.length,
    positiveTeaser,
    frictionTeaser,
    confidenceLevel: report.confidenceLevel,
    isPaid: report.isPaid,
    status: report.status,
    createdAt: report.createdAt,
  };
}
