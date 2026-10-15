import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { uploadMiddleware } from '../middleware/upload';
import { optionalAuth, requireAuth } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/', uploadLimiter, optionalAuth, uploadMiddleware.single('file'), (req, res) =>
  reportController.createReport(req, res)
);
router.get('/', requireAuth, (req, res) => reportController.getUserReports(req, res));
router.get('/:id', optionalAuth, (req, res) => reportController.getReport(req, res));
router.get('/:id/preview', (req, res) => reportController.getReportPreview(req, res));
router.delete('/:id', optionalAuth, (req, res) => reportController.deleteReport(req, res));
router.post('/:id/retry', optionalAuth, (req, res) => reportController.retryReport(req, res));
router.post('/:id/unlock', optionalAuth, (req, res) => reportController.unlockReport(req, res));

export default router;
