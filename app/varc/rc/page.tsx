"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PASSAGES } from "@/lib/varc";
import { BotFace } from "@/components/AiBot";
import { Confetti } from "@/components/ui";
import { useApp } from "@/lib/store";
import Link from "next/link";

export default function RCPractice() {
  const { addAttempt, markDaily } = useApp();
  const [pIdx, setPIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const p = PASSAGES[pIdx];

  const correct = p.questions.filter((q, i) => answers[i] === q.answer).length;

  function submit() {
    setSubmitted(true);
    const xp = correct * 8;
    addAttempt({ kind: `varc:rc:${p.id}`, label: `RC: ${p.title}`, topic: "Reading Comprehension", section: "VARC", correct, total: p.questions.length, timeSec: 0, xp });
    markDaily("daily-rc");
    if (correct / p.questions.length >= 0.6) { setConfetti(true); setTimeout(() => setConfetti(false), 2200); }
  }
  function reset(next: number) { setPIdx(next); setAnswers({}); setSubmitted(false); }

  return (
    <div className="space-y-5">
      <Confetti show={confetti} />
      <div className="flex items-center justify-between">
        <Link href="/varc" className="text-sm text-paper/50 hover:text-orange">← VARC</Link>
        <div className="flex gap-2">
          {PASSAGES.map((pp, i) => (
            <button key={pp.id} onClick={() => reset(i)} className={`w-8 h-8 rounded-lg text-xs font-bold ${i === pIdx ? "bg-orange text-ink" : "bg-white/5 text-paper/50"}`}>{i + 1}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Passage */}
        <div className="card p-6 lg:max-h-[75vh] lg:overflow-y-auto">
          <span className="chip bg-sky/15 text-sky mb-2">{p.source}</span>
          <h1 className="display text-2xl font-bold mb-3">{p.title}</h1>
          <div className="space-y-3 text-paper/80 leading-relaxed">
            {p.paragraphs.map((para, i) => <p key={i}><span className="text-orange font-bold mr-1">{i + 1}.</span>{para}</p>)}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {p.questions.map((q, qi) => (
            <motion.div key={qi} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qi * 0.05 }} className="card p-5">
              <div className="font-semibold mb-3">Q{qi + 1}. {q.q}</div>
              <div className="space-y-2">
                {q.choices.map((c) => {
                  const sel = answers[qi] === c.key;
                  let cls = "border-white/10 hover:border-white/25";
                  if (submitted) {
                    if (c.key === q.answer) cls = "border-mint bg-mint/15";
                    else if (sel) cls = "border-rose bg-rose/15";
                    else cls = "border-white/5 opacity-60";
                  } else if (sel) cls = "border-orange bg-orange/15";
                  return (
                    <button key={c.key} disabled={submitted} onClick={() => setAnswers((a) => ({ ...a, [qi]: c.key }))}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-sm transition-all ${cls}`}>
                      <b className="mr-2">{c.key}</b>{c.text}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-3 glass rounded-xl p-3 text-sm flex gap-2">
                  <BotFace expression={answers[qi] === q.answer ? "cheer" : "calm"} size={36} />
                  <div><b className={answers[qi] === q.answer ? "text-mint" : "text-gold"}>{answers[qi] === q.answer ? "Correct!" : `Answer: ${q.answer}`}</b> — {q.explanation}</div>
                </div>
              )}
            </motion.div>
          ))}
          {!submitted ? (
            <button onClick={submit} disabled={Object.keys(answers).length < p.questions.length} className="btn-primary w-full disabled:opacity-40">Submit answers</button>
          ) : (
            <div className="card p-5 text-center">
              <div className="display text-3xl font-bold text-mint">{correct}/{p.questions.length}</div>
              <div className="text-paper/50 text-sm mb-3">+{correct * 8} XP earned</div>
              {pIdx < PASSAGES.length - 1 && <button onClick={() => reset(pIdx + 1)} className="btn-mint">Next passage →</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
