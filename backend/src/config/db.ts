import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

import { env } from './env.js';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: env.NODE_ENV === 'test' ? env.DATABASE_URL_TEST : env.DATABASE_URL,
    },
  },
});

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
