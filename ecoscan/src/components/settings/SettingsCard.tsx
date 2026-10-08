import { clsx } from 'clsx';

interface SettingsCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function SettingsCard({ children, className, title, description }: SettingsCardProps) {
  return (
    <div className={clsx('bg-bg-surface border border-line rounded-2xl overflow-hidden', className)}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-line">
          {title && <h3 className="font-semibold text-fg">{title}</h3>}
          {description && <p className="mt-1 text-fg-dim text-sm">{description}</p>}
        </div>
      )}
      <div className="divide-y divide-line">{children}</div>
    </div>
  );
}

export function SettingRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4', className)}>
      {children}
    </div>
  );
}

SettingRow.displayName = 'SettingRow';
SettingsCard.displayName = 'SettingsCard';