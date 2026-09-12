"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { VIDEOS } from "@/lib/videos";
import { SectionTitle, Chip } from "@/components/ui";
import { BotBubble } from "@/components/AiBot";
import { useState } from "react";

export default function VideosPage() {
  const [f, setF] = useState<"All" | "QA" | "VARC">("All");
  const list = f === "All" ? VIDEOS : VIDEOS.filter((v) => v.section === f);
  return (
    <div className="space-y-6">
      <SectionTitle kicker="Video Lessons" title="AI-narrated topic teaching" sub="Short, animated lessons with voice narration, on-screen equations, PYQ notes, common traps and a practice quiz after each video." />
      <BotBubble expression="wow" text={<>Each lesson teaches the concept, shows worked examples, warns you about the classic traps, then quizzes you. Turn on narration and learn hands-free! 🎧</>} />

      <div className="flex gap-2">
        {(["All", "QA", "VARC"] as const).map((t) => (
          <button key={t} onClick={() => setF(t)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${f === t ? "bg-orange text-ink shadow-glow" : "bg-white/5 text-paper/60"}`}>{t === "All" ? "All lessons" : t}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((v, i) => (
          <motion.div key={v.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link href={`/videos/${v.slug}`} className="card card-hover block overflow-hidden group">
              <div className="relative h-36 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${v.color}33, ${v.color}11)` }}>
                <div className="absolute inset-0 grid-bg opacity-40" />
                <div className="relative w-14 h-14 rounded-full grid place-items-center text-2xl group-hover:scale-110 transition-transform" style={{ background: v.color, color: "#08111F" }}>▶</div>
                <span className="absolute bottom-2 right-2 chip bg-ink/70 text-paper/80">{v.minutes} min</span>
                <span className="absolute top-2 left-2" ><Chip color={v.color}>{v.level}</Chip></span>
              </div>
              <div className="p-4">
                <div className="font-semibold group-hover:text-orange transition-colors">{v.title}</div>
                <div className="text-sm text-paper/50 mt-1 line-clamp-2">{v.summary}</div>
                <div className="text-xs text-paper/40 mt-2">{v.segments.length} segments · quiz included</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
