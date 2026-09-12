"use client";
import { motion, AnimatePresence } from "framer-motion";

export type Expression = "happy" | "think" | "cheer" | "wow" | "calm" | "oops";

const FACES: Record<Expression, { eye: string; mouth: JSX.Element; glow: string }> = {
  happy: { eye: "M 0 0", glow: "#78F2C0", mouth: <path d="M -9 4 Q 0 12 9 4" stroke="#08111F" strokeWidth="2.5" fill="none" strokeLinecap="round" /> },
  think: { eye: "", glow: "#7267F0", mouth: <line x1="-6" y1="7" x2="6" y2="7" stroke="#08111F" strokeWidth="2.5" strokeLinecap="round" /> },
  cheer: { eye: "", glow: "#FF6B35", mouth: <path d="M -10 3 Q 0 15 10 3 Z" fill="#08111F" /> },
  wow: { eye: "", glow: "#FFC15E", mouth: <circle cx="0" cy="7" r="4" fill="#08111F" /> },
  calm: { eye: "", glow: "#4FC3F7", mouth: <path d="M -7 6 Q 0 9 7 6" stroke="#08111F" strokeWidth="2.5" fill="none" strokeLinecap="round" /> },
  oops: { eye: "", glow: "#FF5D8F", mouth: <path d="M -8 8 Q 0 2 8 8" stroke="#08111F" strokeWidth="2.5" fill="none" strokeLinecap="round" /> },
};

export function BotFace({ expression = "happy", size = 64 }: { expression?: Expression; size?: number }) {
  const f = FACES[expression];
  return (
    <motion.svg
      width={size} height={size} viewBox="-32 -32 64 64"
      animate={{ y: [0, -4, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      style={{ filter: `drop-shadow(0 0 12px ${f.glow}88)` }}
    >
      <defs>
        <radialGradient id="botg" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="55%" stopColor={f.glow} />
          <stop offset="100%" stopColor={f.glow} stopOpacity="0.7" />
        </radialGradient>
      </defs>
      {/* antenna */}
      <line x1="0" y1="-22" x2="0" y2="-30" stroke={f.glow} strokeWidth="2" />
      <circle cx="0" cy="-31" r="2.5" fill={f.glow} />
      {/* head */}
      <rect x="-22" y="-22" width="44" height="40" rx="16" fill="url(#botg)" />
      {/* eyes */}
      <AnimatePresence mode="wait">
        <motion.g key={expression}>
          {expression === "happy" || expression === "cheer" ? (
            <>
              <path d="M -13 -6 Q -9 -11 -5 -6" stroke="#08111F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 5 -6 Q 9 -11 13 -6" stroke="#08111F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : expression === "wow" ? (
            <>
              <circle cx="-9" cy="-6" r="3.5" fill="#08111F" />
              <circle cx="9" cy="-6" r="3.5" fill="#08111F" />
            </>
          ) : expression === "think" ? (
            <>
              <circle cx="-9" cy="-6" r="2.6" fill="#08111F" />
              <motion.circle cx="9" cy="-6" r="2.6" fill="#08111F"
                animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
            </>
          ) : (
            <>
              <circle cx="-9" cy="-6" r="2.8" fill="#08111F" />
              <circle cx="9" cy="-6" r="2.8" fill="#08111F" />
            </>
          )}
          {f.mouth}
        </motion.g>
      </AnimatePresence>
    </motion.svg>
  );
}

export function BotBubble({
  expression = "happy",
  text,
  size = 56,
  compact = false,
}: {
  expression?: Expression;
  text: React.ReactNode;
  size?: number;
  compact?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0"><BotFace expression={expression} size={size} /></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: -6 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        className={`glass rounded-2xl rounded-tl-sm px-4 py-3 ${compact ? "text-sm" : ""} text-paper/90 leading-relaxed`}
      >
        {text}
      </motion.div>
    </div>
  );
}
