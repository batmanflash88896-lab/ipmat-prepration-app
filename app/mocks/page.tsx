"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCKS } from "@/lib/mocks";
import { SectionTitle, Chip } from "@/components/ui";
import { BotBubble } from "@/components/AiBot";
import { useApp } from "@/lib/store";
import { useState } from "react";

export default function MocksPage() {
  const { attempts } = useApp();
  const [filter, setFilter] = useState("All");
  const exams = ["All", "IPMAT Indore", "IPMAT Rohtak", "JIPMAT", "Sectional"];
  const list = filter === "All" ? MOCKS : MOCKS.filter((m) => m.exam === filter);

  function best(slug: string) {
    const rel = attempts.filter((a) => a.kind === `mock:${slug}`);
    if (!rel.length) return null;
    return Math.max(...rel.map((a) => Math.round((a.correct / a.total) * 100)));
  }

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Mock Tests" title="Full IIM-pattern mocks & PYQs" sub="Exam-accurate sections and timing for IPMAT Indore, Rohtak, JIPMAT, plus sectionals and previous-year-pattern papers." />
      <BotBubble expression="calm" text={<>Treat each mock like the real exam: one sitting, timer on, no distractions. Afterwards, I'll break down your accuracy, speed and weak areas in Analytics. 🎯</>} />

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {exams.map((e) => (
          <button key={e} onClick={() => setFilter(e)} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${filter === e ? "bg-orange text-ink shadow-glow" : "bg-white/5 text-paper/60"}`}>{e}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {list.map((m, i) => {
          const b = best(m.slug);
          const totalQ = m.sections.reduce((s, x) => s + x.count, 0);
          return (
            <motion.div key={m.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link href={`/mocks/${m.slug}`} className="card card-hover p-5 block h-full">
                <div className="flex items-start justify-between mb-3">
                  <Chip color={m.color}>{m.badge}</Chip>
                  <div className="flex gap-2">
                    {m.pyq && <span className="chip bg-gold/15 text-gold">PYQ {m.year}</span>}
                    {b != null && <span className="chip bg-mint/15 text-mint">Best {b}%</span>}
                  </div>
                </div>
                <div className="font-semibold text-lg">{m.title}</div>
                <div className="text-sm text-paper/50 mt-1">{m.pattern}</div>
                <div className="flex flex-wrap gap-3 mt-4 text-xs text-paper/60">
                  <span>⏱ {m.durationMin} min</span>
                  <span>📝 {totalQ} questions</span>
                  <span>📚 {m.sections.length} section{m.sections.length > 1 ? "s" : ""}</span>
                </div>
                <div className="mt-4 btn-primary w-full justify-center text-sm">View & Start →</div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
