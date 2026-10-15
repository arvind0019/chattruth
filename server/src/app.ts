import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { getDatabaseStatus } from './config/db';
import { generalLimiter } from './middleware/rateLimit';

import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import reportRoutes from './routes/reportRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminRoutes from './routes/adminRoutes';
import settingsRoutes from './routes/settingsRoutes';

export function createApp(): express.Application {
  const app = express();

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Handled by frontend or reverse proxy
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        
        if (
          origin === clientOrigin ||
          origin === 'http://localhost:5173' ||
          origin === 'http://127.0.0.1:5173' ||
          origin === 'https://chattruth.vercel.app' ||
          origin.endsWith('.vercel.app')
        ) {
          return callback(null, true);
        }
        
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Parsers
  app.use(cookieParser());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // General rate limiting
  app.use('/api', generalLimiter);

  // Health and readiness endpoints
  app.get('/api/v1/health', (_req: Request, res: Response) => {
    const dbStatus = getDatabaseStatus();
    res.json({
      status: 'ok',
      service: 'ChatTruth API Server',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      uptimeSeconds: Math.round(process.uptime()),
    });
  });

  app.get('/api/v1/ready', (_req: Request, res: Response) => {
    res.json({ ready: true, timestamp: new Date().toISOString() });
  });

  // REST API Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/uploads', uploadRoutes);
  app.use('/api/v1/reports', reportRoutes);
  app.use('/api/v1/payments', paymentRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/settings', settingsRoutes);

  // 404 Handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Requested endpoint does not exist.' },
    });
  });

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err.name === 'MulterError') {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(413).json({
          success: false,
          error: { code: 'FILE_TOO_LARGE', message: 'Uploaded chat export exceeds the 10MB limit.' },
        });
        return;
      }
    }

    const statusCode = err.status || err.statusCode || 500;
    const isProd = process.env.NODE_ENV === 'production';

    res.status(statusCode).json({
      success: false,
      error: {
        code: err.code || 'INTERNAL_ERROR',
        message: err.message || 'An unexpected error occurred.',
        ...(isProd ? {} : { stack: err.stack }),
      },
    });
  });

  return app;
}
