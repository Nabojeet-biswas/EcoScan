import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import type { WasteDetection } from '@/features/waste/types';

interface DetectionOverlayProps {
  detection: WasteDetection | null;
  isVisible: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const getCategoryColor = (cat: string) => {
  switch (cat) {
    case 'recyclable': return { border: 'blue-primary', bg: 'blue-primary', text: 'white', light: 'blue-light', dark: 'blue-light' };
    case 'organic': return { border: 'green-primary', bg: 'green-primary', text: 'eco-900', light: 'green-light', dark: 'green-light' };
    case 'non-recyclable': return { border: 'red-primary', bg: 'red-primary', text: 'white', light: 'red-light', dark: 'red-light' };
    case 'special': return { border: 'amber-primary', bg: 'amber-primary', text: 'eco-900', light: 'amber-light', dark: 'amber-light' };
    default: return { border: 'green-primary', bg: 'green-primary', text: 'eco-900', light: 'green-light', dark: 'green-light' };
  }
};

export function DetectionOverlay({ detection, isVisible, containerRef }: DetectionOverlayProps) {
  if (!detection || !isVisible) return null;

  const box = detection.boundingBox || { x: 0.25, y: 0.2, width: 0.5, height: 0.6 };
  const confidence = Math.round(detection.confidence * 100);
  const colors = getCategoryColor(detection.category);
  const [displayConfidence, setDisplayConfidence] = useState(0);

  useEffect(() => {
    setDisplayConfidence(0);
    const duration = 600;
    const steps = 30;
    const increment = confidence / steps;
    let current = 0;
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= confidence) {
        setDisplayConfidence(confidence);
        clearInterval(interval);
      } else {
        setDisplayConfidence(Math.round(current));
      }
    }, duration / steps);
    
    return () => clearInterval(interval);
  }, [confidence]);

  const labelTop = box.y <= 0.08;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.3 }}
        className="absolute pointer-events-none"
        style={{
          left: `${box.x * 100}%`,
          top: `${box.y * 100}%`,
          width: `${box.width * 100}%`,
          height: `${box.height * 100}%`,
        }}
        role="img"
        aria-label={`Detected ${detection.name} with ${confidence}% confidence`}
      >
        <motion.div
          animate={{ borderColor: ['rgba(32, 200, 120, 0.6)', 'rgba(32, 200, 120, 1)', 'rgba(32, 200, 120, 0.6)'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className={clsx(
            'absolute inset-0 border-2 rounded-lg',
            `border-${colors.border}`,
            'shadow-[0_0_20px_rgba(32,200,120,0.3)]'
          )}
        />
        
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -top-[4px] -left-[4px] w-3 h-3 border-2 border-t-0 border-l-0 rounded-tl-lg" style={{ borderColor: `var(--color-${colors.border})` }} />
          <div className="absolute -top-[4px] -right-[4px] w-3 h-3 border-2 border-t-0 border-r-0 rounded-tr-lg" style={{ borderColor: `var(--color-${colors.border})` }} />
          <div className="absolute -bottom-[4px] -left-[4px] w-3 h-3 border-2 border-b-0 border-l-0 rounded-bl-lg" style={{ borderColor: `var(--color-${colors.border})` }} />
          <div className="absolute -bottom-[4px] -right-[4px] w-3 h-3 border-2 border-b-0 border-r-0 rounded-br-lg" style={{ borderColor: `var(--color-${colors.border})` }} />
        </div>

        <div className={clsx(
          'absolute left-0 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap shadow-lg transition-all duration-300',
          `bg-${colors.bg} text-${colors.text}`,
          labelTop ? 'top-full mt-1' : '-top-7'
        )}>
          <motion.span
            key={displayConfidence}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          >
            {detection.name} {displayConfidence}%
          </motion.span>
        </div>

        {detection.category === 'special' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className={clsx(
              'absolute right-0 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap shadow-lg animate-pulse',
              `bg-amber-primary text-eco-900 dark:bg-amber-primary dark:text-eco-900`,
              labelTop ? 'top-full mt-1' : '-top-7'
            )}
          >
            ⚠ SPECIAL HANDLING
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}