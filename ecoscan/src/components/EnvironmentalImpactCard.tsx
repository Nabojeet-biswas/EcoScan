import { motion } from 'framer-motion';
import { Leaf, Globe, Trash2, Recycle, Clock, AlertTriangle, Zap } from 'lucide-react';
import { GlassCard, CornerMarkers, ProgressBar } from './common/GlassCard';
import { clsx } from 'clsx';
import type { WasteDetection } from '../services/detectionService';

interface EnvironmentalImpactCardProps {
  detection: WasteDetection;
  className?: string;
}

const impactConfig = {
  Low: { color: 'green', icon: Leaf, label: 'Low Environmental Impact', desc: 'This material breaks down relatively quickly or is easily recyclable.' },
  Medium: { color: 'amber', icon: Globe, label: 'Medium Environmental Impact', desc: 'This material takes significant time to decompose. Proper recycling is important.' },
  High: { color: 'red', icon: AlertTriangle, label: 'High Environmental Impact', desc: 'This material persists in the environment for a very long time. Avoid when possible.' },
};

const categoryInfo = {
  recyclable: { icon: Recycle, label: 'Recyclable', color: 'cyan', desc: 'Can be processed and made into new products' },
  organic: { icon: Leaf, label: 'Organic', color: 'green', desc: 'Biodegradable - compost when possible' },
  'non-recyclable': { icon: Trash2, label: 'General Waste', color: 'red', desc: 'Cannot be recycled in most programs' },
  special: { icon: AlertTriangle, label: 'Special Disposal', color: 'amber', desc: 'Requires special handling at designated facilities' },
};

function DecompositionTimeline({ time }: { time: string }) {
  const parseTime = (str: string) => {
    const years = str.match(/(\d+)[\s-]*(year|yr)/i);
    const weeks = str.match(/(\d+)[\s-]*(week)/i);
    const months = str.match(/(\d+)[\s-]*(month)/i);
    const million = str.match(/million/i);
    
    if (million) return { value: 1000000, unit: 'years', label: '1M+ years' };
    if (years) return { value: parseInt(years[1]), unit: 'years', label: str };
    if (months) return { value: parseInt(months[1]) * 4, unit: 'weeks', label: str };
    if (weeks) return { value: parseInt(weeks[1]), unit: 'weeks', label: str };
    return { value: 0, unit: 'unknown', label: str };
  };

  const { value, unit, label } = parseTime(time);
  const isLong = unit === 'years' && value > 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-fg/5 flex items-center justify-center">
          <Clock className="w-5 h-5 text-fg-muted" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs text-fg-dim uppercase tracking-wider">Decomposition Time</p>
          <p className="font-display text-2xl lg:text-3xl font-normal text-fg">{label}</p>
        </div>
      </div>
      
      <div className="relative h-2 bg-fg/10 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 bottom-0 rounded-full"
          style={{ 
            width: isLong ? '95%' : Math.max(5, Math.min(95, (value / 500) * 100)) + '%',
            background: isLong 
              ? 'linear-gradient(90deg, var(--color-red-primary), var(--color-amber-primary))' 
              : 'linear-gradient(90deg, var(--color-brand), var(--color-brand-light))'
          }}
        />
        {isLong && (
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-primary"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            aria-hidden="true"
          />
        )}
      </div>
      
      <div className="flex justify-between text-xs text-fg-dim">
        <span>Immediate</span>
        <span>{isLong ? 'Centuries' : `${value} ${unit}`}</span>
      </div>
    </div>
  );
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  subLabel, 
  color = 'brand',
  delay = 0
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  subLabel: string;
  color?: 'brand' | 'cyan' | 'amber' | 'green' | 'red';
  delay?: number;
}) {
  const colorMap = {
    brand: 'bg-brand/10',
    cyan: 'bg-cyan-primary/10',
    amber: 'bg-amber-primary/10',
    green: 'bg-green-primary/10',
    red: 'bg-red-primary/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + delay * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <GlassCard variant="subtle" className="p-5 lg:p-6 text-center">
        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform', colorMap[color])}>
          {icon}
        </div>
        <p className="text-xs text-fg-dim uppercase tracking-wider mb-1">{label}</p>
        <p className="font-display text-2xl lg:text-3xl font-normal text-fg mt-1">{value}</p>
        <p className="text-fg-dim text-xs mt-1">{subLabel}</p>
      </GlassCard>
    </motion.div>
  );
}

