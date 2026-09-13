"use client";

// Adapted from Magic UI's MIT-licensed blur-fade registry component.
import { useRef } from "react";
import { motion, useInView, useReducedMotion, type MotionProps } from "motion/react";

interface BlurFadeProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  inView?: boolean;
}

export function BlurFade({ children, className, duration = 0.45, delay = 0, offset = 10, inView = false, ...props }: BlurFadeProps) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { y: offset, opacity: 0, filter: "blur(7px)" }}
      animate={!inView || visible ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ delay, duration: reduced ? 0 : duration, ease: [0.23, 1, 0.32, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
