import { Request, Response } from 'express';
import { store } from '../services/store';
import { clearAuthCookie } from '../utils/auth';

export class SettingsController {
  async getSettings(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } });
      return;
    }

    const user = await store.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found.' } });
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        },
        privacySettings: {
          dataRetentionDays: 30,
          analyticsConsent: false,
          automaticDeleteAfterReport: false,
        },
      },
    });
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } });
      return;
    }

    res.json({
      success: true,
      data: { message: 'Settings successfully updated.' },
    });
  }

  async deleteAccount(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } });
      return;
    }

    const userId = req.user.id;
    await store.deleteUser(userId);

    await store.logAudit({
      actorId: userId,
      action: 'USER_DELETED_ACCOUNT',
      targetType: 'user',
      targetId: userId,
      ipAddress: req.ip,
    });

    clearAuthCookie(res);
    res.json({
      success: true,
      data: { message: 'Account and associated reports successfully deleted.' },
    });
  }
}

export const settingsController = new SettingsController();
