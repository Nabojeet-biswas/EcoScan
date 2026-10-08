import { AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface DangerZoneProps {
  children: React.ReactNode;
  className?: string;
}

export function DangerZone({ children, className }: DangerZoneProps) {
  return (
    <div className={clsx('bg-red-primary/10 border border-red-primary/30 rounded-2xl overflow-hidden', className)}>
      <div className="px-6 py-4 border-b border-red-primary/30 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-primary/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-primary" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold text-red-primary">Danger Zone</h3>
          <p className="text-red-primary/90 text-sm">These actions are irreversible. Please proceed with caution.</p>
        </div>
      </div>
      <div className="divide-y divide-red-primary/20">{children}</div>
    </div>
  );
}