import { Router } from 'express';
import { settingsController } from '../controllers/settingsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res) => settingsController.getSettings(req, res));
router.patch('/', (req, res) => settingsController.updateSettings(req, res));
router.delete('/account', (req, res) => settingsController.deleteAccount(req, res));

export default router;
