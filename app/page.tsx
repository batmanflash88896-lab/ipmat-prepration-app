"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApp, levelFromXp, isDailyDone } from "@/lib/store";
import { BotBubble } from "@/components/AiBot";
import { Ring, AnimatedNumber, Chip } from "@/components/ui";
import { VOCAB } from "@/lib/vocab";
import { QA_TOPICS } from "@/lib/content";

function daysTo(dateStr: string) {
  const d = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  return Math.max(0, d);
}

const TIPS = [
  "Accuracy beats speed early on. Lock in accuracy, then push the clock.",
  "Review every wrong answer the same day — that's where real gains hide.",
  "Two 20% discounts aren't 40% off. They're 36%. Traps love percentages!",
  "In RC, never use outside knowledge. The answer is always in the passage.",
  "For time & work, add the rates — never average the times.",
];

export default function Home() {
  const app = useApp();
  const { profile, xp, streak, attempts, dailyDone, ready } = app;
  const { level, pct, toNext } = levelFromXp(xp);
  if (!ready) return null;

  const totalQ = attempts.reduce((s, a) => s + a.total, 0);
  const totalCorrect = attempts.reduce((s, a) => s + a.correct, 0);
  const accuracy = totalQ ? Math.round((totalCorrect / totalQ) * 100) : 0;
  const word = VOCAB[new Date().getDate() % VOCAB.length];
  const tip = TIPS[new Date().getDate() % TIPS.length];
  const dLeft = daysTo(profile.examDate);

  const dailies = [
    { key: "daily-qa", label: "Daily QA Challenge", desc: "5 mixed quant questions", href: "/daily/qa", color: "#FF6B35", icon: "🧮" },
    { key: "daily-varc", label: "Daily VARC Challenge", desc: "Vocab · idioms · usage", href: "/daily/varc", color: "#7267F0", icon: "📖" },
    { key: "daily-vocab", label: "Word of the Day", desc: word.word, href: "/varc/vocab", color: "#78F2C0", icon: "✨" },
    { key: "daily-rc", label: "Daily RC", desc: "One passage, exam-level", href: "/varc/rc", color: "#4FC3F7", icon: "📰" },
  ];
  const doneCount = dailies.filter((d) => isDailyDone(dailyDone, d.key)).length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 p-6 md:p-8 bg-gradient-to-br from-ink2 to-ink3">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-orange/20 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="flex-1">
            <div className="text-orange text-xs font-bold tracking-[0.2em] uppercase mb-2">Welcome back</div>
            <h1 className="display text-4xl md:text-5xl font-bold mb-2">Hi {profile.name || "Aspirant"} 👋</h1>
            <p className="text-paper/60 max-w-lg">Targeting <b className="text-paper">{profile.targetExam}</b> · <b className="text-orange">{dLeft}</b> days to go. Let's make today count.</p>
            <div className="mt-4"><BotBubble expression="happy" size={48} compact text={<>Tip of the day: {tip}</>} /></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Ring value={pct} color="#FF6B35" label={<div><div className="text-2xl font-bold">{level}</div><div className="text-[10px] text-paper/50">LEVEL</div></div>} />
              <div className="text-xs text-paper/50 mt-1">{toNext} XP to L{level + 1}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl">🔥</div>
              <div className="text-3xl font-bold text-orange"><AnimatedNumber value={streak} /></div>
              <div className="text-xs text-paper/50">day streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total XP", value: xp, color: "#78F2C0", icon: "⭐" },
          { label: "Questions solved", value: totalQ, color: "#FF6B35", icon: "✅" },
          { label: "Accuracy", value: accuracy, suffix: "%", color: "#7267F0", icon: "🎯" },
          { label: "Tests taken", value: attempts.length, color: "#FFC15E", icon: "📝" },
        ].map((s) => (
          <div key={s.label} className="card card-hover p-4">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}><AnimatedNumber value={s.value} suffix={s.suffix ?? ""} /></div>
            <div className="text-xs text-paper/50">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daily challenges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="display text-2xl font-semibold">Today's Challenges</h2>
          <Chip color="#78F2C0">{doneCount}/{dailies.length} done</Chip>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {dailies.map((d, i) => {
            const done = isDailyDone(dailyDone, d.key);
            return (
              <motion.div key={d.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={d.href} className="card card-hover p-5 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl" style={{ background: `${d.color}22` }}>{d.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2">{d.label} {done && <span className="text-mint text-sm">✓</span>}</div>
                    <div className="text-sm text-paper/50">{d.desc}</div>
                  </div>
                  <span className="text-paper/30 group-hover:text-orange group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick modules */}
      <div>
        <h2 className="display text-2xl font-semibold mb-4">Jump back in</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { href: "/practice", label: "Practice Arena", desc: "Topic drills & gamified tests", icon: "▦", color: "#FF6B35" },
            { href: "/mocks", label: "Mock Tests", desc: "5+ IIM patterns + PYQs", icon: "⏱", color: "#7267F0" },
            { href: "/videos", label: "Video Lessons", desc: "AI-narrated topic teaching", icon: "▶", color: "#FF5D8F" },
            { href: "/tutor", label: "AI Doubt Solver", desc: "Step-by-step, verified", icon: "✦", color: "#78F2C0" },
            { href: "/planner", label: "Study Planner", desc: "Adaptive daily plan", icon: "🗓", color: "#4FC3F7" },
            { href: "/leaderboard", label: "Leaderboard", desc: "Compete & climb", icon: "🏆", color: "#FFC15E" },
          ].map((m) => (
            <Link key={m.href} href={m.href} className="card card-hover p-5 group">
              <div className="w-11 h-11 rounded-2xl grid place-items-center text-xl mb-3" style={{ background: `${m.color}22`, color: m.color }}>{m.icon}</div>
              <div className="font-semibold group-hover:text-orange transition-colors">{m.label}</div>
              <div className="text-sm text-paper/50">{m.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular topics */}
      <div>
        <h2 className="display text-2xl font-semibold mb-4">Popular QA topics</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {QA_TOPICS.slice(0, 8).map((t) => (
            <Link key={t.slug} href={`/practice/${t.slug}`} className="card card-hover p-4 min-w-[150px] shrink-0">
              <div className="w-10 h-10 rounded-xl grid place-items-center text-lg font-bold mb-2" style={{ background: `${t.color}22`, color: t.color }}>{t.icon}</div>
              <div className="font-semibold text-sm">{t.name}</div>
              <div className="text-xs text-paper/40 mt-1">5 tests · 30 Qs each</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
