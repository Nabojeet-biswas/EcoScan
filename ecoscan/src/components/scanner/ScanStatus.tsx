import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Sparkles, Zap, CheckCircle2, Camera, AlertTriangle } from 'lucide-react';

type ScanStatusType = 'idle' | 'scanning' | 'detecting' | 'detected' | 'error';

interface ScanStatusProps {
  status: ScanStatusType;
  className?: string;
}

const statusConfig = {
  idle: { 
    text: 'Scanner Ready', 
    subtext: 'Point camera at waste object',
    icon: Sparkles,
    color: 'green',
  },
  scanning: { 
    text: 'Capturing Frame', 
    subtext: 'Preparing image for analysis',
    icon: Camera,
    color: 'green',
  },
  detecting: { 
    text: 'Analyzing Object', 
    subtext: 'Processing...',
    icon: Zap,
    color: 'cyan',
  },
  detected: { 
    text: 'Object Detected', 
    subtext: 'Displaying results',
    icon: CheckCircle2,
    color: 'green',
  },
  error: { 
    text: 'Error', 
    subtext: 'Try again or use demo mode',
    icon: AlertTriangle,
    color: 'red',
  },
};

export function ScanStatus({ status, className }: ScanStatusProps) {
  const config = statusConfig[status];
  const isActive = status === 'scanning' || status === 'detecting';
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx('flex flex-col items-center gap-1.5 pointer-events-none', className)}
    >
      <motion.div
        key={status}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex flex-col items-center gap-1"
      >
        <div className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border',
          status === 'error' 
            ? 'bg-red-primary/20 border-red-primary/30 text-red-light dark:bg-red-primary/20 dark:border-red-primary/30 dark:text-red-light' 
            : isActive
            ? 'bg-brand/20 border-brand/30 text-brand'
            : 'bg-fg/5 border-line text-fg'
        )}>
          {isActive && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
              aria-hidden="true"
            />
          )}
          {!isActive && status !== 'error' && (
            <Icon className={clsx('w-4 h-4', 
              status === 'detected' && 'text-brand',
              status === 'idle' && 'text-brand'
            )} />
          )}
          {status === 'error' && <Icon className="w-4 h-4 text-red-light dark:text-red-light" />}
          <span className="font-medium text-sm">{config.text}</span>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-fg-muted text-xs max-w-xs text-center"
        >
          {config.subtext}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}