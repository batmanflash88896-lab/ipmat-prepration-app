"use client";

// Adapted from Magic UI's MIT-licensed animated-grid-pattern registry component.
import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedGridPatternProps extends ComponentPropsWithoutRef<"svg"> {
  width?: number;
  height?: number;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
}

export function AnimatedGridPattern({ width = 48, height = 48, numSquares = 22, maxOpacity = 0.22, duration = 3.5, className, ...props }: AnimatedGridPatternProps) {
  const id = useId();
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  const [size, setSize] = useState({ width: 900, height: 500 });
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const cols = Math.max(1, Math.floor(size.width / width));
  const rows = Math.max(1, Math.floor(size.height / height));
  const squares = Array.from({ length: numSquares }, (_, index) => ({ x: (index * 7 + iteration * 3) % cols, y: (index * 11 + iteration * 2) % rows }));

  return (
    <svg ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} {...props}>
      <defs><pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse"><path d={`M.5 ${height}V.5H${width}`} fill="none" stroke="currentColor" strokeOpacity=".18" /></pattern></defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      {!reduced && squares.map((square, index) => <motion.rect key={`${index}-${iteration}`} x={square.x * width + 1} y={square.y * height + 1} width={width - 2} height={height - 2} fill="currentColor" initial={{ opacity: 0 }} animate={{ opacity: maxOpacity }} transition={{ duration, delay: index * .08, repeat: 1, repeatType: "reverse" }} onAnimationComplete={index === 0 ? () => setIteration((value) => value + 1) : undefined} />)}
    </svg>
  );
}
