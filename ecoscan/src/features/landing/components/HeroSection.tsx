import { motion } from 'framer-motion';
import { MousePointer2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CornerMarkers, ScanLine } from '@/components/common/GlassCard';
import { Logo } from '@/components/common/Logo';
import { clsx } from 'clsx';

interface HeroSectionProps {
  onScanClick: () => void;
  mode: 'ai' | 'demo';
}

export function HeroSection({ onScanClick, mode }: HeroSectionProps) {
  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg pt-14 sm:pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-brand-light/5" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='currentColor' fill-opacity='0.4'/%3E%3C/g%3E%3C/svg%3E")` }} aria-hidden="true" />

      <div className="relative z-10 container px-4 py-12 sm:py-20 lg:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="lg:pl-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
              >
                <Badge variant="ai" size="sm" className="mb-6 w-fit">
                  <Sparkles className="w-3 h-3 mr-1.5" aria-hidden="true" />
                  {mode === 'ai' ? 'MODE' : 'DEMO MODE'}
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.18, ease: [0.25, 1, 0.5, 1] }}
                className="font-display text-4xl font-normal leading-[1.05] tracking-tight text-fg text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                See what your
                <br />
                <span className="text-brand">waste becomes.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.26, ease: [0.25, 1, 0.5, 1] }}
                className="mt-6 w-full max-w-[36rem] text-lg leading-relaxed text-fg-muted text-balance lg:text-xl"
              >
                Scan an object. Understand its impact. Sort it right.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.34, ease: [0.25, 1, 0.5, 1] }}
                className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-start sm:gap-4"
              >
                <Button
                  variant="primary"
                  size="xl"
                  onClick={onScanClick}
                  rightIcon={<MousePointer2 className="w-5 h-5" />}
                  className="w-full sm:w-auto"
                >
                  Start Scanning
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={onScanClick}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Try Demo
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.42, ease: [0.25, 1, 0.5, 1] }}
                className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-fg-muted sm:mt-16 sm:gap-8 sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand" aria-hidden="true" />
                  <span>Privacy-first processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-light" aria-hidden="true" />
                  <span>Instant results</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-primary" aria-hidden="true" />
                  <span>9+ waste types</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, type: 'spring', stiffness: 400, damping: 30 }}
              className="relative mx-auto w-full max-w-[32rem]"
            >
              <div className="relative mx-auto aspect-square w-full max-w-[24rem] sm:max-w-[28rem] lg:mx-0 lg:max-w-[32rem]">
                <div className={clsx('scanner-frame', 'relative aspect-square w-full')}>
                  <CornerMarkers color="green" animated size="lg" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-4 text-fg/40">
                      <div className="flex items-center gap-3">
                        <Logo size={56} />
                      </div>
                      <div className="text-xs uppercase tracking-widest text-brand/50 font-medium">
                        Ready to scan
                      </div>
                    </div>
                  </div>
                  <ScanLine color="green" speed={3.5} className="pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}