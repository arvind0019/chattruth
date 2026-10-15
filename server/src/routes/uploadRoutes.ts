import { Router } from 'express';
import { uploadController } from '../controllers/uploadController';
import { uploadMiddleware } from '../middleware/upload';
import { uploadLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/preview', uploadLimiter, uploadMiddleware.single('file'), (req, res) =>
  uploadController.previewChat(req, res)
);

export default router;
