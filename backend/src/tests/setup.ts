import { beforeAll, afterAll, beforeEach } from 'vitest';
import { env } from '../config/env.js';
import { prisma } from '../config/db.js';

// Ensure we are using the test database
process.env.DATABASE_URL = env.DATABASE_URL_TEST;

beforeAll(async () => {
  // Check if connected to test database (safety check)
  if (!process.env.DATABASE_URL?.includes('test')) {
    throw new Error('Tests must run against a test database!');
  }
});

// Removed global beforeEach to prevent parallel test conflicts

afterAll(async () => {
  await prisma.$disconnect();
});
