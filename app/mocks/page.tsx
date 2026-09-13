"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpenCheck, CheckCircle2, Clock3, FileText, ShieldCheck, Sparkles, Target } from "lucide-react";
import { MOCKS } from "@/lib/mocks";
import { useApp } from "@/lib/store";

export default function MocksPage() {
  const { attempts } = useApp();
  const [filter, setFilter] = useState("All");
  const reduceMotion = useReducedMotion();
  const exams = ["All", "IPMAT Indore", "IPMAT Rohtak", "JIPMAT", "Sectional"];
  const mocks = filter === "All" ? MOCKS : MOCKS.filter((mock) => mock.exam === filter);
  const best = (slug: string) => {
    const scores = attempts.filter((attempt) => attempt.kind === `mock:${slug}`).map((attempt) => Math.round(attempt.correct / attempt.total * 100));
    return scores.length ? Math.max(...scores) : null;
  };

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-gradient-to-br from-[#13233a] to-[#0b1728] p-6 md:p-9">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[50px] border-violet/10" />
        <div className="relative max-w-3xl"><div className="eyebrow">Simulation lab</div><h1 className="display mt-3 text-4xl font-semibold md:text-6xl">Pressure-tested mocks.<br /><span className="text-violet">Honest explanations.</span></h1><p className="mt-5 max-w-2xl text-sm leading-6 text-paper/50 md:text-base">Full exam structures for Indore, Rohtak and JIPMAT. Every question is original, difficult, and tagged honestly—pattern-informed, never passed off as an official paper.</p></div>
        <div className="relative mt-7 flex flex-wrap gap-2 text-[11px] font-bold text-paper/55"><span className="chip bg-white/[0.05]"><ShieldCheck size={13} className="text-mint" /> Original question bank</span><span className="chip bg-white/[0.05]"><Target size={13} className="text-orange" /> Exam-accurate counts</span><span className="chip bg-white/[0.05]"><BookOpenCheck size={13} className="text-violet" /> Adaptive deep review</span></div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" role="tablist" aria-label="Filter mock tests">
        {exams.map((exam) => <button key={exam} onClick={() => setFilter(exam)} role="tab" aria-selected={filter === exam} className={`min-h-10 whitespace-nowrap rounded-xl px-4 text-xs font-bold transition ${filter === exam ? "bg-paper text-ink shadow-[3px_3px_0_#ff6b35]" : "border border-white/[0.08] bg-white/[0.03] text-paper/50 hover:text-paper"}`}>{exam}</button>)}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mocks.map((mock, index) => {
          const score = best(mock.slug); const total = mock.sections.reduce((sum, section) => sum + section.count, 0);
          return (
            <motion.article key={mock.slug} initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35, delay: index * .05 }} className="card group overflow-hidden">
              <Link href={`/mocks/${mock.slug}`} className="block h-full p-5 md:p-6">
                <div className="mb-8 flex items-start justify-between gap-3"><div className="flex flex-wrap gap-2"><span className="chip" style={{ color: mock.color, background: `${mock.color}14` }}>{mock.badge}</span><span className={`chip ${mock.difficulty === "Elite" ? "bg-rose/10 text-rose" : "bg-gold/10 text-gold"}`}>{mock.difficulty}</span></div>{score !== null && <span className="chip bg-mint/10 text-mint"><CheckCircle2 size={12} /> Best {score}%</span>}</div>
                <h2 className="display text-2xl font-semibold transition group-hover:text-orange">{mock.title}</h2><p className="mt-3 min-h-[44px] text-sm leading-5 text-paper/45">{mock.pattern}</p>
                <div className="mt-6 grid grid-cols-3 gap-2 border-y border-white/[0.07] py-4">
                  <div><Clock3 size={15} className="mb-1.5 text-paper/30" /><div className="text-sm font-bold">{mock.durationMin} min</div><div className="text-[9px] uppercase tracking-wide text-paper/30">Timer</div></div>
                  <div><FileText size={15} className="mb-1.5 text-paper/30" /><div className="text-sm font-bold">{total}</div><div className="text-[9px] uppercase tracking-wide text-paper/30">Questions</div></div>
                  <div><Sparkles size={15} className="mb-1.5 text-paper/30" /><div className="text-sm font-bold">{mock.sections.length}</div><div className="text-[9px] uppercase tracking-wide text-paper/30">Sections</div></div>
                </div>
                <div className="mt-5 flex items-center justify-between"><span className="text-[11px] font-semibold text-paper/35">{mock.marking}</span><span className="flex items-center gap-2 text-xs font-bold text-orange">Open simulation <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span></div>
              </Link>
            </motion.article>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gold/15 bg-gold/[0.06] p-4 text-xs leading-5 text-paper/55"><b className="text-gold">Content integrity:</b> “2024/2025 pattern benchmark” means an original Aptivo paper built to the reported format and difficulty—not a copied, recalled, or IIM-issued paper. This keeps practice honest and lets every solution be independently verified.</div>
    </div>
  );
}
