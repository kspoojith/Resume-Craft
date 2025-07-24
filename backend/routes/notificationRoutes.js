import express from 'express';
import { getNotifications, markAllRead } from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.post('/mark-all-read', markAllRead);

export default router;
