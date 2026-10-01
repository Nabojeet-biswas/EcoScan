import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
interface SplashScreenProps {
  onComplete: () => void;
}

const statusMessages = [
  'Initializing camera…',
  'Loading vision…',
  'Ready to scan',
];

const easing = [0.25, 1, 0.5, 1] as const;

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const animationCompleteRef = useRef(false);
  const skipRef = useRef(false);
  const sequenceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completeSplash = useCallback(() => {
    try {
      sessionStorage.setItem('ecoscan_splash_seen', 'true');
    } catch {
      // ignore
    }
    setShowSplash(false);
    onComplete();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (animationCompleteRef.current) return;
    animationCompleteRef.current = true;
    if (sequenceRef.current) clearTimeout(sequenceRef.current);
    completeSplash();
  }, [completeSplash]);

  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } catch {
      setReducedMotion(false);
    }
  }, []);

  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem('ecoscan_splash_seen');
      const urlParams = new URLSearchParams(window.location.search);
      const forceShow = urlParams.get('splash') === '1';
      if (hasSeen && !forceShow) {
        setShowSplash(false);
        onComplete();
        return;
      }
    } catch {
      // sessionStorage not available
    }
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = () => {
      if (!skipRef.current) {
        skipRef.current = true;
        handleSkip();
      }
    };
    const handleClick = () => {
      if (!skipRef.current) {
        skipRef.current = true;
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [handleSkip]);

  useEffect(() => {
    if (!showSplash || reducedMotion) return;

    let step = 0;
    const runSequence = () => {
      if (!showSplash) return;
      
      switch (step) {
        case 0:
          sequenceRef.current = setTimeout(() => {
            step = 1;
            setShowContent(true);
            runSequence();
          }, 100);
          break;
        case 1:
          sequenceRef.current = setTimeout(() => {
            step = 2;
            runSequence();
          }, 600);
          break;
        case 2:
          sequenceRef.current = setTimeout(() => {
            step = 3;
            runSequence();
          }, 600);
          break;
        case 3:
          sequenceRef.current = setTimeout(() => {
            step = 4;
            runSequence();
          }, 300);
          break;
        case 4:
          sequenceRef.current = setTimeout(() => {
            step = 5;
            runSequence();
          }, 1000);
          break;
        case 5:
          sequenceRef.current = setTimeout(() => {
            animationCompleteRef.current = true;
            if (showSplash) {
              completeSplash();
            }
          }, 300);
          break;
      }
    };

    runSequence();

    return () => {
      if (sequenceRef.current) clearTimeout(sequenceRef.current);
    };
  }, [showSplash, reducedMotion, completeSplash]);

  useEffect(() => {
    if (!showSplash || reducedMotion || !showContent) return;
    
    const statusInterval = setInterval(() => {
      setCurrentStatusIndex(prev => {
        const next = prev + 1;
        if (next >= statusMessages.length) {
          clearInterval(statusInterval);
          return prev;
        }
        return next;
      });
    }, 500);

    return () => clearInterval(statusInterval);
  }, [showSplash, reducedMotion, showContent]);

  useEffect(() => {
    if (!showSplash || reducedMotion || !showContent) return;
    
    let p = 0;
    const progressInterval = setInterval(() => {
      p += 1.5;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(progressInterval);
      }
    }, 20);

    return () => clearInterval(progressInterval);
  }, [showSplash, reducedMotion, showContent]);

  if (!showSplash) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.4, ease: easing } },
  } as const;

  const glowVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1.2, ease: easing } },
    breathe: { scale: [1, 1.05, 1], opacity: [0.08, 0.12, 0.08], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
  } as const;

  if (reducedMotion) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants as any}
          className="fixed inset-0 z-[100] bg-bg flex items-center justify-center"
          role="img"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-center px-6"
          >
            <Logo size={100} variant="full" />
            <motion.h1
              className="font-display text-4xl lg:text-5xl font-normal text-fg mt-6"
            >
              EcoScan
            </motion.h1>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait" onExitComplete={completeSplash}>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants as any}
        className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center"
        role="img"
        aria-hidden="true"
        style={{ height: '100dvh' }}
      >
        <div className="absolute inset-0" aria-hidden="true">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand/5 blur-[60px]"
            initial="hidden"
            animate={showContent ? 'visible' : 'hidden'}
            variants={glowVariants as any}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-brand/3 blur-[60px]"
            animate="breathe"
            variants={glowVariants as any}
          />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center px-6"
          animate={showContent ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Logo size={88} variant="full" />

          <motion.div
            className="relative w-24 h-24 mt-4"
            style={{ pointerEvents: 'none' }}
          >
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-brand/50 to-transparent"
              initial="hidden"
              animate={showContent ? 'visible' : 'hidden'}
              exit="exit"
            />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            initial="hidden"
            animate={showContent ? 'visible' : 'hidden'}
            style={{ pointerEvents: 'none' }}
          >
            <div className="absolute inset-0 border border-brand/20 rounded-full" />
          </motion.div>

          <motion.h1
            className="font-display text-4xl lg:text-5xl font-normal text-fg mt-8 tracking-tight"
          >
            {['E', 'c', 'o', 'S', 'c', 'a', 'n'].map((char, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.04, type: 'spring', stiffness: 400, damping: 30 }}>{char}</motion.span>
            ))}
          </motion.h1>

          <motion.div
            className="flex gap-2 mt-3 text-fg text-sm sm:text-base font-medium uppercase tracking-wider"
          >
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, type: 'spring', stiffness: 400, damping: 30 }}>SCAN.</motion.span>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.67, type: 'spring', stiffness: 400, damping: 30 }}>LEARN.</motion.span>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.79, type: 'spring', stiffness: 400, damping: 30 }} className="text-brand">SORT.</motion.span>
          </motion.div>

          <motion.div
            className="relative w-64 h-1.5 mt-10 rounded-full bg-fg/10 overflow-hidden"
            style={{ pointerEvents: 'none' }}
          >
            <motion.div
              className="absolute inset-0 h-full rounded-full bg-gradient-to-r from-brand to-brand-light"
              initial="hidden"
              animate={showContent ? 'visible' : 'hidden'}
              style={{ width: `${progress}%` }}
              transition={{ duration: 1.1, ease: easing }}
            />
          </motion.div>

          <motion.p
            className="text-fg-muted text-xs mt-4 min-h-[20px] font-mono"
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            {statusMessages[currentStatusIndex]}
          </motion.p>

          <motion.p
            className="text-fg-dim text-xs mt-8 opacity-60"
          >
            Tap or press any key to continue
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}