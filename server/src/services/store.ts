import { AnalysisReport } from '../shared/types/report';
import { UserProfile, UserRole } from '../shared/types/user';
import { PaymentOrder } from '../shared/types/payment';
import { getDatabaseStatus } from '../config/db';
import { UserModel } from '../models/User';
import { ReportModel } from '../models/Report';
import { PaymentModel } from '../models/Payment';
import { AnalysisJobModel } from '../models/AnalysisJob';
import { AuditLogModel } from '../models/AuditLog';

// In-memory data store cache
export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface StoredJob {
  id: string;
  reportId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  startedAt?: string;
  completedAt?: string;
  lastError?: string;
  createdAt: string;
}

export interface StoredAudit {
  id: string;
  actorId?: string;
  action: string;
  targetType: 'user' | 'report' | 'payment' | 'system' | 'settings';
  targetId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

class StoreRepository {
  private users = new Map<string, StoredUser>();
  private reports = new Map<string, AnalysisReport>();
  private payments = new Map<string, PaymentOrder>();
  private jobs = new Map<string, StoredJob>();
  private auditLogs: StoredAudit[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // Seed default admin and demonstration users
    const defaultAdmin: StoredUser = {
      id: 'usr_admin_001',
      email: 'admin@chattruth.app',
      // bcrypt hash for 'AdminSecurePassword123!'
      passwordHash: '$2a$10$w8W7O8f7O8W7O8f7O8W7OeRzG1vJ7p8GqYQyH6J9K2L4M6N8P0Q2S',
      role: 'admin',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(defaultAdmin.id, defaultAdmin);
  }

  // ================= USERS =================
  async findUserByEmail(email: string): Promise<StoredUser | null> {
    const norm = email.toLowerCase().trim();
    if (getDatabaseStatus().isConnected) {
      try {
        const u = await UserModel.findOne({ email: norm });
        if (u) {
          return {
            id: u._id.toString(),
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role,
            emailVerified: u.emailVerified,
            verificationToken: u.verificationToken,
            resetPasswordToken: u.resetPasswordToken,
            resetPasswordExpires: u.resetPasswordExpires,
            createdAt: u.createdAt.toISOString(),
            updatedAt: u.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        console.warn('[Store] Mongo findUserByEmail fallback to memory');
      }
    }

    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === norm) return u;
    }
    return null;
  }

  async findUserById(id: string): Promise<StoredUser | null> {
    if (getDatabaseStatus().isConnected) {
      try {
        const u = await UserModel.findById(id);
        if (u) {
          return {
            id: u._id.toString(),
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role,
            emailVerified: u.emailVerified,
            verificationToken: u.verificationToken,
            resetPasswordToken: u.resetPasswordToken,
            resetPasswordExpires: u.resetPasswordExpires,
            createdAt: u.createdAt.toISOString(),
            updatedAt: u.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        console.warn('[Store] Mongo findUserById fallback to memory');
      }
    }
    return this.users.get(id) || null;
  }

  async createUser(user: StoredUser): Promise<StoredUser> {
    this.users.set(user.id, user);

    if (getDatabaseStatus().isConnected) {
      try {
        await UserModel.create({
          _id: user.id.length === 24 ? user.id : undefined,
          email: user.email,
          passwordHash: user.passwordHash,
          role: user.role,
          emailVerified: user.emailVerified,
        });
      } catch (err) {
        console.warn('[Store] Mongo createUser error:', err);
      }
    }
    return user;
  }

  async updateUser(id: string, updates: Partial<StoredUser>): Promise<StoredUser | null> {
    const existing = await this.findUserById(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.users.set(id, updated);

    if (getDatabaseStatus().isConnected) {
      try {
        await UserModel.findByIdAndUpdate(id, updates);
      } catch (err) {
        console.warn('[Store] Mongo updateUser error:', err);
      }
    }
    return updated;
  }

  async getAllUsers(): Promise<UserProfile[]> {
    if (getDatabaseStatus().isConnected) {
      try {
        const docs = await UserModel.find().sort({ createdAt: -1 });
        return docs.map(d => ({
          id: d._id.toString(),
          email: d.email,
          role: d.role,
          emailVerified: d.emailVerified,
          createdAt: d.createdAt.toISOString(),
          updatedAt: d.updatedAt.toISOString(),
        }));
      } catch (err) {
        console.warn('[Store] Mongo getAllUsers fallback to memory');
      }
    }

    return Array.from(this.users.values()).map(u => ({
      id: u.id,
      email: u.email,
      role: u.role,
      emailVerified: u.emailVerified,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  }

  async deleteUser(id: string): Promise<boolean> {
    this.users.delete(id);
    // Delete owned reports
    for (const [repId, rep] of this.reports.entries()) {
      if (rep.userId === id) {
        this.reports.delete(repId);
      }
    }

    if (getDatabaseStatus().isConnected) {
      try {
        await UserModel.findByIdAndDelete(id);
        await ReportModel.deleteMany({ userId: id });
      } catch (err) {
        console.warn('[Store] Mongo deleteUser error:', err);
      }
    }
    return true;
  }

  // ================= REPORTS =================
  async saveReport(report: AnalysisReport): Promise<AnalysisReport> {
    this.reports.set(report.id, report);

    if (getDatabaseStatus().isConnected) {
      try {
        await ReportModel.findOneAndUpdate(
          { _id: report.id.length === 24 ? report.id : undefined },
          report,
          { upsert: true, new: true }
        );
      } catch (err) {
        console.warn('[Store] Mongo saveReport error:', err);
      }
    }
    return report;
  }

  async getReportById(id: string): Promise<AnalysisReport | null> {
    if (getDatabaseStatus().isConnected) {
      try {
        const doc = await ReportModel.findById(id);
        if (doc) return doc.toJSON() as AnalysisReport;
      } catch (err) {
        console.warn('[Store] Mongo getReportById fallback to memory');
      }
    }
    return this.reports.get(id) || null;
  }

  async getUserReports(userId: string): Promise<AnalysisReport[]> {
    if (getDatabaseStatus().isConnected) {
      try {
        const docs = await ReportModel.find({ userId }).sort({ createdAt: -1 });
        return docs.map(d => d.toJSON() as AnalysisReport);
      } catch (err) {
        console.warn('[Store] Mongo getUserReports fallback to memory');
      }
    }

    return Array.from(this.reports.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllReports(): Promise<AnalysisReport[]> {
    if (getDatabaseStatus().isConnected) {
      try {
        const docs = await ReportModel.find().sort({ createdAt: -1 });
        return docs.map(d => d.toJSON() as AnalysisReport);
      } catch (err) {
        console.warn('[Store] Mongo getAllReports fallback to memory');
      }
    }

    return Array.from(this.reports.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async deleteReport(id: string): Promise<boolean> {
    const deleted = this.reports.delete(id);
    if (getDatabaseStatus().isConnected) {
      try {
        await ReportModel.findByIdAndDelete(id);
      } catch (err) {
        console.warn('[Store] Mongo deleteReport error:', err);
      }
    }
    return deleted;
  }

  async updateReportPaymentStatus(id: string, isPaid: boolean): Promise<AnalysisReport | null> {
    const report = await this.getReportById(id);
    if (!report) return null;

    report.isPaid = isPaid;
    report.updatedAt = new Date().toISOString();
    return this.saveReport(report);
  }

  // ================= PAYMENTS =================
  async savePayment(payment: PaymentOrder): Promise<PaymentOrder> {
    this.payments.set(payment.orderId, payment);

    if (getDatabaseStatus().isConnected) {
      try {
        await PaymentModel.findOneAndUpdate(
          { providerOrderId: payment.orderId },
          {
            reportId: payment.reportId,
            userId: payment.userId,
            provider: payment.provider,
            providerOrderId: payment.orderId,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
          },
          { upsert: true }
        );
      } catch (err) {
        console.warn('[Store] Mongo savePayment error:', err);
      }
    }
    return payment;
  }

  async getPaymentByOrderId(orderId: string): Promise<PaymentOrder | null> {
    return this.payments.get(orderId) || null;
  }

  async getAllPayments(): Promise<PaymentOrder[]> {
    return Array.from(this.payments.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ================= JOBS =================
  async createJob(job: StoredJob): Promise<StoredJob> {
    this.jobs.set(job.id, job);
    return job;
  }

  async getJob(id: string): Promise<StoredJob | null> {
    return this.jobs.get(id) || null;
  }

  async updateJob(id: string, updates: Partial<StoredJob>): Promise<StoredJob | null> {
    const j = this.jobs.get(id);
    if (!j) return null;
    const updated = { ...j, ...updates };
    this.jobs.set(id, updated);
    return updated;
  }

  async getAllJobs(): Promise<StoredJob[]> {
    return Array.from(this.jobs.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ================= AUDIT LOGS =================
  async logAudit(log: Omit<StoredAudit, 'id' | 'timestamp'>): Promise<void> {
    const entry: StoredAudit = {
      ...log,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 500) this.auditLogs.pop(); // Keep bounded

    if (getDatabaseStatus().isConnected) {
      try {
        await AuditLogModel.create(entry);
      } catch (err) {
        console.warn('[Store] Mongo logAudit error:', err);
      }
    }
  }

  async getAuditLogs(limit = 100): Promise<StoredAudit[]> {
    return this.auditLogs.slice(0, limit);
  }
}

export const store = new StoreRepository();
