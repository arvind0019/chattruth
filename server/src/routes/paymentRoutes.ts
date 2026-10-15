import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/create-order', optionalAuth, (req, res) => paymentController.createOrder(req, res));
router.post('/verify', optionalAuth, (req, res) => paymentController.verifyPayment(req, res));
router.post('/webhook', (req, res) => paymentController.handleWebhook(req, res));

export default router;
