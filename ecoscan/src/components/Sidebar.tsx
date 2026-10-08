import { NavLink, useLocation } from "react-router";
import { Home, Rss, Settings } from "lucide-react";
import { clsx } from "clsx";
import { useSidebar } from "@/context/SidebarContext";
import { forwardRef } from "react";
import { HamburgerButton } from "@/components/HamburgerButton";

const mainNavItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/feed", label: "Feed", icon: Rss },
] as const;

const settingsItem = { path: "/settings", label: "Settings", icon: Settings } as const;

interface SidebarProps {
  className?: string;
  "aria-label"?: string;
  role?: string;
  "aria-hidden"?: boolean;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ className, "aria-label": ariaLabel, role, "aria-hidden": ariaHidden, ...props }, ref) => {
    const location = useLocation();
    const { isOpen, close } = useSidebar();

    const prefersReducedMotion = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const transitionClass = prefersReducedMotion
      ? ""
      : "transition-transform duration-250 ease-out";

    const handleNavClick = () => {
      close();
    };

    const isSettingsActive = location.pathname.startsWith("/settings");

    return (
      <aside
        ref={ref}
        id="sidebar-drawer"
        className={clsx(
          "fixed left-0 top-0 z-50 w-[260px] h-dvh flex flex-col border-r border-line-strong bg-bg-surface",
          transitionClass,
          className
        )}
        aria-label={ariaLabel}
        role={role}
        aria-hidden={ariaHidden}
        {...props}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-3 pb-3 border-b border-line shrink-0">
            <span className="font-semibold text-fg">EcoScan</span>
            <HamburgerButton isOpen={isOpen} onClick={close} aria-controls="sidebar-drawer" />
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pt-4 shrink-0" aria-label="Main navigation">
            <ul className="space-y-1" role="list">
              {mainNavItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <NavLink
                      to={path}
                      onClick={handleNavClick}
                      className={({ isActive: active }) =>
                        clsx(
                          "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface hover-solid",
                          active
                            ? "bg-brand/15 text-brand"
                            : "text-fg-dim"
                        )
                      }
                      aria-label={label}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span className="truncate font-medium">{label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-line pt-3 pb-[env(safe-area-inset-bottom,1rem)] px-3">
            <NavLink
              to={settingsItem.path}
              onClick={handleNavClick}
              className={({ isActive: active }) =>
                clsx(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface hover-solid",
                  active || isSettingsActive
                    ? "bg-brand/15 text-brand"
                    : "text-fg-dim"
                )
              }
              aria-label={settingsItem.label}
              aria-current={isSettingsActive ? "page" : undefined}
            >
              <settingsItem.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <span className="truncate font-medium">{settingsItem.label}</span>
            </NavLink>
          </div>
        </div>
      </aside>
    );
  }
);

Sidebar.displayName = "Sidebar";