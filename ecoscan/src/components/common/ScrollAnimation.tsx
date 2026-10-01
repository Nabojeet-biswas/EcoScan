import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, useRef, useEffect } from 'react';
import * as React from 'react';
import { clsx } from 'clsx';
import { useIntersectionObserver } from '../../hooks/useScrollAnimation';

interface ScrollAnimationProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'initial' | 'animate' | 'transition'> {
  animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'scale-in' | 'slide-up' | 'none';
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  triggerOnce?: boolean;
  threshold?: number;
  rootMargin?: string;
  children: React.ReactNode;
  className?: string;
}

const animationVariants = {
  'fade-in': { initial: { opacity: 0 }, animate: { opacity: 1 } },
  'fade-in-up': { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
  'fade-in-down': { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } },
  'scale-in': { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } },
  'slide-up': { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
  'none': { initial: { opacity: 1 }, animate: { opacity: 1 } },
};

const transitionDefaults = {
  'fade-in': { duration: 0.6, ease: [0.25, 1, 0.5, 1] as const },
  'fade-in-up': { duration: 0.7, ease: [0.25, 1, 0.5, 1] as const },
  'fade-in-down': { duration: 0.7, ease: [0.25, 1, 0.5, 1] as const },
  'scale-in': { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
  'slide-up': { duration: 0.8, ease: [0.25, 1, 0.5, 1] as const },
  'none': { duration: 0 },
};

export const ScrollAnimation = forwardRef<HTMLDivElement, ScrollAnimationProps>(
  ({
    animation = 'fade-in-up',
    delay = 0,
    duration,
    staggerChildren = 0,
    triggerOnce = true,
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    children,
    className,
    ...props
  }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const [isVisible] = useIntersectionObserver({ threshold, rootMargin, triggerOnce });

    useEffect(() => {
      if (forwardedRef) {
        if (typeof forwardedRef === 'function') {
          forwardedRef(internalRef.current);
        } else {
          forwardedRef.current = internalRef.current;
        }
      }
    }, [forwardedRef]);

    const variant = animationVariants[animation];
    const transition = {
      ...transitionDefaults[animation],
      delay,
      duration: duration ?? transitionDefaults[animation].duration,
    };

    const childVariants = staggerChildren > 0 ? {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerChildren / 1000,
            delayChildren: delay / 1000,
          },
        },
      },
    } : undefined;

    return (
      <motion.div
        ref={internalRef}
        initial={variant?.initial}
        animate={isVisible ? variant?.animate : variant?.initial}
        transition={transition}
        variants={childVariants}
        className={clsx(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollAnimation.displayName = 'ScrollAnimation';

interface ScrollStaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  triggerOnce?: boolean;
}

export function ScrollStagger({
  children,
  className,
  staggerDelay = 80,
  delay = 0,
  triggerOnce = true,
}: ScrollStaggerProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const [isVisible] = useIntersectionObserver({ triggerOnce });

  const variants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay / 1000,
          delayChildren: delay / 1000,
        },
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] as const },
    },
  };

  return (
    <motion.div
      ref={internalRef}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ variants?: typeof itemVariants }>, { variants: itemVariants })
          : child
      )}
    </motion.div>
  );
}