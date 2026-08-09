import { useState, useEffect, useRef } from "react";
import { Bell, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { getUserNotifications, markNotificationAsRead, type Notification } from "../../domains/notification";
import { cn } from "../../utils/cn";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const data = await getUserNotifications();
        if (isMounted) setNotifications(data);
      } catch (e) {
        console.error("Failed to fetch notifications", e);
      }
    }

    void loadData();

    const interval = setInterval(() => {
      void loadData();
    }, 30000); // poll every 30s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (e) {
      console.error("Failed to mark read", e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-[var(--color-surface-soft)]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3 bg-[var(--color-surface-soft)]">
            <h3 className="font-semibold text-sm text-[var(--color-text)]">Notifications</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-[var(--color-muted)]">
                You're all caught up!
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "block p-4 transition-colors hover:bg-[var(--color-surface-soft)]",
                      !n.isRead ? "bg-red-500/[0.03]" : ""
                    )}
                    onClick={() => handleRead(n.id, n.isRead)}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 shrink-0">
                        {n.type === "THESIS_WEAKENED" ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                            <Bell className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", !n.isRead ? "text-[var(--color-text)]" : "text-[var(--color-muted)]")}>
                          {n.title}
                        </p>
                        <p className="mt-1 text-xs text-[var(--color-muted)] line-clamp-2">
                          {n.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                          {n.link && (
                            <Link
                              to={n.link}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors"
                            >
                              Review <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                      {!n.isRead && (
                        <div className="mt-2 shrink-0">
                          <span className="block h-2 w-2 rounded-full bg-red-500" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
