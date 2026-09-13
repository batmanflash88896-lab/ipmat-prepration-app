"use client";

// Adapted from unlumen UI's MIT-licensed Tilt registry primitive.
import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export function Tilt({ children, className, rotationFactor = 7 }: { children: React.ReactNode; className?: string; rotationFactor?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 220, damping: 26 });
  const ySpring = useSpring(y, { stiffness: 220, damping: 26 });
  const rotateX = useTransform(ySpring, [-.5, .5], [-rotationFactor, rotationFactor]);
  const rotateY = useTransform(xSpring, [-.5, .5], [rotationFactor, -rotationFactor]);
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  return <motion.div ref={ref} className={cn("[transform-style:preserve-3d]", className)} style={reduced ? undefined : { transform }} onPointerMove={(event) => { if (!ref.current || reduced) return; const box = ref.current.getBoundingClientRect(); x.set((event.clientX - box.left) / box.width - .5); y.set((event.clientY - box.top) / box.height - .5); }} onPointerLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>;
}
