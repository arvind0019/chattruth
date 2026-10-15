import { Request, Response } from 'express';
import crypto from 'crypto';
import { store, StoredUser } from '../services/store';
import { hashPassword, verifyPassword, generateToken, setAuthCookie, clearAuthCookie } from '../utils/auth';
import { emailService } from '../services/emailService';
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../validators/schemas';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const parse = RegisterSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parse.error.errors[0].message },
      });
      return;
    }

    const { email, password } = parse.data;
    const existing = await store.findUserByEmail(email);
    if (existing) {
      res.status(409).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'An account with this email already exists.' },
      });
      return;
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const now = new Date().toISOString();

    const newUser: StoredUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email,
      passwordHash,
      role: 'user',
      emailVerified: false,
      verificationToken,
      createdAt: now,
      updatedAt: now,
    };

    await store.createUser(newUser);
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      emailVerified: newUser.emailVerified,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });

    setAuthCookie(res, token);

    // Send verification email
    const appUrl = process.env.PUBLIC_APP_URL || 'http://localhost:5173';
    const verifyUrl = `${appUrl}/verify-email?token=${verificationToken}`;
    emailService.sendVerificationEmail(email, verifyUrl).catch(console.error);

    await store.logAudit({
      actorId: newUser.id,
      action: 'USER_REGISTER',
      targetType: 'user',
      targetId: newUser.id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          emailVerified: newUser.emailVerified,
          createdAt: newUser.createdAt,
        },
        token,
      },
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const parse = LoginSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parse.error.errors[0].message },
      });
      return;
    }

    const { email, password } = parse.data;
    const user = await store.findUserByEmail(email);

    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
      return;
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    setAuthCookie(res, token);

    await store.logAudit({
      actorId: user.id,
      action: 'USER_LOGIN',
      targetType: 'user',
      targetId: user.id,
      ipAddress: req.ip,
    });

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
        token,
      },
    });
  }

  async logout(_req: Request, res: Response): Promise<void> {
    clearAuthCookie(res);
    res.json({ success: true, data: { message: 'Successfully logged out.' } });
  }

  async getMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
      return;
    }

    res.json({
      success: true,
      data: { user: req.user },
    });
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const parse = ForgotPasswordSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parse.error.errors[0].message },
      });
      return;
    }

    const { email } = parse.data;
    const user = await store.findUserByEmail(email);

    // Always respond with success to prevent user enumeration
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await store.updateUser(user.id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: expires,
      });

      const appUrl = process.env.PUBLIC_APP_URL || 'http://localhost:5173';
      const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;
      emailService.sendPasswordResetEmail(email, resetUrl).catch(console.error);
    }

    res.json({
      success: true,
      data: { message: 'If that email address is registered, password reset instructions have been sent.' },
    });
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const parse = ResetPasswordSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parse.error.errors[0].message },
      });
      return;
    }

    const { token, newPassword } = parse.data;
    const allUsers = await store.getAllUsers();
    let targetUser: StoredUser | null = null;

    for (const u of allUsers) {
      const full = await store.findUserById(u.id);
      if (full && full.resetPasswordToken === token) {
        if (full.resetPasswordExpires && new Date(full.resetPasswordExpires).getTime() > Date.now()) {
          targetUser = full;
          break;
        }
      }
    }

    if (!targetUser) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Reset token is invalid or has expired.' },
      });
      return;
    }

    const newHash = await hashPassword(newPassword);
    await store.updateUser(targetUser.id, {
      passwordHash: newHash,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    await store.logAudit({
      actorId: targetUser.id,
      action: 'PASSWORD_RESET',
      targetType: 'user',
      targetId: targetUser.id,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      data: { message: 'Password has been successfully updated. You may now log in.' },
    });
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const token = req.body.token || (req.query.token as string);
    if (!token) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_TOKEN', message: 'Verification token is required.' },
      });
      return;
    }

    const allUsers = await store.getAllUsers();
    let targetUser: StoredUser | null = null;

    for (const u of allUsers) {
      const full = await store.findUserById(u.id);
      if (full && full.verificationToken === token) {
        targetUser = full;
        break;
      }
    }

    if (!targetUser) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Verification token is invalid or expired.' },
      });
      return;
    }

    await store.updateUser(targetUser.id, {
      emailVerified: true,
      verificationToken: undefined,
    });

    res.json({
      success: true,
      data: { message: 'Email address successfully verified.' },
    });
  }
}

export const authController = new AuthController();
