import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authLimiter } from '../middleware/rateLimit';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', authLimiter, (req, res) => authController.register(req, res));
router.post('/login', authLimiter, (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/me', requireAuth, (req, res) => authController.getMe(req, res));
router.post('/forgot-password', authLimiter, (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', authLimiter, (req, res) => authController.resetPassword(req, res));
router.post('/verify-email', (req, res) => authController.verifyEmail(req, res));

export default router;
