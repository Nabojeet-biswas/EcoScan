import { motion, useMotionValue, useSpring } from 'framer-motion';
import { clsx } from 'clsx';
import type { WasteDetection } from '../../services/detectionService';

interface WasteObjectProps {
  detection: WasteDetection;
  onDragEnd: (binType: 'recyclable' | 'organic' | 'non-recyclable' | 'special' | null) => void;
  bins: Array<{ type: 'recyclable' | 'organic' | 'non-recyclable' | 'special'; rect: DOMRect }>;
  isSorting: boolean;
  selectedBin: 'recyclable' | 'organic' | 'non-recyclable' | 'special' | null;
}

const wasteEmojis: Record<string, string> = {
  'Plastic Bottle': '🥤',
  'Aluminum Can': '♻️',
  'Banana Peel': '🍌',
  'Paper': '📄',
  'Glass Bottle': '🍾',
  'Food Waste': '🥗',
  'Plastic Bag': '🛍️',
  'Battery': '🔋',
  'Cardboard': '📦',
};

export function WasteObject({ detection, onDragEnd, bins, isSorting, selectedBin }: WasteObjectProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotation = useMotionValue(0);
  const opacity = useMotionValue(1);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springScale = useSpring(scale, springConfig);
  const springRotation = useSpring(rotation, springConfig);
  const springOpacity = useSpring(opacity, { stiffness: 200, damping: 25 });

  const emoji = wasteEmojis[detection.name] || '🗑️';
  const isSpecial = detection.category === 'special';

  const handleDragEnd = (_event: MouseEvent | TouchEvent, info: { point: { x: number; y: number } | null }) => {
    const { point } = info;
    if (!point) {
      resetPosition();
      return;
    }

    let hitBin: 'recyclable' | 'organic' | 'non-recyclable' | 'special' | null = null;
    
    for (const bin of bins) {
      if (
        point.x >= bin.rect.left &&
        point.x <= bin.rect.right &&
        point.y >= bin.rect.top &&
        point.y <= bin.rect.bottom
      ) {
        hitBin = bin.type;
        break;
      }
    }

    if (hitBin) {
      animateToBin(hitBin);
    } else {
      resetPosition();
    }
  };

  const animateToBin = (binType: 'recyclable' | 'organic' | 'non-recyclable' | 'special') => {
    const bin = bins.find(b => b.type === binType);
    if (!bin) return;

    scale.set(0.8);
    opacity.set(0.8);
    rotation.set(Math.random() * 30 - 15);

    const targetX = bin.rect.left + bin.rect.width / 2 - 40;
    const targetY = bin.rect.top + bin.rect.height / 2 - 40;

    x.set(targetX);
    y.set(targetY);

    setTimeout(() => {
      scale.set(0);
      opacity.set(0);
      onDragEnd(binType);
    }, 400);
  };

  const resetPosition = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
    rotation.set(0);
    opacity.set(1);
  };

  if (isSorting && selectedBin) {
    return null;
  }

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        scale: springScale,
        rotate: springRotation,
        opacity: springOpacity,
      }}
      className="fixed z-30 pointer-events-none"
      role="img"
      aria-label={`${detection.name} - drag to sort`}
    >
      <motion.div
        drag={!isSorting}
        dragConstraints={{ top: -300, bottom: 300, left: -300, right: 300 }}
        onDragStart={() => {
          scale.set(1.15);
          rotation.set(0);
        }}
        onDrag={(_, info) => {
          x.set(info.point.x);
          y.set(info.point.y);
        }}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.2, rotate: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
        className={clsx(
          'w-20 h-20 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing',
          'shadow-2xl transition-all duration-200',
          isSpecial ? 'bg-amber-primary/20 border-2 border-amber-primary/50' : 'bg-fg/10 border border-line'
        )}
        style={{
          backdropFilter: 'blur(10px)',
        }}
        role="button"
        tabIndex={0}
        aria-label={`Drag ${detection.name} to sort`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
      >
        <span className="text-5xl filter drop-shadow-lg" aria-hidden="true">{emoji}</span>
        {isSpecial && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-amber-primary rounded-full flex items-center justify-center text-eco-900 text-xs font-bold dark:bg-amber-primary dark:text-eco-900"
          >
            ⚠
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}