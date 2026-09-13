"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { BrainCircuit, Check, Clock3, Sparkles, Target, TrendingUp } from "lucide-react";
import { AnimatedGridPattern } from "@/components/registry/animated-grid-pattern";

export default function StudyOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 180, damping: 24 });
  const smoothY = useSpring(y, { stiffness: 180, damping: 24 });
  const rotateY = useTransform(smoothX, [-.5, .5], [-9, 9]);
  const rotateX = useTransform(smoothY, [-.5, .5], [8, -8]);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    x.set((event.clientX - box.left) / box.width - .5);
    y.set((event.clientY - box.top) / box.height - .5);
  }

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }} className="relative mx-auto h-[390px] w-full max-w-[500px] [perspective:1100px]" aria-label="Interactive preparation dashboard preview">
      <div className="absolute inset-6 rounded-full bg-orange/20 blur-[70px]" />
      <AnimatedGridPattern width={42} height={42} numSquares={16} className="rounded-[32px] text-orange [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <motion.div style={reduced ? undefined : { rotateX, rotateY }} className="absolute inset-x-7 top-9 h-[300px] [transform-style:preserve-3d]">
        <div className="absolute inset-0 rounded-[28px] border border-white/15 bg-[#101d30]/90 p-5 shadow-[0_45px_90px_-32px_rgba(0,0,0,.9)] backdrop-blur-xl [transform:translateZ(0px)]">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-orange text-ink"><Target size={17} /></span><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-paper/35">Today’s focus</div><div className="text-xs font-bold">Algebra mastery</div></div></div><span className="rounded-full bg-mint/10 px-2 py-1 text-[9px] font-bold text-mint">LIVE PLAN</span></div>
          <div className="mt-5 grid grid-cols-[1fr_92px] gap-4"><div><div className="text-[10px] text-paper/35">Readiness score</div><div className="mt-1 display text-4xl font-bold">78<span className="text-lg text-orange">%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]"><motion.div initial={{ width: 0 }} animate={{ width: "78%" }} transition={{ duration: reduced ? 0 : 1.2, ease: [0.23,1,0.32,1] }} className="h-full rounded-full bg-gradient-to-r from-orange to-gold" /></div></div><div className="grid place-items-center rounded-2xl border border-violet/20 bg-violet/10"><TrendingUp size={20} className="text-violet" /><span className="text-[9px] font-bold text-violet">+12% this week</span></div></div>
          <div className="mt-5 grid grid-cols-3 gap-2">{[[BrainCircuit,"24","Solved"],[Check,"83%","Accuracy"],[Clock3,"41m","Focused"]].map(([Icon,value,label]) => { const I = Icon as typeof BrainCircuit; return <div key={String(label)} className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3"><I size={14} className="mb-3 text-paper/35"/><div className="text-sm font-bold">{String(value)}</div><div className="text-[8px] uppercase tracking-wider text-paper/30">{String(label)}</div></div>; })}</div>
        </div>

        <motion.div animate={reduced ? undefined : { y: [0,-7,0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-2 top-24 w-36 rounded-2xl border border-mint/25 bg-[#13283a]/95 p-3 shadow-2xl [transform:translateZ(65px)_rotateY(5deg)]"><div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-mint"><Sparkles size={13}/> Next milestone</div><div className="mt-2 text-xs font-bold">Elite Mock 01</div><div className="mt-1 text-[9px] text-paper/35">90 questions · 120 min</div></motion.div>
        <motion.div animate={reduced ? undefined : { y: [0,6,0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-3 bottom-4 w-40 rounded-2xl border border-orange/25 bg-[#2a1d1b]/95 p-3 shadow-2xl [transform:translateZ(85px)_rotateY(-5deg)]"><div className="text-[9px] font-bold uppercase tracking-wider text-orange">Weakness detected</div><div className="mt-2 text-xs font-bold">Conditional probability</div><div className="mt-2 h-1 rounded-full bg-white/10"><div className="h-full w-[42%] rounded-full bg-orange" /></div></motion.div>
      </motion.div>
    </div>
  );
}
