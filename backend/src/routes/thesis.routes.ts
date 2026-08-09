import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { thesisRepository } from '../repositories/thesis.repository.js';

export const thesisRoutes = Router();

const thesisSchema = z.object({
  companyId: z.string(),
  statement: z.string(),
  supportingReasons: z.array(z.string()),
  risks: z.array(z.string()),
  invalidationCriteria: z.array(z.string()),
  conviction: z.number().min(0).max(100),
  timeHorizon: z.string(),
});

thesisRoutes.use(requireAuth);

thesisRoutes.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = thesisSchema.parse(req.body);
    const thesis = await thesisRepository.createThesis({
      ...validated,
      userId: req.userId!,
    });
    // Transform JSON strings back to arrays for the response (repo already does this but create returns raw)
    res.status(201).json({
      ...thesis,
      supportingReasons: JSON.parse(thesis.supportingReasons),
      risks: JSON.parse(thesis.risks),
      invalidationCriteria: JSON.parse(thesis.invalidationCriteria)
    });
  } catch (error) {
    next(error);
  }
});

thesisRoutes.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const theses = await thesisRepository.getUserTheses(req.userId!);
    res.json(theses);
  } catch (error) {
    next(error);
  }
});

thesisRoutes.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const thesis = await thesisRepository.getThesisById(req.params.id, req.userId!);
    if (!thesis) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Thesis not found' } });
    }
    res.json(thesis);
  } catch (error) {
    next(error);
  }
});

thesisRoutes.patch('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const partialSchema = thesisSchema.partial().omit({ companyId: true });
    const validated = partialSchema.parse(req.body);
    const thesis = await thesisRepository.updateThesis(req.params.id, req.userId!, validated);
    res.json(thesis);
  } catch (error) {
    next(error);
  }
});
