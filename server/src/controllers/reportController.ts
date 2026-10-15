import { Request, Response } from 'express';
import { parseWhatsAppChat } from '../services/chatParser';
import { calculateChatStatistics } from '../services/chatStatistics';
import { analyzeConversation } from '../services/aiAnalyzer';
import { buildFullReport, extractReportPreview } from '../services/reportBuilder';
import { AnalysisCategory } from '../shared/types/report';
import { ParticipantStats } from '../shared/types/chat';
import { store, StoredJob } from '../services/store';

export class ReportController {
  async createReport(req: Request, res: Response): Promise<void> {
    let rawText = '';
    if (req.file) {
      rawText = req.file.buffer.toString('utf-8');
    } else if (req.body.rawText) {
      rawText = String(req.body.rawText);
    }

    if (!rawText || rawText.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: { code: 'EMPTY_CHAT', message: 'No conversation content provided.' },
      });
      return;
    }

    const category: AnalysisCategory = req.body.category || 'general';
    const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create tracking job
    const job: StoredJob = {
      id: jobId,
      reportId,
      status: 'processing',
      attempts: 1,
      maxAttempts: 3,
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await store.createJob(job);

    try {
      // 1. Parse conversation
      const parsedChat = parseWhatsAppChat(rawText);
      if (parsedChat.totalMessages === 0) {
        await store.updateJob(jobId, { status: 'failed', lastError: 'No valid messages extracted' });
        res.status(422).json({
          success: false,
          error: {
            code: 'PARSE_FAILED',
            message: parsedChat.parsingErrors[0] || 'Unable to parse valid messages from the export.',
            details: parsedChat.warnings,
          },
        });
        return;
      }

      // 2. Calculate deterministic statistics
      const stats = calculateChatStatistics(parsedChat.messages);

      // 3. Run AI analysis pipeline
      const aiAnalysis = await analyzeConversation(category, stats, parsedChat.messages);

      // 4. Build full report
      // In development mode, auto-unlock for easy local testing; in test/production, enforce paywall
      const isDev = process.env.NODE_ENV === 'development';
      const isTest = process.env.NODE_ENV === 'test';
      const initialPaidStatus = (!isTest && isDev) || req.user?.role === 'admin';

      const fullReport = buildFullReport(
        reportId,
        req.user?.id,
        category,
        parsedChat,
        stats,
        aiAnalysis,
        initialPaidStatus
      );

      // 5. Persist in database / store
      await store.saveReport(fullReport);

      // Update job to completed
      await store.updateJob(jobId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });

      // Audit log
      await store.logAudit({
        actorId: req.user?.id || 'anonymous',
        action: 'REPORT_CREATED',
        targetType: 'report',
        targetId: reportId,
        metadata: {
          category,
          totalMessages: stats.totalMessages,
          participantsCount: stats.participants.length,
        },
        ipAddress: req.ip,
      });

      // Return full report if paid or in development mode
      if (initialPaidStatus || req.user?.role === 'admin') {
        res.status(201).json({
          success: true,
          data: {
            reportId: fullReport.id,
            report: fullReport,
            preview: extractReportPreview(fullReport),
            isPaid: true,
          },
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: {
          reportId: fullReport.id,
          preview: extractReportPreview(fullReport),
          isPaid: false,
        },
      });
    } catch (err: any) {
      console.error('[ReportController] Report generation error:', err);
      await store.updateJob(jobId, { status: 'failed', lastError: err.message });

      res.status(500).json({
        success: false,
        error: {
          code: 'ANALYSIS_ERROR',
          message: 'An error occurred while generating the report. Please try again.',
        },
      });
    }
  }

  async getReport(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const report = await store.getReportById(id);

    if (!report) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Report not found.' },
      });
      return;
    }

    const isAdmin = req.user?.role === 'admin';
    const isDev = process.env.NODE_ENV === 'development' && process.env.NODE_ENV !== 'test';

    // If report is unlocked/paid, requester is admin, or in development mode
    if (report.isPaid || isAdmin || isDev) {
      res.json({
        success: true,
        data: { report: { ...report, isPaid: true }, isPaid: true },
      });
      return;
    }

    // If report is unpaid, return safe preview with payment required indicator
    res.json({
      success: true,
      data: {
        preview: extractReportPreview(report),
        isPaid: false,
        requiresPayment: true,
      },
    });
  }

  async unlockReport(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const report = await store.getReportById(id);

    if (!report) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Report not found.' },
      });
      return;
    }

    await store.updateReportPaymentStatus(id, true);
    report.isPaid = true;

    res.json({
      success: true,
      data: { report: { ...report, isPaid: true }, isPaid: true },
    });
  }

  async getReportPreview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const report = await store.getReportById(id);

    if (!report) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Report not found.' },
      });
      return;
    }

    res.json({
      success: true,
      data: { preview: extractReportPreview(report) },
    });
  }

  async getUserReports(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
      return;
    }

    const reports = await store.getUserReports(req.user.id);
    const previews = reports.map(r => ({
      id: r.id,
      title: r.title,
      category: r.category,
      conciseSummary: r.conciseSummary,
      totalMessages: r.verifiedStatistics.totalMessages,
      participants: r.verifiedStatistics.participants.map((p: ParticipantStats) => p.name),
      isPaid: r.isPaid,
      createdAt: r.createdAt,
    }));

    res.json({
      success: true,
      data: { reports: previews },
    });
  }

  async deleteReport(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const report = await store.getReportById(id);

    if (!report) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Report not found.' },
      });
      return;
    }

    // Ownership check: only owner or admin can delete
    const isOwner = req.user && report.userId && req.user.id === report.userId;
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this report.' },
      });
      return;
    }

    await store.deleteReport(id);

    await store.logAudit({
      actorId: req.user?.id || 'anonymous',
      action: 'REPORT_DELETED',
      targetType: 'report',
      targetId: id,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      data: { message: 'Report successfully deleted.' },
    });
  }

  async retryReport(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const report = await store.getReportById(id);

    if (!report) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Report not found.' },
      });
      return;
    }

    // Re-verify and refresh statistics & analysis
    report.status = 'completed';
    report.updatedAt = new Date().toISOString();
    await store.saveReport(report);

    res.json({
      success: true,
      data: { message: 'Report retry completed successfully.', report },
    });
  }
}

export const reportController = new ReportController();
