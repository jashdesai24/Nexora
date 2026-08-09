import type { Notification } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getUserNotifications(): Promise<Notification[]> {
  const token = localStorage.getItem("nexora_token");
  if (!token) return [];

  const response = await fetch(`${API_BASE}/api/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) return [];
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
  const token = localStorage.getItem("nexora_token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return response.json();
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const token = localStorage.getItem("nexora_token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${API_BASE}/api/notifications/read-all`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read");
  }
}
