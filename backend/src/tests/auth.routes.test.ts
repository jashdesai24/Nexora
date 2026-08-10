import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { app } from '../index.js'; // Ensure app is exported from index.ts
import { prisma } from '../config/db.js';

describe('Authentication & IDOR Isolation', () => {
  let userAToken: string;
  let userBToken: string;
  let userAId: string;
  let userBId: string;
  let companyId: string;
  let thesisAId: string;
  let thesisBId: string;

  beforeEach(async () => {
    // Clean up database tables before each test
    const tableNames = ['User', 'Company', 'Watchlist', 'InvestmentThesis', 'Evidence', 'Source'];
    for (const table of tableNames) {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
      } catch {
        // Ignore if table doesn't exist yet
      }
    }

    // 1. Create a dummy company for theses
    const company = await prisma.company.create({
      data: { name: 'Test Corp', sector: 'Tech' }
    });
    companyId = company.id;

    // 2. Signup User A
    const resA = await request(app).post('/api/auth/register').send({
      email: 'usera@example.com',
      password: 'password123',
      name: 'User A',
    });
    if (resA.status !== 201) {
      throw new Error(`User A signup failed: ${JSON.stringify(resA.body)}`);
    }
    userAToken = resA.body.token;
    userAId = resA.body.user.id;

    // 3. Signup User B
    const resB = await request(app).post('/api/auth/register').send({
      email: 'userb@example.com',
      password: 'password123',
      name: 'User B',
    });
    if (resB.status !== 201) {
      throw new Error(`User B signup failed: ${JSON.stringify(resB.body)}`);
    }
    userBToken = resB.body.token;
    userBId = resB.body.user.id;

    // 4. Create Thesis A (Owned by User A)
    const thesisA = await prisma.investmentThesis.create({
      data: {
        userId: userAId,
        companyId,
        statement: 'Thesis A',
        supportingReasons: '[]',
        risks: '[]',
        invalidationCriteria: '[]',
        timeHorizon: '1 year'
      }
    });
    thesisAId = thesisA.id;

    // 5. Create Thesis B (Owned by User B)
    const thesisB = await prisma.investmentThesis.create({
      data: {
        userId: userBId,
        companyId,
        statement: 'Thesis B',
        supportingReasons: '[]',
        risks: '[]',
        invalidationCriteria: '[]',
        timeHorizon: '1 year'
      }
    });
    thesisBId = thesisB.id;
  });

  describe('Auth Flow', () => {
    it('should login and return token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'usera@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'usera@example.com',
        password: 'wrongpassword',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('IDOR Authorization Checks (Theses)', () => {
    it('User A requests Thesis A -> SUCCESS', async () => {
      const res = await request(app)
        .get(`/api/theses/${thesisAId}`)
        .set('Authorization', `Bearer ${userAToken}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(thesisAId);
    });

    it('User A requests Thesis B -> MUST FAIL', async () => {
      const res = await request(app)
        .get(`/api/theses/${thesisBId}`)
        .set('Authorization', `Bearer ${userAToken}`);
      // Must not return Thesis B
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('User B requests Thesis A -> MUST FAIL', async () => {
      const res = await request(app)
        .get(`/api/theses/${thesisAId}`)
        .set('Authorization', `Bearer ${userBToken}`);
      // Must not return Thesis A
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
