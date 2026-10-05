import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ThemeOption = 'light' | 'dark' | 'system';

const themeOptions: { value: ThemeOption; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="size-5" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="size-5" /> },
  { value: 'system', label: 'System', icon: <Monitor className="size-5" /> },
];

export function SettingsMenu() {
  const { theme, setTheme, mounted } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (!mounted) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className="p-2 rounded-xl glass text-fg-muted hover:text-fg hover:bg-white/10 dark:hover:bg-black/10 transition-transform hover:scale-105 active:scale-95"
        aria-label="Settings"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 border-0 bg-transparent p-0 shadow-none ring-0"
      >
        <GlassCard variant="elevated" className="p-2">
          <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-fg-dim uppercase tracking-wider">
            Theme
          </DropdownMenuLabel>
          <div className="space-y-1">
            {themeOptions.map(({ value, label, icon }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => {
                  setTheme(value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                  theme === value
                    ? 'bg-brand/10 text-brand focus:bg-brand/10 focus:text-brand'
                    : 'text-fg hover:bg-white/10 focus:bg-white/10 focus:text-fg dark:hover:bg-black/10 dark:focus:bg-black/10'
                )}
                role="menuitemradio"
                aria-checked={theme === value}
              >
                <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
                <span className="flex-1 text-left">{label}</span>
                {theme === value && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="flex-shrink-0 text-brand"
                    aria-hidden="true"
                  >
                    <Check className="size-5" />
                  </motion.span>
                )}
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator className="my-2 bg-line-strong" />
          <DropdownMenuItem
            onClick={() => {
              localStorage.removeItem('ecoscan_splash_seen');
              window.location.search = '?splash=1';
              window.location.reload();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-fg-muted hover:text-fg hover:bg-white/10 focus:bg-white/10 focus:text-fg dark:hover:bg-black/10 dark:focus:bg-black/10 transition-colors"
          >
            <svg className="size-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Replay Splash</span>
          </DropdownMenuItem>
        </GlassCard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
