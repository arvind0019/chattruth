import { ChatMessage, ChatStatistics, DailyDistribution, HourlyDistribution, ParticipantStats, TopWord, WeeklyTrend } from '../shared/types/chat';

// Common English conversational stopwords to filter out for meaningful keywords
const STOPWORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'is', 'are', 'was', 'were', 'been', 'being', 'am', 'has', 'had', 'did', 'does',
  'yeah', 'yes', 'okay', 'ok', 'omg', 'lol', 'haha', 'hahaha', 'hey', 'hi', 'hello',
  'omitted', 'media', 'image', 'video', 'audio', 'sticker', 'gif', 'null', 'undefined',
  // Hinglish & Indian WhatsApp conversational stopwords
  'hai', 'hain', 'ho', 'hote', 'hoti', 'tha', 'thi', 'the', 'kya', 'kyu', 'kyun',
  'kaise', 'kahan', 'kab', 'kaun', 'mera', 'meri', 'mere', 'tera', 'teri', 'tere',
  'apna', 'apni', 'apne', 'aap', 'tum', 'hum', 'woh', 'yeh', 'ye', 'wo', 'unka',
  'uski', 'uska', 'iske', 'iski', 'iska', 'unhe', 'use', 'isse', 'aur', 'par',
  'lekin', 'magar', 'bhi', 'toh', 'kar', 'karo', 'karna', 'karte', 'karti',
  'kare', 'raha', 'rahi', 'rahe', 'gaya', 'gayi', 'gaye', 'jaise', 'aise', 'waise',
  'sab', 'kuch', 'koi', 'nahi', 'nhi', 'naa', 'haa', 'haan', 'han', 'hnn', 'acha',
  'accha', 'achha', 'theek', 'thik', 'thk', 'yaar', 'bhai', 'bro', 'sir', 'madam',
  'plz', 'pls', 'please', 'kk', 'hmm', 'hmmm', 'hmmmm', 'oye', 'arre', 'arey', 'bolo'
]);

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Calculates deterministic, verifiable metrics for a collection of chat messages.
 */
