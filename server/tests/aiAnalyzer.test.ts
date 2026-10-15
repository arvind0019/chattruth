import { describe, it, expect } from 'vitest';
import { parseWhatsAppChat } from '../src/services/chatParser';
import { calculateChatStatistics } from '../src/services/chatStatistics';
import { generateMockAiAnalysis, verifyQuoteInSource, AiReportOutputSchema } from '../src/services/aiAnalyzer';
import { ANDROID_SAMPLE_CHAT } from './fixtures/sampleChats';

describe('AI Analysis Engine & Verification', () => {
  it('validates mock report output against strict Zod schema', () => {
    const parsed = parseWhatsAppChat(ANDROID_SAMPLE_CHAT);
    const stats = calculateChatStatistics(parsed.messages);
    const report = generateMockAiAnalysis('relationship', stats, parsed.messages);

    const validation = AiReportOutputSchema.safeParse(report);
    expect(validation.success).toBe(true);
    expect(report.keyFindings.length).toBeGreaterThanOrEqual(2);
    expect(report.communicationPatterns.length).toBeGreaterThanOrEqual(1);
    expect(report.practicalSuggestions.length).toBeGreaterThanOrEqual(1);
  });

  it('correctly verifies quotes existing in source conversation', () => {
    const parsed = parseWhatsAppChat(ANDROID_SAMPLE_CHAT);

    // Verbatim excerpt from fixture
    const realQuote = 'Hey Maya, did you review the project proposal?';
    expect(verifyQuoteInSource(realQuote, parsed.messages)).toBe(true);

    // Fabricated quote not in fixture
    const fakeQuote = 'I secretly never wanted to work on this proposal at all.';
    expect(verifyQuoteInSource(fakeQuote, parsed.messages)).toBe(false);
  });

  it('rejects malformed AI JSON output missing required fields', () => {
    const invalidReport = {
      title: 'Bad Report',
      // Missing conciseSummary, apparentTone, keyFindings, etc.
    };

    const validation = AiReportOutputSchema.safeParse(invalidReport);
    expect(validation.success).toBe(false);
  });
});
