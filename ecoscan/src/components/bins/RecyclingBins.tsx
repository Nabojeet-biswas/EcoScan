import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { CheckCircle2, XCircle, AlertTriangle, Leaf, Recycle, Trash2 } from 'lucide-react';
import type { WasteDetection } from '../../services/detectionService';
import { getBinColor } from '../../utils/wasteRules';
import { GlassCard, CornerMarkers, PulseRing } from '../common/GlassCard';

interface RecyclingBinsProps {
  detection: WasteDetection;
  onBinSelect: (binType: 'recyclable' | 'organic' | 'non-recyclable' | 'special') => void;
  selectedBin: 'recyclable' | 'organic' | 'non-recyclable' | 'special' | null;
  isSorting: boolean;
  binRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
  correctBin: 'recyclable' | 'organic' | 'non-recyclable' | 'special';
  showResult: boolean;
  resultCorrect: boolean | null;
}

const binsConfig = [
  { type: 'organic' as const, label: 'ORGANIC', desc: 'Food & biodegradable waste', icon: Leaf, color: '#20C878' },
  { type: 'recyclable' as const, label: 'RECYCLABLE', desc: 'Plastic, paper, metal, glass', icon: Recycle, color: '#3B82F6' },
  { type: 'non-recyclable' as const, label: 'NON-RECYCLABLE', desc: 'Waste that cannot be recycled', icon: Trash2, color: '#EF4444' },
];

export function RecyclingBins({ 
  detection, 
  onBinSelect, 
  selectedBin, 
  isSorting, 
  binRefs,
  correctBin,
  showResult,
  resultCorrect,
}: RecyclingBinsProps) {
  const isSpecial = detection.category === 'special';

  if (isSpecial) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-30"
      >
        <GlassCard variant="elevated" className="p-6 lg:p-8 border-amber-primary/20">
          <CornerMarkers color="amber" className="opacity-30" />
          
          <div className="relative z-10 flex items-start gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
              className="w-14 h-14 rounded-xl bg-amber-primary/10 border border-amber-primary/20 flex items-center justify-center flex-shrink-0"
            >
              <AlertTriangle className="w-7 h-7 text-amber-primary" aria-hidden="true" />
            </motion.div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-normal text-amber-primary">Special Disposal Required</h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-fg-muted text-sm mt-2 leading-relaxed"
              >
                {detection.name} contains hazardous materials and cannot go in regular bins.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-fg-muted text-sm mt-3 leading-relaxed"
              >
                Take to an e-waste collection point, battery drop-off at electronics stores, 
                or household hazardous waste facility.
              </motion.p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onBinSelect('special')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-amber-primary/10 border border-amber-primary/20 text-amber-primary font-medium flex items-center justify-center gap-2 transition-colors hover:bg-amber-primary/20"
          >
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            I Understand — Mark as Special Disposal
          </motion.button>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 35 }}
      className="fixed bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-30"
    >
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        {binsConfig.map((bin, index) => {
          const color = getBinColor(bin.type);
          const isSelected = selectedBin === bin.type;
          const isCorrectBin = bin.type === correctBin;
          const showCheck = showResult && isCorrectBin && resultCorrect === true;
          const showX = showResult && isSelected && resultCorrect === false;
          const isWrongSelection = showResult && isSelected && !isCorrectBin;

          return (
            <motion.div
              key={bin.type}
              ref={el => { binRefs.current.set(bin.type, el); }}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.08, type: 'spring', stiffness: 400, damping: 30 }}
              whileHover={!isSorting && !showResult ? { scale: 1.015, y: -3 } : {}}
              whileTap={!isSorting && !showResult ? { scale: 0.99 } : {}}
              className={clsx(
                'relative group cursor-pointer',
                isSelected && !showResult && 'ring-2 ring-offset-2 ring-offset-bg',
                isSelected && !showResult && `ring-[${color}]`,
              )}
            >
              <motion.button
                disabled={isSorting || showResult}
                onClick={() => !isSorting && !showResult && onBinSelect(bin.type)}
                className={clsx(
                  'w-full aspect-square relative rounded-[20px] overflow-hidden transition-all duration-300',
                  'flex flex-col items-center justify-center p-5 lg:p-6',
                  isSelected && !showResult 
                    ? `bg-[${color}]05 border-2 border-[${color}] shadow-[0_0_30px_${color}20]`
                    : 'bg-bg-surface border border-line hover:border-line-strong hover:bg-fg/5',
                  showResult && isCorrectBin
                    ? 'bg-green-primary/5 border-2 border-green-primary shadow-[0_0_30px_rgba(32,180,134,0.2)]'
                    : showResult && isWrongSelection
                    ? 'bg-red-primary/5 border-2 border-red-primary'
                    : ''
                )}
                style={{
                  backgroundColor: isSelected && !showResult ? `${color}05` : undefined,
                  borderColor: isSelected && !showResult ? color : undefined,
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isSorting && !showResult) {
                    e.preventDefault();
                    onBinSelect(bin.type);
                  }
                }}
              >
                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.span
                    animate={isSelected && !showResult ? { scale: [1, 1.05, 1] } : showCheck ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: showCheck ? 0.6 : 2, repeat: showCheck ? 0 : Infinity, ease: 'easeInOut' }}
                    className="text-5xl lg:text-6xl mb-3 filter drop-shadow-lg"
                    aria-hidden="true"
                  >
                    <bin.icon className="w-10 h-10 lg:w-12 lg:h-12 text-[${color}]" aria-hidden="true" />
                  </motion.span>
                  
                  <motion.h4
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                      'font-display text-lg lg:text-xl font-normal text-fg',
                      isSelected && `text-[${color}]`
                    )}
                  >
                    {bin.label}
                  </motion.h4>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-fg-muted text-sm mt-1 max-w-xs text-center"
                  >
                    {bin.desc}
                  </motion.p>
                </div>

                <motion.div
                  animate={isSelected && !showResult ? { scale: [1, 1.02, 1], opacity: [0.15, 0.35, 0.15] } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                  className={clsx(
                    'absolute inset-0 rounded-[20px] pointer-events-none',
                    isSelected && !showResult && `bg-gradient-to-br from-transparent via-[${color}]20 to-transparent`
                  )}
                />

                {isSelected && !showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-medium text-bg"
                    style={{ backgroundColor: color }}
                  >
                    DROP HERE
                  </motion.div>
                )}

                {showCheck && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center bg-green-primary/10"
                  >
                    <CheckCircle2 className="w-14 h-14 text-green-primary filter drop-shadow-lg" aria-hidden="true" />
                  </motion.div>
                )}

                {showX && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: 180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center bg-red-primary/10"
                  >
                    <XCircle className="w-14 h-14 text-red-primary filter drop-shadow-lg" aria-hidden="true" />
                  </motion.div>
                )}

                {showResult && isCorrectBin && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute -top-2 -right-2"
                    >
                      <PulseRing size={36} color="green" count={2} />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-primary/10 border border-green-primary/20 text-green-primary text-xs font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      Correct Bin
                    </motion.div>
                  </>
                )}

                {isWrongSelection && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-primary/10 border border-red-primary/20 text-red-primary text-xs font-medium"
                  >
                    <XCircle className="w-4 h-4" aria-hidden="true" />
                    Try {binsConfig.find(b => b.type === correctBin)?.label} Bin
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}