export function EnvironmentalImpactCard({ detection, className }: EnvironmentalImpactCardProps) {
  const impact = impactConfig[detection.environmentalImpact];
  const catInfo = categoryInfo[detection.bin];
  const ImpactIcon = impact.icon;
  const CatIcon = catInfo.icon;
  
  const getImpactScore = () => {
    switch (detection.environmentalImpact) {
      case 'Low': return 20;
      case 'Medium': return 55;
      case 'High': return 85;
    }
  };

  const getRecyclabilityScore = () => {
    switch (detection.bin) {
      case 'recyclable': return 90;
      case 'organic': return 70;
      case 'special': return 30;
      case 'non-recyclable': return 10;
    }
  };

  return (
    <div className={clsx('space-y-7', className)}>
      <GlassCard variant="elevated" className="p-6 lg:p-8 relative overflow-hidden">
        <CornerMarkers color={impact.color as 'green' | 'cyan' | 'white' | 'amber' | 'red'} className="opacity-20" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-7">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
              className={clsx('w-14 h-14 rounded-xl flex items-center justify-center border', 
                impact.color === 'green' && 'bg-green-primary/10 border-green-primary/20',
                impact.color === 'amber' && 'bg-amber-primary/10 border-amber-primary/20',
                impact.color === 'red' && 'bg-red-primary/10 border-red-primary/20'
              )}
            >
              <ImpactIcon className={clsx('w-7 h-7', 
                impact.color === 'green' && 'text-green-primary',
                impact.color === 'amber' && 'text-amber-primary',
                impact.color === 'red' && 'text-red-primary'
              )} aria-hidden="true" />
            </motion.div>
            <div>
              <p className="text-xs text-fg-dim uppercase tracking-wider">{impact.label}</p>
              <p className="text-fg-muted text-sm mt-1">{impact.desc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-7">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs text-fg-dim uppercase tracking-wider">Environmental Impact</p>
                <ProgressBar 
                  value={getImpactScore()} 
                  max={100} 
                  color={impact.color === 'green' ? 'green' : impact.color === 'amber' ? 'amber' : 'red'}
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-fg-dim uppercase tracking-wider">Recyclability Score</p>
                <ProgressBar 
                  value={getRecyclabilityScore()} 
                  max={100} 
                  color="cyan"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-fg-dim uppercase tracking-wider">AI Confidence</p>
                <ProgressBar 
                  value={Math.round(detection.confidence * 100)} 
                  max={100} 
                  color="green"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-fg/5 border border-line">
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center',
                  catInfo.color === 'green' && 'bg-green-primary/10',
                  catInfo.color === 'cyan' && 'bg-cyan-primary/10',
                  catInfo.color === 'red' && 'bg-red-primary/10',
                  catInfo.color === 'amber' && 'bg-amber-primary/10'
                )}>
                  <CatIcon className={clsx('w-5 h-5',
                    catInfo.color === 'green' && 'text-green-primary',
                    catInfo.color === 'cyan' && 'text-cyan-primary',
                    catInfo.color === 'red' && 'text-red-primary',
                    catInfo.color === 'amber' && 'text-amber-primary'
                  )} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-fg-dim uppercase tracking-wider">Waste Category</p>
                  <p className="font-medium text-fg capitalize">{catInfo.label}</p>
                  <p className="text-fg-dim text-xs mt-1">{catInfo.desc}</p>
                </div>
              </div>

              <DecompositionTimeline time={detection.decompositionTime} />
            </div>
          </div>

          <div className="pt-4 border-t border-line">
            <p className="text-fg-muted text-sm leading-relaxed">
              <strong className="text-fg">{detection.name}</strong> is made of <strong className="text-fg">{detection.material}</strong>. 
              {detection.description}
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={<Recycle className="w-5 h-5 text-brand" aria-hidden="true" />}
          label="Recyclable"
          value={detection.bin === 'recyclable' ? 'Yes' : 'No'}
          subLabel="Can be processed into new materials"
          color="brand"
          delay={0}
        />
        <MetricCard
          icon={<Globe className="w-5 h-5 text-cyan-primary" aria-hidden="true" />}
          label="CO₂ Saved"
          value="~2.5kg"
          subLabel="Per correct recycle"
          color="cyan"
          delay={1}
        />
        <MetricCard
          icon={<Zap className="w-5 h-5 text-amber-primary" aria-hidden="true" />}
          label="Energy Saved"
          value="95%"
          subLabel="Vs raw production"
          color="amber"
          delay={2}
        />
      </div>
    </div>
  );
}