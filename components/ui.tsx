"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export function AnimatedNumber({ value, decimals = 0, suffix = "", className = "" }: { value: number; decimals?: number; suffix?: string; className?: string }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${v.toFixed(decimals)}${suffix}`);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1, ease: "easeOut" });
    return controls.stop;
  }, [value, mv]);
  return <motion.span className={className}>{rounded}</motion.span>;
}

export function Ring({ value, size = 84, stroke = 9, color = "#78F2C0", track = "#152541", label }: { value: number; size?: number; stroke?: number; color?: string; track?: string; label?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: off }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color}99)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{label}</div>
    </div>
  );
}

export function Chip({ children, color = "#78F2C0" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="chip" style={{ background: `${color}22`, color }}>
      {children}
    </span>
  );
}

export function Pill({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${active ? "bg-orange text-ink shadow-glow" : "bg-white/5 text-paper/70 hover:bg-white/10"}`}>
      {children}
    </button>
  );
}

export function SectionTitle({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <div className="mb-5">
      {kicker && <div className="text-orange text-xs font-bold tracking-[0.2em] uppercase mb-1">{kicker}</div>}
      <h2 className="display text-3xl md:text-4xl font-semibold">{title}</h2>
      {sub && <p className="text-paper/60 mt-1 max-w-2xl">{sub}</p>}
    </div>
  );
}

export function DifficultyDots({ level }: { level: "Easy" | "Medium" | "Hard" }) {
  const n = level === "Easy" ? 1 : level === "Medium" ? 2 : 3;
  const color = level === "Easy" ? "#78F2C0" : level === "Medium" ? "#FFC15E" : "#FF5D8F";
  return (
    <span className="inline-flex items-center gap-1" title={level}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < n ? color : "#2a3a56" }} />
      ))}
    </span>
  );
}

export function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  const colors = ["#FF6B35", "#78F2C0", "#7267F0", "#FFC15E", "#4FC3F7", "#FF5D8F"];
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: `${Math.random() * 100}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", rotate: 360 * (Math.random() > 0.5 ? 1 : -1), opacity: [1, 1, 0] }}
          transition={{ duration: 2 + Math.random() * 1.5, ease: "easeIn", delay: Math.random() * 0.3 }}
          style={{ position: "absolute", width: 8 + Math.random() * 6, height: 8 + Math.random() * 6, background: colors[i % colors.length], borderRadius: Math.random() > 0.5 ? "50%" : "2px" }}
        />
      ))}
    </div>
  );
}
