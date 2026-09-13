"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BrainCircuit, CheckCircle2, Layers3, Sparkles, Target } from "lucide-react";
import { QA_TOPICS, VARC_TOPICS } from "@/lib/content";
import { useApp } from "@/lib/store";

export default function PracticePage() {
  const { attempts } = useApp();
  const [tab, setTab] = useState<"QA" | "VARC">("QA");
  const reduceMotion = useReducedMotion();
  const topics = tab === "QA" ? QA_TOPICS : VARC_TOPICS;
  const attemptsFor = (slug: string) => attempts.filter((attempt) => attempt.kind.includes(slug)).length;

  return (
    <div className="space-y-7">
      <section className="grid gap-6 rounded-[30px] border border-white/[0.08] bg-[#101e31] p-6 md:grid-cols-[1fr_280px] md:p-9">
        <div><div className="eyebrow">Topic practice</div><h1 className="display mt-3 text-4xl font-semibold md:text-6xl">Build the method.<br /><span className="text-orange">Then build the speed.</span></h1><p className="mt-5 max-w-2xl text-sm leading-6 text-paper/50">Five difficulty ramps per topic, with an adaptive explanation after every answer: concept, method, trap, faster route and final takeaway.</p></div>
        <div className="grid grid-cols-2 gap-3 self-end"><div className="metric"><Target size={18} className="mb-5 text-mint" /><div className="text-2xl font-bold">19</div><div className="text-[10px] text-paper/35">topic tracks</div></div><div className="metric"><Layers3 size={18} className="mb-5 text-violet" /><div className="text-2xl font-bold">5×</div><div className="text-[10px] text-paper/35">difficulty ramp</div></div></div>
      </section>

      <div className="flex items-center justify-between gap-4"><div className="flex rounded-xl border border-white/[0.08] bg-white/[0.025] p-1" role="tablist">{(["QA", "VARC"] as const).map((value) => <button key={value} onClick={() => setTab(value)} role="tab" aria-selected={tab === value} className={`min-h-10 rounded-lg px-5 text-xs font-bold transition ${tab === value ? "bg-paper text-ink" : "text-paper/40 hover:text-paper"}`}>{value === "QA" ? "Quantitative Ability" : "Verbal Ability"}</button>)}</div><div className="hidden items-center gap-2 text-xs text-paper/35 sm:flex"><Sparkles size={14} className="text-gold" /> Explanations expand when you need them</div></div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic, index) => {
          const count = attemptsFor(topic.slug);
          return (
            <motion.article key={topic.slug} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: index * .025 }}>
              <Link href={`/practice/${topic.slug}`} className="card card-hover group flex min-h-[245px] flex-col p-5">
                <div className="flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl border text-xl font-bold" style={{ background: `${topic.color}10`, borderColor: `${topic.color}28`, color: topic.color }}>{topic.icon}</div>{count > 0 ? <span className="chip bg-mint/10 text-mint"><CheckCircle2 size={12} /> {count} attempt{count > 1 ? "s" : ""}</span> : <span className="text-[10px] font-bold uppercase tracking-wider text-paper/20">Track {String(index + 1).padStart(2, "0")}</span>}</div>
                <div className="mt-7 flex-1"><h2 className="text-lg font-bold transition group-hover:text-orange">{topic.name}</h2><p className="mt-2 text-xs leading-5 text-paper/40">{topic.blurb}</p><div className="mt-4 flex flex-wrap gap-1.5">{topic.subtopics.slice(0, 3).map((subtopic) => <span key={subtopic} className="rounded-md bg-white/[0.045] px-2 py-1 text-[9px] font-semibold text-paper/35">{subtopic}</span>)}</div></div>
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4"><span className="text-[10px] font-semibold text-paper/30">150 questions · 5 sets</span><span className="flex items-center gap-1 text-xs font-bold text-orange">Open <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></div>
              </Link>
            </motion.article>
          );
        })}
      </div>

      <div className="paper-panel flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center"><div className="flex gap-3"><BrainCircuit size={21} className="mt-0.5 shrink-0" /><div><div className="text-sm font-bold">A wrong answer is now a learning asset.</div><div className="mt-1 text-xs text-ink/60">Every miss automatically enters your mistake notebook for spaced revision.</div></div></div><Link href="/revision" className="text-xs font-bold">Open mistake book →</Link></div>
    </div>
  );
}
