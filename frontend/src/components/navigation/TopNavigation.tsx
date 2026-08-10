import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BrainCircuit, LogOut } from "lucide-react";
import GlobalSearch from "../../features/search/components/GlobalSearch";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../../features/auth/AuthContext";
import { ROUTES } from "../../app/routes";

function TopNavigation() {
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
    <nav className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo & Core Links */}
        <div className="flex items-center gap-8">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--color-text)]">
              Nexora
            </span>
          </Link>
          <div className="hidden md:flex md:items-center md:gap-1">
            <NavLink
              to={ROUTES.HOME}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)] ${
                  isActive ? "bg-[var(--color-surface-soft)] text-[var(--color-text)]" : "text-[var(--color-body)]"
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 px-8 lg:px-16 flex justify-center">
          <GlobalSearch />
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-4">
          <NotificationBell />

          <div className="h-6 w-px bg-[var(--color-border)] mx-1"></div>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface-soft)] font-semibold text-[var(--color-accent)] transition-colors hover:ring-2 hover:ring-[var(--color-accent)]"
              >
                {(user.name || "U").charAt(0).toUpperCase()}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-soft)]">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{user.name}</p>
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
          ) : (
            <div className="h-9 w-9 rounded-full bg-[var(--color-surface-soft)] animate-pulse"></div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TopNavigation;
