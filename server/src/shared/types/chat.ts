export interface ChatMessage {
  id: string;
  sender: string;
  timestamp: string | null; // ISO string if parsed, null if timestamp missing
  timestampRaw?: string;
  content: string;
  isSystemNotification: boolean;
  rawText: string;
  lineIndex: number;
}

export interface ParsedChat {
  messages: ChatMessage[];
  participants: string[];
  startDate: string | null;
  endDate: string | null;
  totalMessages: number;
  systemMessageCount: number;
  formatDetected: 'whatsapp_ios' | 'whatsapp_android' | 'whatsapp_standard' | 'generic';
  parsingErrors: string[];
  warnings: string[];
}

export interface ParticipantStats {
  name: string;
  messageCount: number;
  percentage: number;
  wordCount: number;
  avgWordsPerMessage: number;
  charactersCount: number;
  conversationsInitiated: number;
  avgReplyTimeMinutes: number | null;
  medianReplyTimeMinutes: number | null;
  longestMonologueCount: number;
}

export interface HourlyDistribution {
  hour: number; // 0-23
  count: number;
  percentage: number;
}

export interface DailyDistribution {
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  dayName: string;
  count: number;
}

export interface WeeklyTrend {
  weekLabel: string;
  count: number;
}

export interface TopWord {
  word: string;
  count: number;
}

export interface ChatStatistics {
  totalMessages: number;
  totalWords: number;
  participants: ParticipantStats[];
  startDate: string | null;
  endDate: string | null;
  durationDays: number;
  messagesPerDay: number;
  hourlyDistribution: HourlyDistribution[];
  dailyDistribution: DailyDistribution[];
  weeklyTrends: WeeklyTrend[];
  participationBalance: number; // 0.0 to 1.0 (1.0 = perfectly balanced)
  topKeywords: TopWord[];
  conversationStarters: { name: string; count: number; ratio: number }[];
  replyTimeDistributions: { name: string; avgMinutes: number | null; medianMinutes: number | null }[];
  isTimestampReliable: boolean;
}
