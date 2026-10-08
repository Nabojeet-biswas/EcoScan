import { clsx } from 'clsx';
import { NavLink, useLocation } from 'react-router';
import { SECTIONS, GROUPS } from '@/context/SettingsTypes';
import * as Icons from 'lucide-react';

export function SettingsNav() {
  const location = useLocation();

  return (
    <nav aria-label="Settings sections">
      <ul className="space-y-1" role="list">
        {GROUPS.map((group) => {
          const groupSections = SECTIONS.filter((s) => s.group === group);
          if (groupSections.length === 0) return null;

          return (
            <li key={group} className="space-y-1">
              <span className="px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-fg-dim">
                {group}
              </span>
              {groupSections.map((section) => {
                const Icon = Icons[section.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> | undefined;
                const isActive = location.pathname === `/settings/${section.key}`;
                return (
                  <NavLink
                    key={section.key}
                    to={`/settings/${section.key}`}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface',
                        'hover-solid',
                        isActive
                          ? 'bg-brand/15 text-brand relative'
                          : 'text-fg-dim'
                      )
                    }
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {Icon && <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />}
                    <span className="truncate">{section.label}</span>
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                        style={{ backgroundColor: 'var(--color-brand)' }}
                        aria-hidden="true"
                      />
                    )}
                  </NavLink>
                );
              })}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}