import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Protect all admin endpoints with requireAdmin
router.use(requireAdmin);

router.get('/metrics', (req, res) => adminController.getMetrics(req, res));
router.get('/users', (req, res) => adminController.getUsers(req, res));
router.patch('/users/:id/role', (req, res) => adminController.updateUserRole(req, res));
router.get('/reports', (req, res) => adminController.getReports(req, res));
router.get('/payments', (req, res) => adminController.getPayments(req, res));
router.get('/jobs', (req, res) => adminController.getJobs(req, res));
router.get('/logs', (req, res) => adminController.getAuditLogs(req, res));

export default router;
