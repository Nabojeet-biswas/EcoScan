import { NavLink } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { SECTIONS, GROUPS } from '@/context/SettingsTypes';
import { clsx } from 'clsx';
import * as Icons from 'lucide-react';

interface SettingsIndexProps {
  onNavigate?: (path: string) => void;
}

export function SettingsIndex({ onNavigate }: SettingsIndexProps) {
  const handleNavigate = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-normal tracking-tight text-fg">Settings</h1>
        <p className="text-fg-muted">Customize how EcoScan works for you</p>
      </header>

      {GROUPS.map((group) => {
        const groupSections = SECTIONS.filter((s) => s.group === group);
        if (groupSections.length === 0) return null;

        return (
          <section key={group} className="space-y-3">
            <h2 className="px-1 text-[10px] font-medium uppercase tracking-wider text-fg-dim">{group}</h2>
            <div className="space-y-2">
              {groupSections.map((section) => {
                const Icon = Icons[section.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> | undefined;
                return (
                  <NavLink
                    key={section.key}
                    to={`/settings/${section.key}`}
                    onClick={() => handleNavigate(`/settings/${section.key}`)}
                    className={clsx(
                      'flex items-center gap-4 px-4 py-4 rounded-2xl bg-bg-surface border border-line',
                      'hover-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface'
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center flex-shrink-0 text-white">
                      {Icon && <Icon className="w-6 h-6" aria-hidden="true" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-fg truncate">{section.label}</h3>
                      <p className="text-fg-dim text-sm mt-0.5 truncate">{section.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-fg-dim flex-shrink-0" aria-hidden="true" />
                  </NavLink>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}