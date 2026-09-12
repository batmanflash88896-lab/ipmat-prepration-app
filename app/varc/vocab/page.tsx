"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCAB } from "@/lib/vocab";
import { BotFace } from "@/components/AiBot";
import { Chip } from "@/components/ui";
import { useApp } from "@/lib/store";
import Link from "next/link";

export default function VocabBuilder() {
  const { learnVocab, vocabLearned, addXp, markDaily } = useApp();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const w = VOCAB[idx];
  const learned = vocabLearned.includes(w.word);

  function markLearned() {
    if (!learned) { learnVocab(w.word); addXp(5); }
    markDaily("daily-vocab");
    next();
  }
  function next() { setFlipped(false); setIdx((i) => (i + 1) % VOCAB.length); }
  function prev() { setFlipped(false); setIdx((i) => (i - 1 + VOCAB.length) % VOCAB.length); }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/varc" className="text-sm text-paper/50 hover:text-orange">← VARC</Link>
        <Chip color="#78F2C0">{vocabLearned.length} / {VOCAB.length} learned</Chip>
      </div>

      <div className="text-center">
        <h1 className="display text-3xl font-bold">Vocabulary Builder</h1>
        <p className="text-paper/50 text-sm">Tap the card to reveal meaning, usage, synonyms & antonyms.</p>
      </div>

      <div className="h-2 rounded-full bg-ink3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet to-mint transition-all" style={{ width: `${((idx + 1) / VOCAB.length) * 100}%` }} />
      </div>

      <div className="relative" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.button
              key="front" onClick={() => setFlipped(true)}
              initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0 }} transition={{ duration: 0.3 }}
              className="card w-full p-10 text-center min-h-[320px] flex flex-col items-center justify-center gap-4"
            >
              <span className="chip bg-violet/15 text-violet">{w.pos}</span>
              <div className="display text-5xl font-bold text-gradient-cool">{w.word}</div>
              {w.root && <div className="text-sm text-paper/40">Root: {w.root}</div>}
              <div className="text-paper/40 text-sm mt-4">Tap to reveal →</div>
              {learned && <span className="chip bg-mint/15 text-mint">✓ Learned</span>}
            </motion.button>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0 }} transition={{ duration: 0.3 }}
              className="card w-full p-7 min-h-[320px] space-y-4"
            >
              <div className="flex items-center gap-3">
                <BotFace expression="happy" size={44} />
                <div className="display text-3xl font-bold">{w.word} <span className="text-base text-paper/40 font-sans">/{w.pos}/</span></div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-orange font-bold mb-1">Meaning</div>
                <div className="text-paper/90">{w.meaning}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-sky font-bold mb-1">Used in a sentence</div>
                <div className="text-paper/80 italic">"{w.sentence}"</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-mint font-bold mb-1">Synonyms</div>
                  <div className="flex flex-wrap gap-1.5">{w.synonyms.map((s) => <span key={s} className="chip bg-mint/10 text-mint">{s}</span>)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-rose font-bold mb-1">Antonyms</div>
                  <div className="flex flex-wrap gap-1.5">{w.antonyms.map((s) => <span key={s} className="chip bg-rose/10 text-rose">{s}</span>)}</div>
                </div>
              </div>
              {w.tip && <div className="glass rounded-xl px-4 py-2 text-sm text-gold/90">💡 {w.tip}</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button onClick={prev} className="btn-ghost">← Prev</button>
        <button onClick={markLearned} className="btn-mint flex-1">{learned ? "Next word →" : "Got it! (+5 XP)"}</button>
        <button onClick={next} className="btn-ghost">Skip →</button>
      </div>
    </div>
  );
}
