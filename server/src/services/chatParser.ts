import { ChatMessage, ParsedChat } from '../shared/types/chat';

// Common WhatsApp system message patterns
const SYSTEM_PATTERNS = [
  /Messages and calls are end-to-end encrypted/i,
  /created group/i,
  /added you/i,
  /added [^:]+$/i,
  /removed [^:]+$/i,
  /left/i,
  /changed the subject to/i,
  /changed this group's icon/i,
  /changed their phone number/i,
  /security code changed/i,
  /waiting for this message/i,
  /pinned a message/i,
  /started a call/i,
  /missed video call/i,
  /missed voice call/i,
];

// Regex patterns for WhatsApp message headers
// Android: "15/01/2024, 14:32 - Alice: Hello" or "1/15/24, 2:32 PM - Bob: Hi"
const ANDROID_PATTERN = /^(\d{1,4}[/.-]\d{1,2}[/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*-\s*([^:]+?):\s*([\s\S]*)$/;
// Android system: "15/01/2024, 14:32 - Alice created group ..."
const ANDROID_SYSTEM_PATTERN = /^(\d{1,4}[/.-]\d{1,2}[/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*-\s*([^:]+)$/;

// iOS: "[15/01/2024, 14:32:10] Alice: Hello" or "[1/15/24, 2:32:10 PM] Bob: Hi"
const IOS_PATTERN = /^\[(\d{1,4}[/.-]\d{1,2}[/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\]\s*([^:]+?):\s*([\s\S]*)$/;
// iOS system: "[15/01/2024, 14:32:10] Messages and calls are end-to-end encrypted"
const IOS_SYSTEM_PATTERN = /^\[(\d{1,4}[/.-]\d{1,2}[/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\]\s*([^:]+)$/;

/**
 * Attempts to parse diverse date/time strings into an ISO string.
 * Handles DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, 12h and 24h formats.
 */
export function parseDateTime(dateStr: string, timeStr: string): string | null {
  try {
    const cleanDate = dateStr.trim();
    const cleanTime = timeStr.trim();

    // Clean invisible non-breaking spaces or Unicode LTR/RTL marks
    const sanitizedDate = cleanDate.replace(/[\u200E\u200F\u202F\u00A0]/g, ' ').trim();
    const sanitizedTime = cleanTime.replace(/[\u200E\u200F\u202F\u00A0]/g, ' ').trim();

    // Extract time components
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    const isPM = /PM/i.test(sanitizedTime);
    const isAM = /AM/i.test(sanitizedTime);
    const timeMatch = sanitizedTime.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);

    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
      seconds = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;

      if (isPM && hours < 12) hours += 12;
      if (isAM && hours === 12) hours = 0;
    }

    // Split date parts
    const parts = sanitizedDate.split(/[/.-]/).map(p => parseInt(p, 10));
    if (parts.length !== 3 || parts.some(isNaN)) {
      return null;
    }

    let year = 0;
    let month = 0;
    let day = 0;

    if (parts[0] > 1000) {
      // YYYY-MM-DD
      year = parts[0];
      month = parts[1] - 1;
      day = parts[2];
    } else {
      // Determine DD/MM/YY vs MM/DD/YY
      // Normalize 2-digit year
      let y = parts[2];
      if (y < 100) {
        y += y < 70 ? 2000 : 1900;
      }
      year = y;

      if (parts[0] > 12) {
        // Definitely DD/MM/YYYY
        day = parts[0];
        month = parts[1] - 1;
      } else if (parts[1] > 12) {
        // Definitely MM/DD/YYYY
        month = parts[0] - 1;
        day = parts[1];
      } else {
        // Ambiguous, assume standard international DD/MM/YYYY
        day = parts[0];
        month = parts[1] - 1;
      }
    }

    const d = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
}

/**
 * Parses raw WhatsApp export text into a structured ParsedChat object.
 */
export function parseWhatsAppChat(rawInput: string): ParsedChat {
  // Strip UTF-8 BOM if present
  let text = rawInput;
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  // Normalize line endings
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const warnings: string[] = [];
  const parsingErrors: string[] = [];

  if (!text || text.trim().length === 0) {
    return {
      messages: [],
      participants: [],
      startDate: null,
      endDate: null,
      totalMessages: 0,
      systemMessageCount: 0,
      formatDetected: 'generic',
      parsingErrors: ['Uploaded file is completely empty or contains only whitespace.'],
      warnings: [],
    };
  }

  const lines = text.split('\n');
  const messages: ChatMessage[] = [];
  const participantSet = new Set<string>();
  let systemCount = 0;
  let detectedFormat: 'whatsapp_ios' | 'whatsapp_android' | 'whatsapp_standard' | 'generic' = 'generic';

  let currentMsg: ChatMessage | null = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    // Remove control characters except standard whitespace
    const line = rawLine.replace(/[\u200E\u200F\u202F\u00A0]/g, ' ').trimEnd();
    if (!line && !currentMsg) continue;

    // Check iOS format: [DD/MM/YY, HH:MM:SS] Sender: Message
    const iosMatch = line.match(IOS_PATTERN);
    if (iosMatch) {
      if (currentMsg) messages.push(currentMsg);
      detectedFormat = 'whatsapp_ios';

      const [, datePart, timePart, senderPart, contentPart] = iosMatch;
      const sender = senderPart.trim();
      participantSet.add(sender);

      currentMsg = {
        id: `msg-${messages.length + 1}`,
        sender,
        timestamp: parseDateTime(datePart, timePart),
        timestampRaw: `${datePart} ${timePart}`,
        content: contentPart.trim(),
        isSystemNotification: false,
        rawText: line,
        lineIndex: i,
      };
      continue;
    }

    // Check iOS system notification
    const iosSysMatch = line.match(IOS_SYSTEM_PATTERN);
    if (iosSysMatch) {
      if (currentMsg) messages.push(currentMsg);
      detectedFormat = 'whatsapp_ios';
      systemCount++;

      const [, datePart, timePart, contentPart] = iosSysMatch;
      currentMsg = {
        id: `sys-${systemCount}`,
        sender: 'System',
        timestamp: parseDateTime(datePart, timePart),
        timestampRaw: `${datePart} ${timePart}`,
        content: contentPart.trim(),
        isSystemNotification: true,
        rawText: line,
        lineIndex: i,
      };
      continue;
    }

    // Check Android format: DD/MM/YY, HH:MM - Sender: Message
    const androidMatch = line.match(ANDROID_PATTERN);
    if (androidMatch) {
      if (currentMsg) messages.push(currentMsg);
      detectedFormat = 'whatsapp_android';

      const [, datePart, timePart, senderPart, contentPart] = androidMatch;
      const sender = senderPart.trim();
      participantSet.add(sender);

      currentMsg = {
        id: `msg-${messages.length + 1}`,
        sender,
        timestamp: parseDateTime(datePart, timePart),
        timestampRaw: `${datePart} ${timePart}`,
        content: contentPart.trim(),
        isSystemNotification: false,
        rawText: line,
        lineIndex: i,
      };
      continue;
    }

    // Check Android system message
    const androidSysMatch = line.match(ANDROID_SYSTEM_PATTERN);
    if (androidSysMatch) {
      const candidateContent = androidSysMatch[3].trim();
      const isSys = SYSTEM_PATTERNS.some(pat => pat.test(candidateContent));
      if (isSys) {
        if (currentMsg) messages.push(currentMsg);
        detectedFormat = 'whatsapp_android';
        systemCount++;

        currentMsg = {
          id: `sys-${systemCount}`,
          sender: 'System',
          timestamp: parseDateTime(androidSysMatch[1], androidSysMatch[2]),
          timestampRaw: `${androidSysMatch[1]} ${androidSysMatch[2]}`,
          content: candidateContent,
          isSystemNotification: true,
          rawText: line,
          lineIndex: i,
        };
        continue;
      }
    }

    // If not a new header, it is a multiline continuation of currentMsg
    if (currentMsg) {
      currentMsg.content += '\n' + line;
      currentMsg.rawText += '\n' + line;
    } else {
      // Stray line before any header
      if (line.trim()) {
        warnings.push(`Ignored preamble line ${i + 1}: "${line.slice(0, 50)}..."`);
      }
    }
  }

  // Push the final message if exists
  if (currentMsg) {
    messages.push(currentMsg);
  }

  // Sort timestamps if available
  const validTimestamps = messages
    .filter(m => m.timestamp !== null)
    .map(m => m.timestamp as string)
    .sort();

  const startDate = validTimestamps.length > 0 ? validTimestamps[0] : null;
  const endDate = validTimestamps.length > 0 ? validTimestamps[validTimestamps.length - 1] : null;

  if (messages.length === 0) {
    parsingErrors.push('No valid messages could be extracted. Please check that this is an exported WhatsApp .txt file.');
  }

  const userMessages = messages.filter(m => !m.isSystemNotification);

  return {
    messages,
    participants: Array.from(participantSet),
    startDate,
    endDate,
    totalMessages: userMessages.length,
    systemMessageCount: systemCount,
    formatDetected: detectedFormat,
    parsingErrors,
    warnings,
  };
}
