import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Telescope, LogOut, User as UserIcon } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "../../app/routes";
import { cn } from "../../utils/cn";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../../features/auth/AuthContext";

const NAV_ITEMS = [
  {
    path: ROUTES.HOME,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/research/hdfc-bank",
    label: "Research",
    icon: Telescope,
  },
];

function TopNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[rgba(7,9,13,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <NavLink
          to={ROUTES.HOME}
          className="group inline-flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-sm font-semibold text-[var(--color-text)] shadow-sm">
            N
          </span>
          <h1 className="text-lg font-semibold tracking-tight text-[var(--color-text)]">
            Nexora
          </h1>
        </NavLink>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-1 shadow-sm">
            {NAV_ITEMS.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== ROUTES.HOME &&
                  location.pathname.startsWith("/research"));

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-white/[0.08]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10 hidden sm:inline-block">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          <div className="h-6 w-px bg-[var(--color-border)]"></div>

          <NotificationBell />

          {user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <UserIcon className="h-5 w-5" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-soft)]">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-[var(--color-muted)] truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavigation;
