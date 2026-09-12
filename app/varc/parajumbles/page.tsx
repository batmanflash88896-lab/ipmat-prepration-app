"use client";
import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { PARA_JUMBLES } from "@/lib/varc";
import { BotFace } from "@/components/AiBot";
import { Confetti } from "@/components/ui";
import { useApp } from "@/lib/store";
import Link from "next/link";

export default function ParaJumbles() {
  const { addAttempt } = useApp();
  const [idx, setIdx] = useState(0);
  const pj = PARA_JUMBLES[idx];
  const [order, setOrder] = useState<string[]>(pj.sentences.map((s) => s.key));
  const [submitted, setSubmitted] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const correct = JSON.stringify(order) === JSON.stringify(pj.answer);

  function submit() {
    setSubmitted(true);
    addAttempt({ kind: `varc:pj:${pj.id}`, label: "Para Jumble", topic: "Para Jumbles", section: "VARC", correct: correct ? 1 : 0, total: 1, timeSec: 0, xp: correct ? 15 : 3 });
    if (correct) { setConfetti(true); setTimeout(() => setConfetti(false), 2000); }
  }
  function go(next: number) {
    const p = PARA_JUMBLES[next];
    setIdx(next); setOrder(p.sentences.map((s) => s.key)); setSubmitted(false);
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <Confetti show={confetti} />
      <div className="flex items-center justify-between">
        <Link href="/varc" className="text-sm text-paper/50 hover:text-orange">← VARC</Link>
        <div className="flex gap-2">{PARA_JUMBLES.map((_, i) => <button key={i} onClick={() => go(i)} className={`w-8 h-8 rounded-lg text-xs font-bold ${i === idx ? "bg-orange text-ink" : "bg-white/5 text-paper/50"}`}>{i + 1}</button>)}</div>
      </div>
      <h1 className="display text-3xl font-bold">Para Jumbles</h1>
      <p className="text-paper/60 text-sm">{pj.intro} Drag the sentences into the correct order.</p>

      <Reorder.Group axis="y" values={order} onReorder={setOrder} className="space-y-3">
        {order.map((key, i) => {
          const s = pj.sentences.find((x) => x.key === key)!;
          const rightPos = submitted && pj.answer[i] === key;
          return (
            <Reorder.Item key={key} value={key} className={`card p-4 cursor-grab active:cursor-grabbing flex gap-3 items-start ${submitted ? (rightPos ? "border-mint" : "border-rose") : ""}`}>
              <span className="shrink-0 w-7 h-7 rounded-lg bg-orange/15 text-orange grid place-items-center font-bold text-sm">{i + 1}</span>
              <span className="text-sm text-paper/85">{s.text}</span>
              {submitted && <span className="ml-auto">{rightPos ? "✓" : "✕"}</span>}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {!submitted ? (
        <button onClick={submit} className="btn-primary w-full">Check order</button>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-5">
          <div className="flex gap-3 items-start">
            <BotFace expression={correct ? "cheer" : "calm"} size={44} />
            <div>
              <div className={`font-bold ${correct ? "text-mint" : "text-gold"}`}>{correct ? "Perfect sequence! +15 XP" : `Correct order: ${pj.answer.join(" → ")}`}</div>
              <div className="text-sm text-paper/80 mt-1">{pj.explanation}</div>
            </div>
          </div>
          {idx < PARA_JUMBLES.length - 1 && <button onClick={() => go(idx + 1)} className="btn-mint mt-4">Next →</button>}
        </motion.div>
      )}
    </div>
  );
}
