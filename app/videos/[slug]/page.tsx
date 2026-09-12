"use client";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { videoBySlug } from "@/lib/videos";
import { BotFace } from "@/components/AiBot";
import { Chip } from "@/components/ui";
import QuizRunner from "@/components/QuizRunner";
import { buildQATest } from "@/lib/qaGen";
import { buildVARCSet } from "@/lib/varc";
import { QA_GENERATORS } from "@/lib/qaGen";
import { hashSeed } from "@/lib/rng";
import { useApp } from "@/lib/store";

export default function VideoDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const v = videoBySlug(slug);
  const { addXp } = useApp();
  const [seg, setSeg] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [audioOk, setAudioOk] = useState(true);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const awardedRef = useRef(false);

  const quiz = useMemo(() => {
    if (!v) return [];
    if (QA_GENERATORS[v.quizTopic]) return buildQATest(v.quizTopic, hashSeed("videoquiz", v.slug), 5);
    return buildVARCSet(hashSeed("videoquiz", v.slug), 5);
  }, [slug]);

  const audioSrc = v ? `/audio/${v.slug}-${seg}.mp3` : "";

  // advance logic
  useEffect(() => {
    if (!playing || !v) return;
    // If audio available, let audio 'ended' drive; else use a fallback timer based on text length
    if (!audioOk) {
      const dur = Math.max(6000, v.segments[seg].narration.length * 55);
      timerRef.current = setTimeout(() => advance(), dur);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [playing, seg, audioOk, slug]);

  useEffect(() => {
    if (!v) return;
    if (playing && audioOk && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => setAudioOk(false));
    }
  }, [seg, playing, audioOk]);

  function advance() {
    if (!v) return;
    if (seg < v.segments.length - 1) setSeg((s) => s + 1);
    else { setPlaying(false); if (!awardedRef.current) { addXp(15); awardedRef.current = true; } }
  }

  if (!v) return <div className="card p-8">Lesson not found. <Link href="/videos" className="text-orange">Back</Link></div>;

  if (showQuiz) {
    return (
      <div>
        <div className="max-w-3xl mx-auto mb-4"><button onClick={() => setShowQuiz(false)} className="text-sm text-paper/50 hover:text-orange">← Back to lesson</button></div>
        <QuizRunner questions={quiz} title={`${v.title} · Quiz`} kind={`video:${v.slug}`} />
      </div>
    );
  }

  const s = v.segments[seg];

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <Link href="/videos" className="text-sm text-paper/50 hover:text-orange">← Video Lessons</Link>

      {/* Player */}
      <div className="card overflow-hidden">
        <div className="relative aspect-video flex flex-col items-center justify-center p-6 md:p-10" style={{ background: `linear-gradient(135deg, ${v.color}22, #08111F)` }}>
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute top-3 left-3 flex gap-2"><Chip color={v.color}>{v.topic}</Chip><span className="chip bg-ink/60 text-paper/70">Segment {seg + 1}/{v.segments.length}</span></div>

          <AnimatePresence mode="wait">
            <motion.div key={seg} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="relative text-center max-w-2xl">
              <motion.div animate={playing ? { rotate: [0, -4, 4, 0] } : {}} transition={{ repeat: Infinity, duration: 2 }} className="flex justify-center mb-4">
                <BotFace expression={playing ? (seg % 2 ? "happy" : "cheer") : "calm"} size={72} />
              </motion.div>
              <h2 className="display text-2xl md:text-3xl font-bold mb-4" style={{ color: v.color }}>{s.heading}</h2>
              <div className="space-y-2">
                {s.onScreen.map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.25 }}
                    className="inline-block mx-1 glass rounded-xl px-3 py-1.5 font-mono text-sm md:text-base">{line}</motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* captions */}
          <div className="absolute bottom-3 inset-x-3">
            <div className="glass rounded-xl px-4 py-2 text-sm text-paper/85 text-center">{s.narration}</div>
          </div>
        </div>

        {/* controls */}
        <div className="p-4 flex items-center gap-3">
          <button onClick={() => { setPlaying((p) => !p); }} className="btn-primary">{playing ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={() => { setSeg(0); setPlaying(true); awardedRef.current = false; }} className="btn-ghost">↺ Restart</button>
          <button onClick={() => setMuted((m) => !m)} className="btn-ghost">{muted ? "🔇" : "🔊"}</button>
          <div className="flex-1 flex gap-1">
            {v.segments.map((_, i) => (
              <button key={i} onClick={() => setSeg(i)} className={`h-1.5 flex-1 rounded-full transition-all ${i === seg ? "bg-orange" : i < seg ? "bg-mint/50" : "bg-white/10"}`} />
            ))}
          </div>
        </div>
        <audio ref={audioRef} src={audioSrc} muted={muted} onEnded={advance} onError={() => setAudioOk(false)} />
      </div>

      {!audioOk && <div className="text-xs text-paper/40 text-center">Narration audio for this lesson isn't generated yet — captions & animation play with auto-timing. (The first lesson has full AI voice narration.)</div>}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="display text-xl font-semibold mb-2">What you'll learn</h3>
          <ul className="space-y-1.5 text-sm text-paper/80">{v.learn.map((l, i) => <li key={i} className="flex gap-2"><span className="text-mint">✓</span>{l}</li>)}</ul>
        </div>
        <div className="card p-5">
          <h3 className="display text-xl font-semibold mb-2 text-gold">⚠ Common traps</h3>
          <ul className="space-y-1.5 text-sm text-paper/80">{v.traps.map((l, i) => <li key={i} className="flex gap-2"><span className="text-rose">!</span>{l}</li>)}</ul>
        </div>
      </div>

      {v.pyqNote && (
        <div className="card p-5 flex gap-3">
          <BotFace expression="think" size={40} />
          <div><b className="text-gold">PYQ insight:</b> <span className="text-paper/80 text-sm">{v.pyqNote}</span></div>
        </div>
      )}

      <button onClick={() => setShowQuiz(true)} className="btn-mint w-full text-lg">Take the practice quiz (5 Qs) →</button>
    </div>
  );
}
