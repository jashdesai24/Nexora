import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { app } from '../index.js';
import { prisma } from '../config/db.js';

describe('Companies Routes & Search', () => {
  let userToken: string;

  beforeEach(async () => {
    // Clean up
    const tableNames = ['User', 'Company', 'CompanyIdentifier'];
    for (const table of tableNames) {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
      } catch {
        // Ignore
      }
    }

    // Signup user
    const res = await request(app).post('/api/auth/register').send({
      email: 'testsearch@example.com',
      password: 'password123',
      name: 'Searcher',
    });
    userToken = res.body.token;

    // Seed database company
    await prisma.company.create({
      data: {
        id: 'reliance-ind',
        name: 'Reliance Industries',
        sector: 'Energy',
        industry: 'Oil & Gas',
        identifiers: {
          create: [
            { type: 'NSE', value: 'RELIANCE' }
          ]
        }
      }
    });
  });

  it('should return company by ID', async () => {
    const res = await request(app)
      .get('/api/companies/reliance-ind')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.company.name).toBe('Reliance Industries');
    expect(res.body.company.identifiers).toHaveLength(1);
    expect(res.body.company.identifiers[0].value).toBe('RELIANCE');
  });

  it('should search database for companies', async () => {
    const res = await request(app)
      .get('/api/companies/search?q=reliance')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.companies)).toBe(true);
    const reliance = res.body.companies.find((c: { id: string, name: string }) => c.id === 'reliance-ind');
    expect(reliance).toBeDefined();
    expect(reliance.name).toBe('Reliance Industries');
  });
});
