import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { watchlistRepository } from '../repositories/watchlist.repository.js';
import { z } from 'zod';

export const watchlistRoutes = Router();

watchlistRoutes.use(requireAuth);

watchlistRoutes.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const companies = await watchlistRepository.getUserWatchlist(req.userId!);
    res.json(companies);
  } catch (error) {
    next(error);
  }
});

const toggleSchema = z.object({
  companyId: z.string().uuid()
});

watchlistRoutes.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = toggleSchema.parse(req.body);
    await watchlistRepository.addToWatchlist(req.userId!, validated.companyId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

watchlistRoutes.delete('/:companyId', async (req: AuthenticatedRequest, res, next) => {
  try {
    await watchlistRepository.removeFromWatchlist(req.userId!, req.params.companyId as string);
    res.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not in watchlist' } });
    }
    next(error);
  }
});
