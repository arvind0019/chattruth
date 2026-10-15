import { describe, it, expect } from 'vitest';
import { parseWhatsAppChat, parseDateTime } from '../src/services/chatParser';
import { ANDROID_SAMPLE_CHAT, IOS_SAMPLE_CHAT, MULTILINE_SAMPLE_CHAT, MALFORMED_CHAT } from './fixtures/sampleChats';

describe('WhatsApp Chat Parser', () => {
  it('correctly parses Android WhatsApp exports', () => {
    const parsed = parseWhatsAppChat(ANDROID_SAMPLE_CHAT);
    expect(parsed.formatDetected).toBe('whatsapp_android');
    expect(parsed.totalMessages).toBe(5);
    expect(parsed.systemMessageCount).toBe(1);
    expect(parsed.participants).toContain('Alex');
    expect(parsed.participants).toContain('Maya');
    expect(parsed.startDate).toBeTruthy();
    expect(parsed.endDate).toBeTruthy();
    expect(parsed.parsingErrors.length).toBe(0);
  });

  it('correctly parses iOS bracket-style exports', () => {
    const parsed = parseWhatsAppChat(IOS_SAMPLE_CHAT);
    expect(parsed.formatDetected).toBe('whatsapp_ios');
    expect(parsed.totalMessages).toBe(4);
    expect(parsed.participants).toContain('Jordan');
    expect(parsed.participants).toContain('Sam');
    expect(parsed.systemMessageCount).toBe(1);
  });

  it('handles multiline messages seamlessly without truncation', () => {
    const parsed = parseWhatsAppChat(MULTILINE_SAMPLE_CHAT);
    expect(parsed.totalMessages).toBe(2);
    const taylorMsg = parsed.messages.find(m => m.sender === 'Taylor');
    expect(taylorMsg?.content).toContain('1. Arrive at terminal 2');
    expect(taylorMsg?.content).toContain('3. Check into hotel');

    const caseyMsg = parsed.messages.find(m => m.sender === 'Casey');
    expect(caseyMsg?.content).toContain('camera gear');
  });

  it('handles UTF-8 BOM prefix and CRLF line breaks', () => {
    const bomText = '\uFEFF15/01/2024, 10:16 - Alex: Hello BOM!\r\n15/01/2024, 10:17 - Maya: Received!\r\n';
    const parsed = parseWhatsAppChat(bomText);
    expect(parsed.totalMessages).toBe(2);
    expect(parsed.messages[0].content).toBe('Hello BOM!');
  });

  it('handles empty and whitespace-only files with safe error messages', () => {
    const parsedEmpty = parseWhatsAppChat('');
    expect(parsedEmpty.totalMessages).toBe(0);
    expect(parsedEmpty.parsingErrors.length).toBeGreaterThan(0);

    const parsedWhitespace = parseWhatsAppChat('   \n  \t  \r\n');
    expect(parsedWhitespace.totalMessages).toBe(0);
  });

  it('reports malformed exports without throwing exceptions', () => {
    const parsed = parseWhatsAppChat(MALFORMED_CHAT);
    expect(parsed.totalMessages).toBe(0);
    expect(parsed.parsingErrors.length).toBeGreaterThan(0);
  });

  it('parses timestamps across 12-hour and 24-hour conventions', () => {
    const iso1 = parseDateTime('15/01/2024', '14:30');
    expect(iso1).toBeTruthy();

    const iso2 = parseDateTime('1/15/24', '2:30 PM');
    expect(iso2).toBeTruthy();
  });
});
