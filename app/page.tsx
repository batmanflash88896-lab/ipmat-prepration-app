"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, BookOpenCheck, BrainCircuit, Check, ChevronRight,
  CircleGauge, Clock3, Play, Sparkles, Target, Trophy,
} from "lucide-react";
import { useApp, levelFromXp, isDailyDone } from "@/lib/store";
import { Ring, AnimatedNumber } from "@/components/ui";
import { VOCAB } from "@/lib/vocab";
import { QA_TOPICS } from "@/lib/content";
import StudyOrbit from "@/components/StudyOrbit";
import { BlurFade } from "@/components/registry/blur-fade";

function daysTo(dateStr: string) {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000));
}

const DAILY = [
  { key: "daily-qa", label: "Daily QA pressure set", meta: "5 mixed questions · 8 min", href: "/daily/qa", icon: BrainCircuit, color: "#FF6B35" },
  { key: "daily-varc", label: "VARC precision drill", meta: "Vocabulary · logic · usage", href: "/daily/varc", icon: BookOpenCheck, color: "#8B7CF6" },
  { key: "daily-rc", label: "Daily long-form RC", meta: "Inference-first reading", href: "/varc/rc", icon: CircleGauge, color: "#45C4A0" },
];

export default function Home() {
  const app = useApp();
  const reduceMotion = useReducedMotion();
  const { profile, xp, streak, attempts, dailyDone, ready } = app;
  const { level, pct, toNext } = levelFromXp(xp);
  if (!ready) return <div className="h-72 animate-pulse-soft rounded-3xl bg-white/[0.03]" />;

  const totalQ = attempts.reduce((sum, attempt) => sum + attempt.total, 0);
  const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
  const accuracy = totalQ ? Math.round(totalCorrect / totalQ * 100) : 0;
  const days = daysTo(profile.examDate);
  const word = VOCAB[new Date().getDate() % VOCAB.length];
  const doneCount = DAILY.filter((item) => isDailyDone(dailyDone, item.key)).length;
  const nextTask = DAILY.find((item) => !isDailyDone(dailyDone, item.key)) ?? DAILY[0];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[36px] border border-white/[0.1] bg-[linear-gradient(135deg,#111f35_0%,#0a1425_52%,#171126_100%)] px-6 py-8 shadow-[0_45px_100px_-50px_rgba(0,0,0,1)] md:px-10 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(255,107,53,.17),transparent_30%),radial-gradient(circle_at_92%_75%,rgba(114,103,240,.2),transparent_32%)]" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_500px]">
          <BlurFade>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-orange/25 bg-orange/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-orange">AI-powered mastery system</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold text-paper/50">{days} days to {profile.targetExam}</span>
            </div>
            <h1 className="display max-w-3xl text-5xl font-semibold leading-[.98] md:text-7xl">
              Turn effort into an <span className="text-gradient">IIM result.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-paper/55 md:text-base">A focused preparation cockpit that finds your weak patterns, pushes you above exam level, and turns every mistake into the next advantage.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={nextTask.href} className="btn-primary"><Play size={16} fill="currentColor" /> Continue today’s plan <ArrowRight size={16} /></Link>
              <Link href="/mocks" className="btn-ghost"><Clock3 size={16} /> Take elite mock</Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold text-paper/35"><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> Adaptive explanations</span><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-orange" /> Above-PYQ mocks</span><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-violet" /> Precision analytics</span></div>
          </BlurFade>
          <BlurFade delay={0.12} className="hidden lg:block"><StudyOrbit /></BlurFade>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Questions solved", value: totalQ, suffix: "", note: "Lifetime attempts", icon: BrainCircuit, color: "text-orange" },
          { label: "Precision", value: accuracy, suffix: "%", note: totalQ ? "Across all sets" : "Complete your first set", icon: Target, color: "text-mint" },
          { label: "Experience", value: xp, suffix: " XP", note: `${toNext} to level ${level + 1}`, icon: Trophy, color: "text-gold" },
          { label: "Mistakes due", value: app.mistakes.filter((m) => !m.reviewed).length, suffix: "", note: "Review within 24 hours", icon: Sparkles, color: "text-violet" },
        ].map((metric) => { const Icon = metric.icon; return (
          <div key={metric.label} className="metric group">
            <div className="mb-5 flex items-center justify-between"><span className="text-xs font-semibold text-paper/45">{metric.label}</span><Icon size={17} className={metric.color} /></div>
            <div className="text-2xl font-bold"><AnimatedNumber value={metric.value} suffix={metric.suffix} /></div>
            <div className="mt-1 text-[11px] text-paper/35">{metric.note}</div>
          </div>
        ); })}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.45fr_.8fr]">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div><div className="eyebrow">Daily protocol</div><h2 className="display mt-1 text-3xl font-semibold">Three moves for today</h2></div>
            <span className="chip bg-mint/10 text-mint">{doneCount}/3 complete</span>
          </div>
          <div className="space-y-3">
            {DAILY.map((item, index) => {
              const Icon = item.icon; const done = isDailyDone(dailyDone, item.key);
              return (
                <motion.div key={item.key} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35, delay: index * .06 }}>
                  <Link href={item.href} className="card card-hover group flex items-center gap-4 p-4 md:p-5">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border" style={{ background: `${item.color}12`, borderColor: `${item.color}28`, color: item.color }}>{done ? <Check size={21} /> : <Icon size={21} />}</div>
                    <div className="min-w-0 flex-1"><div className="font-bold">{item.label}</div><div className="mt-1 text-xs text-paper/40">{item.meta}</div></div>
                    <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold sm:block ${done ? "bg-mint/10 text-mint" : "bg-white/[0.05] text-paper/35"}`}>{done ? "DONE" : index === doneCount ? "NEXT" : "QUEUED"}</span>
                    <ChevronRight size={17} className="text-paper/25 transition group-hover:translate-x-1 group-hover:text-orange" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        <aside className="paper-panel flex flex-col justify-between p-6">
          <div><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-ink/50">Lexicon / today</span><BookOpenCheck size={18} /></div><div className="display mt-8 text-4xl font-bold">{word.word}</div><div className="mt-1 text-xs font-bold uppercase tracking-wider text-orange">{word.pos}</div><p className="mt-4 text-sm leading-6 text-ink/70">{word.meaning}</p><p className="mt-4 border-l-2 border-orange pl-3 text-xs italic leading-5 text-ink/55">“{word.sentence}”</p></div>
          <Link href="/varc/vocab" className="mt-8 inline-flex items-center gap-2 text-sm font-bold">Open vocabulary studio <ArrowRight size={15} /></Link>
        </aside>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between"><div><div className="eyebrow">Skill map</div><h2 className="display mt-1 text-3xl font-semibold">High-leverage topics</h2></div><Link href="/practice" className="text-xs font-bold text-orange">View all topics →</Link></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QA_TOPICS.slice(0, 4).map((topic, index) => (
            <Link key={topic.slug} href={`/practice/${topic.slug}`} className="card card-hover group p-5">
              <div className="mb-8 flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl text-lg font-bold" style={{ color: topic.color, background: `${topic.color}14` }}>{topic.icon}</span><span className="text-[10px] font-bold text-paper/25">0{index + 1}</span></div>
              <h3 className="font-bold group-hover:text-orange">{topic.name}</h3><p className="mt-2 text-xs leading-5 text-paper/40">{topic.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="card flex flex-col items-center justify-between gap-5 overflow-hidden p-6 md:flex-row md:p-7">
        <div className="flex items-center gap-5"><Ring value={pct} size={68} stroke={6} color="#FF6B35" label={<span className="text-sm font-bold">L{level}</span>} /><div><div className="text-sm font-bold">Your preparation is compounding.</div><div className="mt-1 text-xs text-paper/40">The system adapts from attempts, accuracy and your mistake notebook.</div></div></div>
        <Link href="/planner" className="btn-ghost shrink-0">Review weekly plan <ArrowRight size={15} /></Link>
      </div>
    </div>
  );
}
