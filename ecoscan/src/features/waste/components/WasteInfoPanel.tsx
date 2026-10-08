import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { X, Clock, Globe, Leaf, Recycle, AlertTriangle, Zap, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { GlassCard, ProgressBar } from '@/components/common/GlassCard';
import type { WasteDetection } from '@/features/waste/types';
import { getBinColor, getBinLabel, getBinIcon, getBinDescription } from '@/features/waste/utils/wasteRules';

interface WasteInfoPanelProps {
  detection: WasteDetection;
  onClose: () => void;
  onSort: (bin: 'recyclable' | 'organic' | 'non-recyclable' | 'special') => void;
  isMobile?: boolean;
}

const impactConfig = {
  Low: { color: 'success', label: 'Low', icon: Leaf, desc: 'Breaks down relatively quickly or easily recyclable' },
  Medium: { color: 'warning', label: 'Medium', icon: Globe, desc: 'Significant decomposition time. Proper recycling matters.' },
  High: { color: 'danger', label: 'High', icon: AlertTriangle, desc: 'Persists in environment for a very long time. Avoid when possible.' },
} as const;

const binColors = {
  recyclable: 'cyan' as const,
  organic: 'green' as const,
  'non-recyclable': 'red' as const,
  special: 'amber' as const,
};

function StatTile({ icon, label, value, color = 'green' }: { icon: React.ReactNode; label: string; value: string; color?: 'green' | 'cyan' | 'amber' | 'red' }) {
  const colorMap = {
    green: 'bg-brand/10',
    cyan: 'bg-cyan-primary/10',
    amber: 'bg-amber-primary/10',
    red: 'bg-red-primary/10',
  };
  return (
    <div className="rounded-xl border border-line bg-fg/5 p-3 sm:p-4">
      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', colorMap[color])}>
        {icon}
      </div>
      <p className="text-xs text-fg-dim mt-2">{label}</p>
      <p className="font-medium text-fg text-sm">{value}</p>
    </div>
  );
}

export function WasteInfoPanel({ detection, onClose, onSort, isMobile }: WasteInfoPanelProps) {
  const binColor = getBinColor(detection.bin);
  const binLabel = getBinLabel(detection.bin);
  const binIcon = getBinIcon(detection.bin);
  const impact = impactConfig[detection.environmentalImpact];
  const ImpactIcon = impact.icon;
  const isSpecial = detection.category === 'special';
  const binColorKey = binColors[detection.bin] || 'green';

  const bins = [
    { type: 'organic' as const, label: 'ORGANIC', desc: 'Food & biodegradable', icon: '🌱', color: '#20C878' },
    { type: 'recyclable' as const, label: 'RECYCLABLE', desc: 'Plastic, paper, metal, glass', icon: '♻️', color: '#3B82F6' },
    { type: 'non-recyclable' as const, label: 'NON-RECYCLABLE', desc: 'General waste', icon: '🗑️', color: '#EF4444' },
  ];

  if (isMobile) {
    return (
      <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
        <SheetContent
          side="bottom"
          aria-labelledby="waste-title"
          showCloseButton={false}
          className="max-h-[85vh] gap-0 overflow-hidden rounded-t-[22px] border-0 bg-bg p-0 shadow-none"
        >
          <div className="flex flex-col h-full bg-bg">
            <div className="flex items-center justify-center px-4 py-4 border-b border-line">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-10 h-1.5 rounded-full bg-fg/20"
              />
            </div>

            <GlassCard variant="elevated" className="flex-1 flex flex-col overflow-hidden relative rounded-none border-b-0">
              <div className="flex items-start justify-between p-4 lg:p-6 border-b border-line relative z-10">
                <div className="flex-1 min-w-0 pr-4">
                  <motion.h2
                    id="waste-title"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-2xl lg:text-3xl font-normal text-fg truncate"
                  >
                    {detection.name}
                  </motion.h2>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}>
                      <Badge variant="success" size="sm" dot>{Math.round(detection.confidence * 100)}% Confidence</Badge>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, type: 'spring' }}>
                      <Badge variant={impact.color} size="sm"><ImpactIcon className="w-3 h-3" /> {impact.label} Impact</Badge>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                      <Badge variant="ai" size="sm" dot><Zap className="w-3 h-3" /> AI</Badge>
                    </motion.div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-fg/5 text-fg-muted hover-solid flex-shrink-0"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: `${binColor}15`, border: `1px solid ${binColor}30` }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${binColor}25` }}>
                    <span className="text-3xl">{binIcon}</span>
                  </div>
                  <div>
                    <p className="text-xs text-fg-dim uppercase tracking-wider">Recommended Bin</p>
                    <p className="font-medium text-fg text-lg" style={{ color: binColor }}>{binLabel}</p>
                    <p className="text-fg-muted text-xs mt-0.5">{getBinDescription(detection.bin)}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <StatTile icon={<Globe className="w-4 h-4" />} label="Material" value={detection.material} color="cyan" />
                  <StatTile icon={<Clock className="w-4 h-4" />} label="Decomposition" value={detection.decompositionTime} color="amber" />
                  <StatTile icon={<ImpactIcon className="w-4 h-4" />} label="Impact" value={impact.label} color={impact.color === 'success' ? 'green' : impact.color === 'warning' ? 'amber' : 'red'} />
                  <StatTile icon={<Recycle className="w-4 h-4" />} label="Category" value={detection.category.replace('-', ' ')} color={binColorKey} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <p className="text-xs text-fg-dim uppercase tracking-wider">Description</p>
                  <p className="text-fg-muted text-sm leading-relaxed">{detection.description}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-2"
                >
                  <p className="text-xs text-fg-dim uppercase tracking-wider">AI Confidence</p>
                  <ProgressBar value={Math.round(detection.confidence * 100)} color="green" />
                  <p className="text-right text-fg-dim text-xs">{Math.round(detection.confidence * 100)}%</p>
                </motion.div>

                {isSpecial && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl border border-amber-primary/20 bg-amber-primary/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-primary/10 border border-amber-primary/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-primary" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-amber-primary text-sm">Special Disposal Required</p>
                        <p className="text-fg-muted text-xs mt-1">{detection.disposalMethod || detection.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isSpecial && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 rounded-xl bg-fg/5 border border-line"
                    >
                      <p className="text-xs text-fg-dim uppercase tracking-wider text-center mb-4">Drag the item to the correct bin</p>
                      <div className="grid grid-cols-3 gap-2" role="list" aria-label="Recycling bins">
                        {bins.map((bin) => (
                          <motion.button
                            key={bin.type}
                            onClick={() => onSort(bin.type)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={clsx(
                              'relative p-4 rounded-xl text-left border transition-all',
                              'group',
                              bin.type === detection.bin
                                ? `border-[${bin.color}] bg-[${bin.color}]10`
                                : 'border-line bg-fg/5 hover:border-line-strong'
                            )}
                            style={{ borderColor: bin.type === detection.bin ? bin.color : undefined }}
                            role="listitem"
                            aria-label={`Sort into ${bin.label} bin`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{bin.icon}</span>
                              <span className="font-medium text-fg text-xs" style={{ color: bin.type === detection.bin ? bin.color : 'inherit' }}>
                                {bin.label}
                              </span>
                            </div>
                            <p className="text-fg-muted text-[10px]">{bin.desc}</p>
                            {bin.type === detection.bin && (
                              <motion.div
                                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                                style={{ backgroundColor: bin.color }}
                              />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="grid grid-cols-3 gap-3"
                    >
                      <StatTile
                        icon={<Recycle className="w-4 h-4 text-brand" />}
                        label="Recyclable"
                        value={detection.bin === 'recyclable' ? 'Yes' : 'No'}
                        color={detection.bin === 'recyclable' ? 'green' : 'red'}
                      />
                      <StatTile
                        icon={<Leaf className="w-4 h-4 text-cyan-primary" />}
                        label="Compostable"
                        value={detection.bin === 'organic' ? 'Yes' : 'No'}
                        color={detection.bin === 'organic' ? 'green' : 'red'}
                      />
                      <StatTile
                        icon={<Shield className="w-4 h-4 text-amber-primary" />}
                        label="Special Care"
                        value={detection.category === 'special' ? 'Required' : 'Not needed'}
                        color={detection.category === 'special' ? 'amber' : 'green'}
                      />
                    </motion.div>
                  </>
                )}

                {isSpecial && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-2"
                  >
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={onClose}
                      leftIcon={<Globe className="w-4 h-4" />}
                    >
                      Learn Proper Disposal
                    </Button>
                  </motion.div>
                )}
              </div>
            </GlassCard>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }} modal={false}>
      <SheetContent
        side="right"
        aria-labelledby="waste-title"
        showCloseButton={false}
        overlayClassName="pointer-events-none bg-transparent backdrop-blur-0"
        className="data-[side=right]:inset-y-16 data-[side=right]:right-2 data-[side=right]:h-auto data-[side=right]:w-[min(22rem,calc(100vw-1rem))] data-[side=right]:sm:right-4 data-[side=right]:sm:w-80 data-[side=right]:lg:right-6 data-[side=right]:lg:w-96 data-[side=right]:sm:max-w-none gap-0 overflow-hidden border-0 bg-transparent p-0 text-fg shadow-none"
      >
        <GlassCard variant="elevated" className="flex flex-col h-full relative">
          <div className="flex items-start justify-between p-4 lg:p-6 border-b border-line relative z-10">
            <div className="flex-1 min-w-0">
              <motion.h2
                id="waste-title"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-2xl lg:text-3xl font-normal text-fg truncate"
              >
                {detection.name}
              </motion.h2>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}>
                  <Badge variant="success" size="sm" dot>{Math.round(detection.confidence * 100)}% Confidence</Badge>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, type: 'spring' }}>
                  <Badge variant={impact.color} size="sm"><ImpactIcon className="w-3 h-3" /> {impact.label} Impact</Badge>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                  <Badge variant="ai" size="sm" dot><Zap className="w-3 h-3" /> AI</Badge>
                </motion.div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-fg/5 text-fg-muted hover-solid flex-shrink-0"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: `${binColor}15`, border: `1px solid ${binColor}30` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${binColor}25` }}>
                <span className="text-3xl">{binIcon}</span>
              </div>
              <div>
                <p className="text-xs text-fg-dim uppercase tracking-wider">Recommended Bin</p>
                <p className="font-medium text-fg text-lg" style={{ color: binColor }}>{binLabel}</p>
                <p className="text-fg-muted text-xs mt-0.5">{getBinDescription(detection.bin)}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 gap-3"
            >
              <StatTile icon={<Globe className="w-4 h-4" />} label="Material" value={detection.material} color="cyan" />
              <StatTile icon={<Clock className="w-4 h-4" />} label="Decomposition" value={detection.decompositionTime} color="amber" />
              <StatTile icon={<ImpactIcon className="w-4 h-4" />} label="Impact" value={impact.label} color={impact.color === 'success' ? 'green' : impact.color === 'warning' ? 'amber' : 'red'} />
              <StatTile icon={<Recycle className="w-4 h-4" />} label="Category" value={detection.category.replace('-', ' ')} color={binColorKey} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <p className="text-xs text-fg-dim uppercase tracking-wider">Description</p>
              <p className="text-fg-muted text-sm leading-relaxed">{detection.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2"
            >
              <p className="text-xs text-fg-dim uppercase tracking-wider">AI Confidence</p>
              <ProgressBar value={Math.round(detection.confidence * 100)} color="green" />
              <p className="text-right text-fg-dim text-xs">{Math.round(detection.confidence * 100)}%</p>
            </motion.div>

            {isSpecial && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl border border-amber-primary/20 bg-amber-primary/5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-primary/10 border border-amber-primary/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-amber-primary text-sm">Special Disposal Required</p>
                    <p className="text-fg-muted text-xs mt-1">{detection.disposalMethod || detection.description}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {!isSpecial && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-xl bg-fg/5 border border-line"
                >
                  <p className="text-xs text-fg-dim uppercase tracking-wider text-center mb-4">Drag the item to the correct bin</p>
                  <div className="grid grid-cols-3 gap-2" role="list" aria-label="Recycling bins">
                    {bins.map((bin) => (
                      <motion.button
                        key={bin.type}
                        onClick={() => onSort(bin.type)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={clsx(
                          'relative p-4 rounded-xl text-left border transition-all',
                          'group',
                          bin.type === detection.bin
                            ? `border-[${bin.color}] bg-[${bin.color}]10`
                            : 'border-line bg-fg/5 hover:border-line-strong'
                        )}
                        style={{ borderColor: bin.type === detection.bin ? bin.color : undefined }}
                        role="listitem"
                        aria-label={`Sort into ${bin.label} bin`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{bin.icon}</span>
                          <span className="font-medium text-fg text-xs" style={{ color: bin.type === detection.bin ? bin.color : 'inherit' }}>
                            {bin.label}
                          </span>
                        </div>
                        <p className="text-fg-muted text-[10px]">{bin.desc}</p>
                        {bin.type === detection.bin && (
                          <motion.div
                            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                            style={{ backgroundColor: bin.color }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="grid grid-cols-3 gap-3"
                >
                  <StatTile
                    icon={<Recycle className="w-4 h-4 text-brand" />}
                    label="Recyclable"
                    value={detection.bin === 'recyclable' ? 'Yes' : 'No'}
                    color={detection.bin === 'recyclable' ? 'green' : 'red'}
                  />
                  <StatTile
                    icon={<Leaf className="w-4 h-4 text-cyan-primary" />}
                    label="Compostable"
                    value={detection.bin === 'organic' ? 'Yes' : 'No'}
                    color={detection.bin === 'organic' ? 'green' : 'red'}
                  />
                  <StatTile
                    icon={<Shield className="w-4 h-4 text-amber-primary" />}
                    label="Special Care"
                    value={detection.category === 'special' ? 'Required' : 'Not needed'}
                    color={detection.category === 'special' ? 'amber' : 'green'}
                  />
                </motion.div>
              </>
            )}

            {isSpecial && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-2"
              >
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={onClose}
                  leftIcon={<Globe className="w-4 h-4" />}
                >
                  Learn Proper Disposal
                </Button>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </SheetContent>
    </Sheet>
  );
}