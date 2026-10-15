import { Request, Response } from 'express';
import { store } from '../services/store';
import { getDatabaseStatus } from '../config/db';
import { ParticipantStats } from '../shared/types/chat';

export class AdminController {
  async getMetrics(_req: Request, res: Response): Promise<void> {
    const users = await store.getAllUsers();
    const reports = await store.getAllReports();
    const payments = await store.getAllPayments();
    const jobs = await store.getAllJobs();

    const completedReports = reports.filter(r => r.status === 'completed').length;
    const failedReports = reports.filter(r => r.status === 'failed').length;
    const processingJobs = jobs.filter(j => j.status === 'processing' || j.status === 'queued').length;

    // Calculate total verified revenue
    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    const failedPaymentsCount = payments.filter(p => p.status === 'failed').length;

    const conversionRate = reports.length > 0
      ? Math.round((completedPayments.length / reports.length) * 1000) / 10
      : 0;

    res.json({
      success: true,
      data: {
        totalUsers: users.length,
        totalReports: reports.length,
        completedReports,
        failedReports,
        processingJobs,
        totalRevenue: Math.round(totalRevenue / 100), // formatted units
        currency: 'INR',
        failedPaymentsCount,
        conversionRate,
        activeUsersLast30Days: users.length,
        systemHealth: {
          database: getDatabaseStatus(),
          uptimeSeconds: Math.round(process.uptime()),
          memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        },
      },
    });
  }

  async getUsers(_req: Request, res: Response): Promise<void> {
    const users = await store.getAllUsers();
    res.json({ success: true, data: { users } });
  }

  async getReports(_req: Request, res: Response): Promise<void> {
    const reports = await store.getAllReports();
    const summaries = reports.map(r => ({
      id: r.id,
      title: r.title,
      category: r.category,
      userId: r.userId,
      isPaid: r.isPaid,
      status: r.status,
      totalMessages: r.verifiedStatistics.totalMessages,
      participants: r.verifiedStatistics.participants.map((p: ParticipantStats) => p.name),
      createdAt: r.createdAt,
    }));

    res.json({ success: true, data: { reports: summaries } });
  }

  async getPayments(_req: Request, res: Response): Promise<void> {
    const payments = await store.getAllPayments();
    res.json({ success: true, data: { payments } });
  }

  async getJobs(_req: Request, res: Response): Promise<void> {
    const jobs = await store.getAllJobs();
    res.json({ success: true, data: { jobs } });
  }

  async getAuditLogs(req: Request, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const logs = await store.getAuditLogs(limit);
    res.json({ success: true, data: { logs } });
  }

  async updateUserRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { role } = req.body;

    if (role !== 'user' && role !== 'admin') {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ROLE', message: 'Role must be user or admin.' },
      });
      return;
    }

    const updated = await store.updateUser(id, { role });
    if (!updated) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found.' },
      });
      return;
    }

    await store.logAudit({
      actorId: req.user?.id || 'admin',
      action: 'UPDATE_USER_ROLE',
      targetType: 'user',
      targetId: id,
      metadata: { newRole: role },
      ipAddress: req.ip,
    });

    res.json({ success: true, data: { user: updated } });
  }
}

export const adminController = new AdminController();
