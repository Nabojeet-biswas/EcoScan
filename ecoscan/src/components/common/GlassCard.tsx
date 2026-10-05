import { motion, type HTMLMotionProps, type TargetAndTransition, type VariantLabels } from 'framer-motion';
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const MotionCard = motion.create(Card);

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'default' | 'elevated' | 'subtle' | 'outlined';
  className?: string;
  children: React.ReactNode;
  whileHover?: TargetAndTransition | VariantLabels;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = 'default', className, children, whileHover, ...props }, ref) => {
    const variants = {
      default: 'card',
      elevated: 'card-elevated',
      subtle: 'card-subtle',
      outlined: 'card',
    };

    return (
      <MotionCard
        ref={ref}
        className={cn(
          'block gap-0 overflow-visible rounded-[var(--radius-xl)] bg-transparent py-0 text-base ring-0',
          variants[variant],
          className
        )}
        whileHover={whileHover}
        {...props}
      >
        {children}
      </MotionCard>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export interface ScanLineProps {
  className?: string;
  speed?: number;
  color?: 'green' | 'cyan';
}

export function ScanLine({ className, speed = 3, color = 'green' }: ScanLineProps) {
  const colors = {
    green: 'from-transparent via-brand/60 to-transparent',
    cyan: 'from-transparent via-brand-light/60 to-transparent',
  };

  return (
    <div
      className={clsx(
        'absolute left-0 right-0 h-0.5 bg-gradient-to-r animate-scan-line',
        colors[color],
        'pointer-events-none',
        className
      )}
      style={{ animationDuration: `${speed}s` }}
      aria-hidden="true"
    />
  );
}

export interface CornerMarkersProps {
  className?: string;
  color?: 'green' | 'cyan' | 'white' | 'amber' | 'red';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CornerMarkers({ className, color = 'green', animated = false, size = 'md' }: CornerMarkersProps) {
  const colors = {
    green: 'border-brand/50',
    cyan: 'border-brand-light/50',
    white: 'border-fg/20',
    amber: 'border-amber-primary/50',
    red: 'border-red-primary/50',
  };

  const sizes = {
    sm: 'w-3 h-3 border-1.5',
    md: 'w-4 h-4 border-2',
    lg: 'w-5 h-5 border-2.5',
  };

  const borderColor = colors[color];
  const sizeClass = sizes[size];

  return (
    <>
      <motion.div
        className={clsx('absolute -top-[2px] -left-[2px] rounded-tl-[20px] border-b-0 border-r-0', borderColor, sizeClass, className)}
        animate={animated ? { borderColor: ['rgba(99,173,140,0.3)', 'rgba(99,173,140,0.7)', 'rgba(99,173,140,0.3)'] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        className={clsx('absolute -top-[2px] -right-[2px] rounded-tr-[20px] border-b-0 border-l-0', borderColor, sizeClass, className)}
        animate={animated ? { borderColor: ['rgba(99,173,140,0.3)', 'rgba(99,173,140,0.7)', 'rgba(99,173,140,0.3)'] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        aria-hidden="true"
      />
      <motion.div
        className={clsx('absolute -bottom-[2px] -left-[2px] rounded-bl-[20px] border-t-0 border-r-0', borderColor, sizeClass, className)}
        animate={animated ? { borderColor: ['rgba(99,173,140,0.3)', 'rgba(99,173,140,0.7)', 'rgba(99,173,140,0.3)'] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        aria-hidden="true"
      />
      <motion.div
        className={clsx('absolute -bottom-[2px] -right-[2px] rounded-br-[20px] border-t-0 border-l-0', borderColor, sizeClass, className)}
        animate={animated ? { borderColor: ['rgba(99,173,140,0.3)', 'rgba(99,173,140,0.7)', 'rgba(99,173,140,0.3)'] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
        aria-hidden="true"
      />
    </>
  );
}

export interface PulseRingProps {
  size?: number;
  color?: 'green' | 'cyan' | 'amber';
  count?: number;
  className?: string;
}

export function PulseRing({ size = 100, color = 'green', count = 2, className }: PulseRingProps) {
  const colors = {
    green: 'rgba(99, 173, 140, 0.3)',
    cyan: 'rgba(32, 180, 134, 0.3)',
    amber: 'rgba(184, 122, 0, 0.3)',
  };

  return (
    <div className={clsx('relative', className)} style={{ width: size, height: size }}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ border: `1.5px solid ${colors[color]}` }}
          initial={{ scale: 0.5, opacity: 0.4 }}
          animate={{ scale: [0.5, 1.5], opacity: [0.4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'green' | 'cyan' | 'amber' | 'red';
  className?: string;
  animated?: boolean;
}

export function ProgressBar({ value, max = 100, color = 'green', className, animated = true }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const colors = {
    green: 'from-brand to-brand-light',
    cyan: 'from-cyan-primary to-cyan-light',
    amber: 'from-amber-primary to-amber-light',
    red: 'from-red-primary to-red-light',
  };

  return (
    <div className={clsx('h-1.5 bg-fg/10 rounded-full overflow-hidden', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={animated ? { width: `${percentage}%` } : { width: `${percentage}%` }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${colors[color].replace('to', '')})` }}
      />
    </div>
  );
}

export { SplashScreen } from './SplashScreen';
