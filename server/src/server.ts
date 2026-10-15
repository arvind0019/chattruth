import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { connectDatabase } from './config/db';
import { deletionService } from './services/deletionService';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  ChatTruth Server running on http://localhost:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Client Origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
    console.log(`======================================================\n`);
  });

  // Background temporary file cleanup task (runs every 30 minutes)
  const cleanupInterval = setInterval(() => {
    deletionService.purgeExpiredTempFiles(60).catch(console.error);
  }, 30 * 60 * 1000);

  // Graceful shutdown handling
  const gracefulShutdown = () => {
    console.log('\n[Server] Shutting down gracefully...');
    clearInterval(cleanupInterval);
    server.close(() => {
      console.log('[Server] HTTP connections closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

startServer().catch(err => {
  console.error('[Server] Critical startup failure:', err);
  process.exit(1);
});