export function calculateChatStatistics(messages: ChatMessage[]): ChatStatistics {
  const userMessages = messages.filter(m => !m.isSystemNotification);
  const totalMessages = userMessages.length;

  if (totalMessages === 0) {
    return {
      totalMessages: 0,
      totalWords: 0,
      participants: [],
      startDate: null,
      endDate: null,
      durationDays: 0,
      messagesPerDay: 0,
      hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0, percentage: 0 })),
      dailyDistribution: DAYS_OF_WEEK.map((dayName, dayOfWeek) => ({ dayOfWeek, dayName, count: 0 })),
      weeklyTrends: [],
      participationBalance: 0,
      topKeywords: [],
      conversationStarters: [],
      replyTimeDistributions: [],
      isTimestampReliable: false,
    };
  }

  // 1. Participant stats aggregation
  const participantMap = new Map<string, {
    messageCount: number;
    wordCount: number;
    charactersCount: number;
    conversationsInitiated: number;
    replyDurationsMinutes: number[];
    currentStreak: number;
    longestMonologueCount: number;
  }>();

  let totalWords = 0;
  const wordFrequencyMap = new Map<string, number>();

  // Extract participants list
  userMessages.forEach(m => {
    if (!participantMap.has(m.sender)) {
      participantMap.set(m.sender, {
        messageCount: 0,
        wordCount: 0,
        charactersCount: 0,
        conversationsInitiated: 0,
        replyDurationsMinutes: [],
        currentStreak: 0,
        longestMonologueCount: 0,
      });
    }
  });

  // Track conversation initiation threshold (e.g., > 4 hours of silence starts a new conversation)
  const CONVERSATION_GAP_MS = 4 * 60 * 60 * 1000;
  let lastTimestamp: number | null = null;
  let lastSender: string | null = null;
  let validTimestampCount = 0;

  // Hourly and Daily frequency buckets
  const hourlyCounts = new Array(24).fill(0);
  const dailyCounts = new Array(7).fill(0);
  const weeklyMap = new Map<string, number>();

  // Monologue tracking
  let consecutiveSender: string | null = null;
  let currentMonologue = 0;

  for (let i = 0; i < userMessages.length; i++) {
    const msg = userMessages[i];
    const stats = participantMap.get(msg.sender)!;

    // Counts
    stats.messageCount++;
    stats.charactersCount += msg.content.length;

    // Words
    const words = msg.content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w: string) => w.length > 2);

    stats.wordCount += words.length;
    totalWords += words.length;

    // Word frequencies
    for (const w of words) {
      if (!STOPWORDS.has(w)) {
        wordFrequencyMap.set(w, (wordFrequencyMap.get(w) || 0) + 1);
      }
    }

    // Monologue check
    if (msg.sender === consecutiveSender) {
      currentMonologue++;
      if (currentMonologue > stats.longestMonologueCount) {
        stats.longestMonologueCount = currentMonologue;
      }
    } else {
      consecutiveSender = msg.sender;
      currentMonologue = 1;
      if (stats.longestMonologueCount === 0) {
        stats.longestMonologueCount = 1;
      }
    }

    // Timestamps
    if (msg.timestamp) {
      const msgDate = new Date(msg.timestamp);
      const currentTimeMs = msgDate.getTime();

      if (!isNaN(currentTimeMs)) {
        validTimestampCount++;

        // Hourly (0-23)
        const hour = msgDate.getUTCHours();
        hourlyCounts[hour]++;

        // Daily (0-6)
        const day = msgDate.getUTCDay();
        dailyCounts[day]++;

        // Weekly (YYYY-Www)
        const year = msgDate.getUTCFullYear();
        const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
        const pastDaysOfYear = (currentTimeMs - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7);
        const weekLabel = `${year}-W${String(weekNum).padStart(2, '0')}`;
        weeklyMap.set(weekLabel, (weeklyMap.get(weekLabel) || 0) + 1);

        // Conversation initiation & response times
        if (lastTimestamp === null || (currentTimeMs - lastTimestamp) >= CONVERSATION_GAP_MS) {
          stats.conversationsInitiated++;
        } else if (lastSender && lastSender !== msg.sender) {
          // Direct reply from another participant
          const diffMinutes = Math.round((currentTimeMs - lastTimestamp) / (60 * 1000));
          // Filter out unreasonable intervals (e.g. 0 to 240 minutes)
          if (diffMinutes >= 0 && diffMinutes <= 240) {
            stats.replyDurationsMinutes.push(diffMinutes);
          }
        }

        lastTimestamp = currentTimeMs;
        lastSender = msg.sender;
      }
    } else {
      // If no timestamp, first message initiates
      if (i === 0) {
        stats.conversationsInitiated++;
      }
    }
  }

  // Participation balance (Gini / Shannon entropy normalized for participants)
  const participantList = Array.from(participantMap.entries()).map(([name, data]) => {
    const percentage = totalMessages > 0 ? Math.round((data.messageCount / totalMessages) * 1000) / 10 : 0;
    const avgWords = data.messageCount > 0 ? Math.round((data.wordCount / data.messageCount) * 10) / 10 : 0;

    let avgReply: number | null = null;
    let medianReply: number | null = null;

    if (data.replyDurationsMinutes.length > 0) {
      const sorted = [...data.replyDurationsMinutes].sort((a, b) => a - b);
      const sum = sorted.reduce((a, b) => a + b, 0);
      avgReply = Math.round(sum / sorted.length);
      const mid = Math.floor(sorted.length / 2);
      medianReply = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }

    const pStat: ParticipantStats = {
      name,
      messageCount: data.messageCount,
      percentage,
      wordCount: data.wordCount,
      avgWordsPerMessage: avgWords,
      charactersCount: data.charactersCount,
      conversationsInitiated: data.conversationsInitiated,
      avgReplyTimeMinutes: avgReply,
      medianReplyTimeMinutes: medianReply,
      longestMonologueCount: data.longestMonologueCount,
    };
    return pStat;
  });

  // Calculate participation balance index (1.0 = equal distribution, 0.0 = completely one-sided)
  let participationBalance = 1.0;
  if (participantList.length >= 2) {
    const idealShare = 1 / participantList.length;
    let sumVariance = 0;
    participantList.forEach(p => {
      const share = p.messageCount / totalMessages;
      sumVariance += Math.abs(share - idealShare);
    });
    // Max variance is 2 * (1 - idealShare)
    const maxVariance = 2 * (1 - idealShare);
    participationBalance = maxVariance > 0 ? Math.max(0, Math.round((1 - sumVariance / maxVariance) * 100) / 100) : 1;
  }

  // Date range and messages per day
  const timestampSorted = userMessages
    .filter(m => m.timestamp !== null)
    .map(m => m.timestamp as string)
    .sort();

  const startDate = timestampSorted.length > 0 ? timestampSorted[0] : null;
  const endDate = timestampSorted.length > 0 ? timestampSorted[timestampSorted.length - 1] : null;

  let durationDays = 1;
  let messagesPerDay = totalMessages;

  if (startDate && endDate) {
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const diffDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)));
    durationDays = diffDays;
    messagesPerDay = Math.round((totalMessages / diffDays) * 10) / 10;
  }

  // Hourly distribution
  const hourlyDistribution: HourlyDistribution[] = hourlyCounts.map((count, hour) => ({
    hour,
    count,
    percentage: totalMessages > 0 ? Math.round((count / totalMessages) * 1000) / 10 : 0,
  }));

  // Daily distribution
  const dailyDistribution: DailyDistribution[] = dailyCounts.map((count, dayOfWeek) => ({
    dayOfWeek,
    dayName: DAYS_OF_WEEK[dayOfWeek],
    count,
  }));

  // Weekly trend list
  const weeklyTrends: WeeklyTrend[] = Array.from(weeklyMap.entries())
    .map(([weekLabel, count]) => ({ weekLabel, count }))
    .sort((a, b) => a.weekLabel.localeCompare(b.weekLabel));

  // Top keywords
  const topKeywords: TopWord[] = Array.from(wordFrequencyMap.entries())
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({ word, count }));

  // Conversation starters ratio
  const totalStarters = participantList.reduce((sum, p) => sum + p.conversationsInitiated, 0);
  const conversationStarters = participantList.map(p => ({
    name: p.name,
    count: p.conversationsInitiated,
    ratio: totalStarters > 0 ? Math.round((p.conversationsInitiated / totalStarters) * 100) : 0,
  }));

  // Reply time distributions
  const replyTimeDistributions = participantList.map(p => ({
    name: p.name,
    avgMinutes: p.avgReplyTimeMinutes,
    medianMinutes: p.medianReplyTimeMinutes,
  }));

  const isTimestampReliable = validTimestampCount >= Math.floor(totalMessages * 0.7);

  return {
    totalMessages,
    totalWords,
    participants: participantList,
    startDate,
    endDate,
    durationDays,
    messagesPerDay,
    hourlyDistribution,
    dailyDistribution,
    weeklyTrends,
    participationBalance,
    topKeywords,
    conversationStarters,
    replyTimeDistributions,
    isTimestampReliable,
  };
}
