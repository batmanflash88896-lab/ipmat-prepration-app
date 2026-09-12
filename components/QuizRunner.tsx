"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/lib/types";
import { BotFace, type Expression } from "./AiBot";
import { Confetti, DifficultyDots } from "./ui";
import { useApp } from "@/lib/store";

type Props = {
  questions: Question[];
  title: string;
  kind: string; // for attempt log
  perQuestionSec?: number; // countdown per test total OR per question
  totalSec?: number; // whole test timer
  onFinish?: (res: { correct: number; total: number; timeSec: number; xp: number }) => void;
  focusMode?: boolean;
  gamified?: boolean;
};

const BOT_LINES: { exp: Expression; correct: string[]; wrong: string[] } = {
  exp: "happy",
  correct: [
    "Boom! Nailed it. 🔥",
    "Yes! That's exam-level accuracy.",
    "Clean solve. Keep this rhythm!",
    "Perfect — you're building real speed.",
    "Spot on! Momentum is everything.",
  ],
  wrong: [
    "Close! Let's learn the trap here.",
    "No worries — mistakes are data. Here's the fix.",
    "Almost. Read the method once, it'll stick.",
    "Good attempt. This is a classic trap — note it.",
  ],
};

export default function QuizRunner({ questions, title, kind, totalSec, onFinish, focusMode, gamified = true }: Props) {
  const { addAttempt } = useApp();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saText, setSaText] = useState("");
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [hintUsed, setHintUsed] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalSec ?? 0);
  const [elapsed, setElapsed] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [combo, setCombo] = useState(0);
  const startRef = useRef(Date.now());
  const savedRef = useRef(false);

  const q = questions[idx];
  const isSA = q.section === "QA-SA";

  useEffect(() => {
    const t = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      if (totalSec) {
        setTimeLeft((tl) => {
          if (tl <= 1) { clearInterval(t); doFinish(); return 0; }
          return tl - 1;
        });
      }
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setSaText(answers[idx] ?? ""); }, [idx]); // eslint-disable-line

  const score = useMemo(() => {
    let c = 0;
    questions.forEach((qq, i) => {
      const a = answers[i];
      if (a == null) return;
      if (qq.section === "QA-SA") {
        if (Math.abs(parseFloat(a) - (qq.answerValue ?? NaN)) < 1e-6) c++;
      } else if (a === qq.answer) c++;
    });
    return c;
  }, [answers, questions]);

  function pickMCQ(key: string) {
    if (revealed[idx]) return;
    setAnswers((a) => ({ ...a, [idx]: key }));
  }

  function commitAndReveal() {
    if (isSA) setAnswers((a) => ({ ...a, [idx]: saText }));
    const chosen = isSA ? saText : answers[idx];
    if (chosen == null || chosen === "") return;
    const correct = isSA
      ? Math.abs(parseFloat(saText) - (q.answerValue ?? NaN)) < 1e-6
      : chosen === q.answer;
    if (correct) {
      setCombo((c) => c + 1);
      if ((combo + 1) % 3 === 0 && gamified) { setConfetti(true); setTimeout(() => setConfetti(false), 1800); }
    } else {
      setCombo(0);
    }
    setRevealed((r) => ({ ...r, [idx]: true }));
  }

  function next() {
    if (idx < questions.length - 1) setIdx(idx + 1);
    else doFinish();
  }

  function doFinish() {
    if (savedRef.current) return;
    savedRef.current = true;
    const timeSec = Math.floor((Date.now() - startRef.current) / 1000);
    // recompute final score
    let c = 0;
    questions.forEach((qq, i) => {
      const a = i === idx && isSA ? saText : answers[i];
      if (a == null) return;
      if (qq.section === "QA-SA") { if (Math.abs(parseFloat(a) - (qq.answerValue ?? NaN)) < 1e-6) c++; }
      else if (a === qq.answer) c++;
    });
    const xp = c * 10 + Math.round((c / questions.length) * 30);
    addAttempt({ kind, label: title, topic: q.topic, section: q.section, correct: c, total: questions.length, timeSec, xp });
    setFinished(true);
    if (c / questions.length >= 0.6) { setConfetti(true); setTimeout(() => setConfetti(false), 2500); }
    onFinish?.({ correct: c, total: questions.length, timeSec, xp });
  }

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const exp: Expression = pct >= 80 ? "cheer" : pct >= 50 ? "happy" : "calm";
    const msg = pct >= 80 ? "Outstanding! You're in top-scorer territory. 🚀" : pct >= 50 ? "Solid work! Review the misses and you'll jump fast." : "Every attempt teaches you. Let's review and rise. 💪";
    return (
      <div className="max-w-2xl mx-auto">
        <Confetti show={confetti} />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-8 text-center">
          <div className="flex justify-center mb-3"><BotFace expression={exp} size={90} /></div>
          <h2 className="display text-4xl font-bold mb-1">{pct}%</h2>
          <p className="text-paper/60 mb-6">{score} / {questions.length} correct · {fmtTime(elapsed)}</p>
          <p className="text-lg mb-6">{msg}</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="card p-4"><div className="text-2xl font-bold text-mint">{score}</div><div className="text-xs text-paper/50">Correct</div></div>
            <div className="card p-4"><div className="text-2xl font-bold text-rose">{questions.length - Object.keys(answers).filter(k=>answers[+k]!=null).length + (Object.keys(answers).filter(k=>answers[+k]!=null).length - score)}</div><div className="text-xs text-paper/50">Incorrect / skipped</div></div>
            <div className="card p-4"><div className="text-2xl font-bold text-gold">+{score * 10 + Math.round((score / questions.length) * 30)}</div><div className="text-xs text-paper/50">XP earned</div></div>
          </div>
          <div className="text-left space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {questions.map((qq, i) => {
              const a = answers[i];
              const correct = qq.section === "QA-SA" ? Math.abs(parseFloat(a ?? "") - (qq.answerValue ?? NaN)) < 1e-6 : a === qq.answer;
              return (
                <details key={i} className="card p-4">
                  <summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold">
                    <span className={correct ? "text-mint" : "text-rose"}>{correct ? "✓" : "✕"}</span>
                    <span className="text-paper/50">Q{i + 1}.</span>
                    <span className="truncate">{qq.stem}</span>
                  </summary>
                  <div className="mt-3 text-sm space-y-2 text-paper/80">
                    <div>Correct answer: <b className="text-mint">{qq.section === "QA-SA" ? qq.answer : `${qq.answer}) ${qq.choices?.find(c=>c.key===qq.answer)?.text}`}</b></div>
                    <div className="space-y-1">{qq.solution.map((s, j) => <div key={j} className="flex gap-2"><span className="text-orange">{j + 1}.</span><span>{s}</span></div>)}</div>
                    {qq.commonMistake && <div className="text-gold text-xs">⚠ Common mistake: {qq.commonMistake}</div>}
                  </div>
                </details>
              );
            })}
          </div>
          <div className="flex gap-3 justify-center mt-6">
            <a href="/analytics" className="btn-ghost">View analytics</a>
            <a href="/practice" className="btn-primary">More practice</a>
          </div>
        </motion.div>
      </div>
    );
  }

  const chosen = isSA ? saText : answers[idx];
  const isRevealed = revealed[idx];
  const answeredCorrect = isRevealed && (isSA ? Math.abs(parseFloat(saText) - (q.answerValue ?? NaN)) < 1e-6 : chosen === q.answer);
  const botExp: Expression = !isRevealed ? "think" : answeredCorrect ? "cheer" : "oops";

  return (
    <div className="max-w-3xl mx-auto">
      <Confetti show={confetti} />
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="display text-2xl font-bold">{title}</h1>
          <div className="text-paper/50 text-sm">Question {idx + 1} of {questions.length}</div>
        </div>
        <div className="flex items-center gap-3">
          {gamified && combo >= 2 && <span className="chip bg-orange/20 text-orange animate-pop">🔥 {combo} combo</span>}
          <div className={`font-mono text-lg font-bold px-3 py-1 rounded-xl ${totalSec && timeLeft < 60 ? "bg-rose/20 text-rose" : "bg-white/5 text-mint"}`}>
            {totalSec ? fmtTime(timeLeft) : fmtTime(elapsed)}
          </div>
        </div>
      </div>

      {/* progress */}
      <div className="h-2 rounded-full bg-ink3 mb-6 overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-orange to-mint" animate={{ width: `${((idx) / questions.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 text-xs">
            <span className="chip bg-violet/15 text-violet">{q.topic}</span>
            <span className="chip bg-white/5 text-paper/60">{q.subtopic}</span>
            <span className="chip bg-white/5 text-paper/60"><DifficultyDots level={q.difficulty} /> {q.difficulty}</span>
            {q.source && <span className="chip bg-gold/15 text-gold">{q.source}</span>}
          </div>

          <h2 className="text-xl md:text-2xl font-semibold leading-snug mb-6">{q.stem}</h2>

          {isSA ? (
            <div className="mb-4">
              <input
                type="number" value={saText} disabled={isRevealed}
                onChange={(e) => setSaText(e.target.value)}
                placeholder="Type your numeric answer"
                className="w-full bg-ink3 rounded-2xl px-5 py-4 text-lg font-mono outline-none border border-white/10 focus:border-orange/50"
              />
            </div>
          ) : (
            <div className="grid gap-3 mb-4">
              {q.choices?.map((c) => {
                const selected = chosen === c.key;
                let cls = "border-white/10 bg-ink3/60 hover:border-white/25";
                if (isRevealed) {
                  if (c.key === q.answer) cls = "border-mint bg-mint/15";
                  else if (selected) cls = "border-rose bg-rose/15";
                  else cls = "border-white/5 opacity-60";
                } else if (selected) cls = "border-orange bg-orange/15";
                return (
                  <button key={c.key} onClick={() => pickMCQ(c.key)} disabled={isRevealed}
                    className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-2xl border transition-all ${cls}`}>
                    <span className={`shrink-0 w-8 h-8 rounded-lg grid place-items-center font-bold text-sm ${selected || (isRevealed && c.key === q.answer) ? "bg-white/15" : "bg-white/5"}`}>{c.key}</span>
                    <span>{c.text}</span>
                    {isRevealed && c.key === q.answer && <span className="ml-auto text-mint">✓</span>}
                    {isRevealed && selected && c.key !== q.answer && <span className="ml-auto text-rose">✕</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* hint */}
          {!isRevealed && !hintUsed[idx] && q.whyMethod && (
            <button onClick={() => setHintUsed((h) => ({ ...h, [idx]: true }))} className="text-sm text-gold/80 hover:text-gold mb-2">
              💡 Need a hint? (before you answer)
            </button>
          )}
          {!isRevealed && hintUsed[idx] && (
            <div className="text-sm glass rounded-xl px-4 py-3 mb-3 text-gold/90">💡 {q.whyMethod}</div>
          )}

          {/* reveal / solution */}
          {isRevealed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <div className="glass rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <BotFace expression={botExp} size={52} />
                  <div className="flex-1">
                    <div className={`font-bold mb-1 ${answeredCorrect ? "text-mint" : "text-gold"}`}>
                      {answeredCorrect ? BOT_LINES.correct[idx % BOT_LINES.correct.length] : BOT_LINES.wrong[idx % BOT_LINES.wrong.length]}
                    </div>
                    <div className="text-sm space-y-1.5 text-paper/85">
                      <div className="font-semibold text-paper">Step-by-step:</div>
                      {q.solution.map((s, j) => <div key={j} className="flex gap-2"><span className="text-orange font-bold">{j + 1}.</span><span>{s}</span></div>)}
                    </div>
                    {q.whyMethod && <div className="text-sm mt-2 text-sky/90"><b>Why this method:</b> {q.whyMethod}</div>}
                    {q.commonMistake && <div className="text-sm mt-1 text-gold/90"><b>⚠ Common mistake:</b> {q.commonMistake}</div>}
                    {q.faster && <div className="text-sm mt-1 text-mint/90"><b>⚡ Faster way:</b> {q.faster}</div>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between mt-6">
            <button onClick={() => idx > 0 && setIdx(idx - 1)} disabled={idx === 0} className="btn-ghost disabled:opacity-30">← Prev</button>
            {!isRevealed ? (
              <button onClick={commitAndReveal} disabled={chosen == null || chosen === ""} className="btn-primary disabled:opacity-40">Check answer</button>
            ) : (
              <button onClick={next} className="btn-mint">{idx < questions.length - 1 ? "Next →" : "Finish test 🏁"}</button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* quick nav dots */}
      <div className="flex flex-wrap gap-1.5 mt-5 justify-center">
        {questions.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${i === idx ? "bg-orange text-ink" : revealed[i] ? (answers[i] === questions[i].answer || (questions[i].section === "QA-SA" && Math.abs(parseFloat(answers[i] ?? "") - (questions[i].answerValue ?? NaN)) < 1e-6) ? "bg-mint/30 text-mint" : "bg-rose/30 text-rose") : answers[i] != null ? "bg-white/15" : "bg-white/5 text-paper/40"}`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
