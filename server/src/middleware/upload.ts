import multer from 'multer';
import { Request } from 'express';

// Use memory storage for quick streaming into parser without leaving unmanaged disk residue
const storage = multer.memoryStorage();

// Validate file type
function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const isTxtExtension = file.originalname.toLowerCase().endsWith('.txt');
  const isTextMime = file.mimetype === 'text/plain' || file.mimetype === 'application/octet-stream' || !file.mimetype;

  if (isTxtExtension || isTextMime) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only plain-text exports (.txt) are supported at this time.'));
  }
}

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum
    files: 1,
  },
});
