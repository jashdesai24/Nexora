import { motion } from "framer-motion";
import { LayoutDashboard, Telescope } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { ROUTES } from "../../app/routes";
import { cn } from "../../utils/cn";
import NotificationBell from "./NotificationBell";

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

          <NotificationBell />
        </div>
      </div>
    </header>
  );
}

export default TopNavigation;
