import { Router } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post('/register', async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await authService.register(validated.email, validated.password, validated.name);
    res.status(201).json(result);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Email already registered') {
      res.status(409).json({ error: { code: 'CONFLICT', message: error.message } });
    } else {
      next(error);
    }
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await authService.login(validated.email, validated.password);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: error.message } });
    } else {
      next(error);
    }
  }
});

authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { prisma } = await import('../config/db.js');
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    if (!user) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
});
