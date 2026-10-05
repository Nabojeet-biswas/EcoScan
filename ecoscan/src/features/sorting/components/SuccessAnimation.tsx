import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { CheckCircle, XCircle, Sparkles, Shield, Recycle, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GlassCard } from '@/components/common/GlassCard';
import type { WasteDetection } from '@/features/waste/types';
import { getBinLabel, getBinDescription } from '@/features/waste/utils/wasteRules';

interface SuccessAnimationProps {
  detection: WasteDetection;
  isCorrect: boolean;
  pointsEarned: number;
  onContinue: () => void;
  onRetry?: () => void;
}

const binEmojis = {
  recyclable: '♻️',
  organic: '🌱',
  'non-recyclable': '🗑️',
  special: '⚠️',
};

function Particle({ delay, color }: { delay: number; color: string }) {
  const x = (Math.random() - 0.5) * 140;
  const y = -80 - Math.random() * 120;
  const rotation = Math.random() * 360;
  const size = 4 + Math.random() * 8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 0, rotate: 0, scale: 0 }}
      animate={{ opacity: 0, y, x, rotate: rotation, scale: 1 }}
      transition={{ 
        delay, 
        duration: 1.2 + Math.random() * 0.5, 
        ease: 'easeOut',
        opacity: { duration: 1, ease: 'easeOut' }
      }}
      className="absolute top-1/2 left-1/2"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
      aria-hidden="true"
    />
  );
}

export function SuccessAnimation({ detection, isCorrect, pointsEarned, onContinue, onRetry }: SuccessAnimationProps) {
  const binEmoji = binEmojis[detection.bin as keyof typeof binEmojis] || '🗑️';
  const binLabel = getBinLabel(detection.bin);
  const binDesc = getBinDescription(detection.bin);

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        aria-labelledby="result-title"
        showCloseButton={false}
        className="w-full max-w-[28rem] gap-0 border-0 bg-transparent p-0 text-fg ring-0 shadow-none sm:max-w-[28rem]"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="w-full max-w-[28rem]"
        >
          <GlassCard variant="elevated" className="p-6 lg:p-8 relative overflow-hidden">
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 500, damping: 25 }}
                className={clsx(
                  'w-18 h-18 rounded-xl flex items-center justify-center mx-auto mb-5',
                  isCorrect ? 'bg-green-primary/10 border-2 border-green-primary' : 'bg-amber-primary/10 border-2 border-amber-primary'
                )}
              >
                {isCorrect ? (
                  <CheckCircle className="w-10 h-10 text-green-primary" aria-hidden="true" />
                ) : (
                  <XCircle className="w-10 h-10 text-amber-primary" aria-hidden="true" />
                )}
              </motion.div>

              {isCorrect && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-80 h-80 rounded-full border border-green-primary/20 animate-pulse-ring" aria-hidden="true" />
                  <div className="absolute inset-10 rounded-full border border-green-primary/15 animate-pulse-ring" style={{ animationDelay: '0.6s' }} aria-hidden="true" />
                </motion.div>
              )}

              <motion.h2
                id="result-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isCorrect ? 0.25 : 0.2 }}
                className={clsx('font-display text-2xl lg:text-3xl font-normal mb-3', isCorrect ? 'text-green-primary' : 'text-amber-primary')}
              >
                {isCorrect ? 'Correct Sorting' : 'Not Quite Right'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isCorrect ? 0.3 : 0.25 }}
                className="mx-auto mb-7 max-w-[24rem] text-base leading-relaxed text-fg-muted"
              >
                {isCorrect 
                  ? `Excellent! ${detection.name} belongs in the ${binLabel.toLowerCase()} bin.`
                  : `${detection.name} is generally ${detection.category.replace('-', ' ')}. Try the ${binLabel.toLowerCase()} bin.`
                }
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: isCorrect ? 0.35 : 0.3, type: 'spring', stiffness: 400, damping: 25 }}
                className={clsx(
                  'inline-flex items-center gap-4 px-5 py-3.5 rounded-xl mb-7',
                  isCorrect ? 'bg-green-primary/10 border border-green-primary/20' : 'bg-amber-primary/10 border border-amber-primary/20'
                )}
              >
                <span className="text-3xl" aria-hidden="true">{isCorrect ? '🌱' : '📚'}</span>
                <div className="text-left">
                  <p className={clsx('text-sm font-medium', isCorrect ? 'text-green-primary' : 'text-amber-primary')}>
                    {isCorrect ? `+${pointsEarned} Eco Points` : 'No points earned'}
                  </p>
                  <p className="text-fg-muted text-xs mt-0.5">
                    {isCorrect ? 'Keep up the great work!' : 'Try again to earn points'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isCorrect ? 0.4 : 0.35 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                {onRetry && !isCorrect && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onRetry}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Try Again
                  </Button>
                )}
                <Button
                  variant={isCorrect ? 'primary' : 'secondary'}
                  className="flex-1"
                  onClick={onContinue}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  {isCorrect ? 'Next Scan' : 'Next Item'}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isCorrect ? 0.5 : 0.4 }}
                className="mt-7 p-4 rounded-xl bg-bg-elevated border border-line"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl" aria-hidden="true">{binEmoji}</span>
                  <div className="text-left">
                    <p className="font-medium text-fg text-sm">
                      {binLabel} Bin
                    </p>
                    <p className="text-fg-muted text-xs">{binDesc}</p>
                  </div>
                </div>
                <p className="text-fg-muted text-sm leading-relaxed">
                  {detection.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="grid grid-cols-1 gap-3 border-t border-line pt-4 sm:grid-cols-3"
              >
                <div className="p-3 rounded-xl bg-fg/5 border border-line text-center">
                  <Recycle className="w-5 h-5 text-brand mx-auto mb-1" aria-hidden="true" />
                  <p className="text-xs text-fg-dim">Recyclable</p>
                  <p className="font-semibold text-fg">{detection.bin === 'recyclable' ? 'Yes' : 'No'}</p>
                </div>
                <div className="p-3 rounded-xl bg-fg/5 border border-line text-center">
                  <Leaf className="w-5 h-5 text-green-primary mx-auto mb-1" aria-hidden="true" />
                  <p className="text-xs text-fg-dim">Compostable</p>
                  <p className="font-semibold text-fg">{detection.bin === 'organic' ? 'Yes' : 'No'}</p>
                </div>
                <div className="p-3 rounded-xl bg-fg/5 border border-line text-center">
                  <Shield className="w-5 h-5 text-amber-primary mx-auto mb-1" aria-hidden="true" />
                  <p className="text-xs text-fg-dim">Special Care</p>
                  <p className="font-semibold text-fg">{detection.category === 'special' ? 'Required' : 'Not needed'}</p>
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {isCorrect && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {[...Array(16)].map((_, i) => (
                    <Particle key={i} delay={i * 0.025} color={['#3F7D58', '#20B486', '#35C997', '#EAF1EB'][Math.floor(Math.random() * 4)]} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}