import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { notificationRepository } from '../repositories/notification.repository.js';

export const notificationRoutes = Router();

notificationRoutes.use(requireAuth);

notificationRoutes.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const notifications = await notificationRepository.getUserNotifications(req.userId!);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

notificationRoutes.patch('/:id/read', async (req: AuthenticatedRequest, res, next) => {
  try {
    const notification = await notificationRepository.markAsRead(req.params.id as string, req.userId!);
    res.json(notification);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Notification not found' } });
    }
    next(error);
  }
});

notificationRoutes.patch('/read-all', async (req: AuthenticatedRequest, res, next) => {
  try {
    await notificationRepository.markAllAsRead(req.userId!);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
