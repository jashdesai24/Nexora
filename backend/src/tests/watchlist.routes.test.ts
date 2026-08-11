import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { app } from '../index.js';
import { prisma } from '../config/db.js';

describe('Watchlist Routes & Isolation', () => {
  let userAToken: string;
  let userBToken: string;
  let userAId: string;

  beforeEach(async () => {
    // Clean up
    const tableNames = ['User', 'Company', 'Watchlist'];
    for (const table of tableNames) {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
      } catch {
        // Ignore
      }
    }

    // Signup User A
    const resA = await request(app).post('/api/auth/register').send({
      email: 'usera_watch@example.com',
      password: 'password123',
      name: 'User A',
    });
    userAToken = resA.body.token;
    userAId = resA.body.user.id;

    // Signup User B
    const resB = await request(app).post('/api/auth/register').send({
      email: 'userb_watch@example.com',
      password: 'password123',
      name: 'User B',
    });
    userBToken = resB.body.token;

    // Create companies
    await prisma.company.create({ data: { id: '11111111-1111-1111-1111-111111111111', name: 'Company A' } });
    await prisma.company.create({ data: { id: '22222222-2222-2222-2222-222222222222', name: 'Company B' } });

    // Seed Watchlist: User A tracks Company A
    await prisma.watchlist.create({
      data: { userId: userAId, companyId: '11111111-1111-1111-1111-111111111111' }
    });
  });

  it('should return User A watchlist correctly', async () => {
    const res = await request(app)
      .get('/api/watchlist')
      .set('Authorization', `Bearer ${userAToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe('11111111-1111-1111-1111-111111111111');
  });

  it('User B should not see User A watchlist', async () => {
    const res = await request(app)
      .get('/api/watchlist')
      .set('Authorization', `Bearer ${userBToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0); // User B has no watchlist
  });

  it('User B can add to their own watchlist', async () => {
    const resAdd = await request(app)
      .post('/api/watchlist')
      .set('Authorization', `Bearer ${userBToken}`)
      .send({ companyId: '22222222-2222-2222-2222-222222222222' });
    expect(resAdd.status).toBe(200);

    const resGet = await request(app)
      .get('/api/watchlist')
      .set('Authorization', `Bearer ${userBToken}`);
    
    expect(resGet.status).toBe(200);
    expect(resGet.body).toHaveLength(1);
    expect(resGet.body[0].id).toBe('22222222-2222-2222-2222-222222222222');

    // Ensure User A is unaffected
    const resGetA = await request(app)
      .get('/api/watchlist')
      .set('Authorization', `Bearer ${userAToken}`);
    expect(resGetA.body).toHaveLength(1);
    expect(resGetA.body[0].id).toBe('11111111-1111-1111-1111-111111111111');
  });
});
