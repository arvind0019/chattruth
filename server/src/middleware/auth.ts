import { Request, Response, NextFunction } from 'express';
import { COOKIE_NAME, verifyToken } from '../utils/auth';
import { store } from '../services/store';
import { UserProfile } from '../shared/types/user';

declare global {
  namespace Express {
    interface Request {
      user?: UserProfile;
    }
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[COOKIE_NAME] || req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) {
    return next();
  }

  const payload = verifyToken(token);
  if (payload) {
    const user = await store.findUserById(payload.id);
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
  }
  next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  await optionalAuth(req, res, () => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required to access this resource.',
        },
      });
      return;
    }
    next();
  });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Administrator privileges are required.',
        },
      });
      return;
    }
    next();
  });
}
