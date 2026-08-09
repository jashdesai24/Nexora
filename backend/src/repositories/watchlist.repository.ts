import { prisma } from '../config/db.js';

export class WatchlistRepository {
  async addToWatchlist(userId: string, companyId: string) {
    return prisma.watchlist.upsert({
      where: {
        userId_companyId: {
          userId,
          companyId
        }
      },
      update: {},
      create: {
        userId,
        companyId
      }
    });
  }

  async removeFromWatchlist(userId: string, companyId: string) {
    return prisma.watchlist.delete({
      where: {
        userId_companyId: {
          userId,
          companyId
        }
      }
    });
  }

  async getUserWatchlist(userId: string) {
    const watchlist = await prisma.watchlist.findMany({
      where: { userId },
      include: {
        company: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return watchlist.map(w => w.company);
  }
}

export const watchlistRepository = new WatchlistRepository();
