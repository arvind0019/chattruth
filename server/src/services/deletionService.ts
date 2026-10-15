import fs from 'fs';
import path from 'path';

export interface DeletionResult {
  success: boolean;
  message: string;
  itemsPurgedCount: number;
}

export class DeletionService {
  private uploadsDir: string;

  constructor(uploadsDir?: string) {
    this.uploadsDir = uploadsDir || path.resolve(process.cwd(), 'temp_uploads');
    if (!fs.existsSync(this.uploadsDir)) {
      try {
        fs.mkdirSync(this.uploadsDir, { recursive: true });
      } catch (err) {
        console.warn('[DeletionService] Could not create temp_uploads directory:', err);
      }
    }
  }

  /**
   * Safely deletes a file from the server's temporary storage.
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error(`[DeletionService] Error deleting file ${filePath}:`, err.message);
      return false;
    }
  }

  /**
   * Purges temporary files older than the specified maxAgeMinutes (default 60 minutes).
   */
  async purgeExpiredTempFiles(maxAgeMinutes: number = 60): Promise<number> {
    if (!fs.existsSync(this.uploadsDir)) return 0;

    let purged = 0;
    const now = Date.now();
    const maxAgeMs = maxAgeMinutes * 60 * 1000;

    try {
      const files = fs.readdirSync(this.uploadsDir);
      for (const file of files) {
        const fullPath = path.join(this.uploadsDir, file);
        const stats = fs.statSync(fullPath);
        if (now - stats.mtimeMs > maxAgeMs) {
          fs.unlinkSync(fullPath);
          purged++;
        }
      }
      if (purged > 0) {
        console.log(`[DeletionService] Automatically purged ${purged} expired temporary file(s).`);
      }
    } catch (err: any) {
      console.error('[DeletionService] Purge expired files error:', err.message);
    }
    return purged;
  }
}

export const deletionService = new DeletionService();
