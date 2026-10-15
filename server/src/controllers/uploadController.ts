import { Request, Response } from 'express';
import { parseWhatsAppChat } from '../services/chatParser';
import { ChatMessage } from '../shared/types/chat';

export class UploadController {
  async previewChat(req: Request, res: Response): Promise<void> {
    let rawText = '';

    if (req.file) {
      rawText = req.file.buffer.toString('utf-8');
    } else if (req.body.rawText) {
      rawText = String(req.body.rawText);
    }

    if (!rawText || rawText.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_FILE',
          message: 'The uploaded file is empty. Please upload an exported WhatsApp .txt file.',
        },
      });
      return;
    }

    const parsed = parseWhatsAppChat(rawText);

    if (parsed.parsingErrors.length > 0 && parsed.totalMessages === 0) {
      res.status(422).json({
        success: false,
        error: {
          code: 'UNSUPPORTED_FORMAT',
          message: parsed.parsingErrors[0],
          details: parsed.warnings,
        },
      });
      return;
    }

    const previewExcerpts = parsed.messages
      .filter((m: ChatMessage) => !m.isSystemNotification)
      .slice(0, 5)
      .map((m: ChatMessage) => ({
        sender: m.sender,
        content: m.content.length > 80 ? m.content.slice(0, 80) + '...' : m.content,
        timestamp: m.timestamp,
      }));

    res.json({
      success: true,
      data: {
        totalMessages: parsed.totalMessages,
        systemMessageCount: parsed.systemMessageCount,
        participants: parsed.participants,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        formatDetected: parsed.formatDetected,
        warnings: parsed.warnings,
        previewExcerpts,
      },
    });
  }
}

export const uploadController = new UploadController();
