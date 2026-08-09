import { prisma } from '../config/db.js';

export interface CreateNotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
}

export class NotificationRepository {
  async createNotification(data: CreateNotificationPayload) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        link: data.link,
      }
    });
  }

  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to recent 50
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      throw new Error("Unauthorized or not found");
    }

    return prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }
}

export const notificationRepository = new NotificationRepository();
