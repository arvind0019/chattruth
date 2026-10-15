import { describe, it, expect } from 'vitest';
import { calculateChatStatistics } from '../src/services/chatStatistics';
import { parseWhatsAppChat } from '../src/services/chatParser';
import { ANDROID_SAMPLE_CHAT } from './fixtures/sampleChats';

describe('Chat Statistics Engine', () => {
  it('computes accurate message counts and participant distribution', () => {
    const parsed = parseWhatsAppChat(ANDROID_SAMPLE_CHAT);
    const stats = calculateChatStatistics(parsed.messages);

    expect(stats.totalMessages).toBe(5);
    expect(stats.participants.length).toBe(2);

    const alex = stats.participants.find(p => p.name === 'Alex');
    const maya = stats.participants.find(p => p.name === 'Maya');

    expect(alex?.messageCount).toBe(3);
    expect(maya?.messageCount).toBe(2);
    expect(alex?.percentage).toBe(60);
    expect(maya?.percentage).toBe(40);
  });

  it('calculates participation balance index within 0 to 1', () => {
    const parsed = parseWhatsAppChat(ANDROID_SAMPLE_CHAT);
    const stats = calculateChatStatistics(parsed.messages);

    expect(stats.participationBalance).toBeGreaterThan(0);
    expect(stats.participationBalance).toBeLessThanOrEqual(1.0);
  });

  it('determines reply times correctly when consecutive messages occur', () => {
    const parsed = parseWhatsAppChat(ANDROID_SAMPLE_CHAT);
    const stats = calculateChatStatistics(parsed.messages);

    // Timestamps in ANDROID_SAMPLE_CHAT have clear minute deltas
    expect(stats.replyTimeDistributions.length).toBe(2);
  });

  it('populates 24-hour distribution and 7-day distribution buckets', () => {
    const parsed = parseWhatsAppChat(ANDROID_SAMPLE_CHAT);
    const stats = calculateChatStatistics(parsed.messages);

    expect(stats.hourlyDistribution.length).toBe(24);
    expect(stats.dailyDistribution.length).toBe(7);

    // Message hour 10:xx UTC/local should have messages
    const hour10 = stats.hourlyDistribution.find(h => h.hour === 10);
    expect(hour10?.count).toBeGreaterThan(0);
  });

  it('handles empty input gracefully without division by zero', () => {
    const emptyStats = calculateChatStatistics([]);
    expect(emptyStats.totalMessages).toBe(0);
    expect(emptyStats.participants.length).toBe(0);
    expect(emptyStats.participationBalance).toBe(0);
    expect(emptyStats.messagesPerDay).toBe(0);
  });
});
