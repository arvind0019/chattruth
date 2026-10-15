import { ChatStatistics } from './chat';

export type AnalysisCategory = 'relationship' | 'friends' | 'family' | 'general';
export type ConfidenceLevel = 'high' | 'moderate' | 'tentative';
export type ReportStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface SupportingQuote {
  quote: string;
  sender?: string;
  approxDate?: string;
  contextNote?: string;
  verifiedInSource: boolean; // Must be verified by application logic against real text
}

export interface FindingItem {
  id: string;
  title: string;
  categoryTag: 'communication' | 'tone' | 'engagement' | 'conflict_resolution' | 'affection' | 'boundary';
  observation: string;
  supportingEvidence: SupportingQuote[];
  confidence: ConfidenceLevel;
  alternativeExplanation: string;
}

export interface CommunicationPattern {
  id: string;
  name: string;
  description: string;
  type: 'positive' | 'neutral' | 'friction';
  frequency: string;
  exampleQuotes: string[];
}

export interface PracticalSuggestion {
  id: string;
  title: string;
  suggestion: string;
  whyItHelps: string;
  targetAudience?: string;
}

export interface ConflictAccountability {
  participantName: string;
  whatTheyDidWrong: string; // Kahan inki galti thi
  whatTheyDidRight: string; // Kahan inki baat sahi thi
  underlyingIntent: string; // Dil me kya tha (underlying need/feeling)
  faultPercentage: number; // Approximate responsibility share (0-100%)
}

export interface SuggestedReplyScript {
  forParticipant: string;
  messageText: string; // Ready-to-copy WhatsApp reply in natural Hinglish/English
  intentGoal: string; // Why this works to de-escalate tension
}

export interface WhoIsWrongInfo {
  name: string; // Name of person primarily in the wrong (or "Both / Mutual")
  summary: string; // One sentence direct verdict
  reasons: string[]; // Specific key mistakes
  severity?: 'major' | 'moderate' | 'minor';
}

export interface WhoIsRightInfo {
  name: string; // Name of person whose stance was justified
  summary: string; // One sentence direct verdict
  reasons: string[]; // Specific justified behaviors
}

export interface ConflictVerdict {
  detectedIssue: string; // Mudda / Conflict summary
  triggeredBy?: string; // Who triggered or escalated the friction
  verdictRuling: string; // Direct bold verdict: e.g. "Rahul is primarily in the wrong, while Priya was justified."
  whoIsWrong?: WhoIsWrongInfo; // Explicit breakdown of who is in the wrong
  whoIsRight?: WhoIsRightInfo; // Explicit breakdown of who is in the right
  accountability: ConflictAccountability[];
  fairVerdict: string; // Direct, honest reality check of "Kon galat hai, kon sahi hai aur reality kya hai"
  suggestedReplies: SuggestedReplyScript[];
}

export interface AnalysisReport {
  id: string;
  userId?: string;
  title: string;
  category: AnalysisCategory;
  conciseSummary: string;
  apparentTone: string;
  verifiedStatistics: ChatStatistics;
  conflictVerdict?: ConflictVerdict; // Detailed honest breakdown of "Kon galat hai, kon sahi hai"
  keyFindings: FindingItem[];
  communicationPatterns: CommunicationPattern[];
  positiveObservations: string[];
  potentialFrictionPoints: string[];
  practicalSuggestions: PracticalSuggestion[];
  confidenceLevel: ConfidenceLevel;
  limitationsAndUncertainty: string[];
  isPaid: boolean;
  status: ReportStatus;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  analyzedMessagesCount: number;
  totalOriginalMessagesCount: number;
  dateRangeAnalyzed?: {
    start: string | null;
    end: string | null;
  };
}

export interface ReportPreview {
  id: string;
  title: string;
  category: AnalysisCategory;
  conciseSummary: string;
  apparentTone: string;
  previewStatistics: {
    totalMessages: number;
    participants: { name: string; percentage: number; messageCount: number }[];
    startDate: string | null;
    endDate: string | null;
    durationDays: number;
    participationBalance: number;
  };
  sampleFindings: FindingItem[]; // 2 sample findings with verified excerpts
  conflictVerdict?: ConflictVerdict;
  lockedFindingsCount: number;
  lockedPatternsCount: number;
  lockedSuggestionsCount: number;
  positiveTeaser: string;
  frictionTeaser: string;
  confidenceLevel: ConfidenceLevel;
  isPaid: boolean;
  status: ReportStatus;
  createdAt: string;
}
