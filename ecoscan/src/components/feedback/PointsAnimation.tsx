import { motion, useMotionValue, useSpring } from 'framer-motion';
import { clsx } from 'clsx';
import { useEffect } from 'react';

interface PointsAnimationProps {
  points: number;
  className?: string;
}

export function PointsAnimation({ points, className }: PointsAnimationProps) {
  const pointsValue = useMotionValue(points);
  const springPoints = useSpring(pointsValue, { stiffness: 200, damping: 20 });

  useEffect(() => {
    pointsValue.set(points);
  }, [points, pointsValue]);

  return (
    <motion.span
      className={clsx('font-mono tabular-nums', className)}
    >
      {Math.round(springPoints.get()).toLocaleString()}
    </motion.span>
  );
}