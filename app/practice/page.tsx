"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { QA_TOPICS, VARC_TOPICS } from "@/lib/content";
import { SectionTitle, Chip } from "@/components/ui";
import { BotBubble } from "@/components/AiBot";
import { useApp } from "@/lib/store";
import { useState } from "react";

export default function PracticePage() {
  const { attempts } = useApp();
  const [tab, setTab] = useState<"QA" | "VARC">("QA");
  const topics = tab === "QA" ? QA_TOPICS : VARC_TOPICS;

  function topicAttempts(slug: string) {
    return attempts.filter((a) => a.kind.includes(slug)).length;
  }

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Practice Arena" title="Drill any topic, gamified" sub="Every topic has 5 practice tests · 30 questions each · countdown timer · XP, combos & streaks. Practice topics whether you've studied them or not." />

      <BotBubble expression="cheer" text={<>Pick a topic and smash <b>Practice Test 1</b>. Get a 3-answer streak for a confetti combo! Every question shows a full step-by-step solution and the common trap.</>} />

      <div className="flex gap-2">
        <button onClick={() => setTab("QA")} className={`px-5 py-2.5 rounded-full font-semibold transition-all ${tab === "QA" ? "bg-orange text-ink shadow-glow" : "bg-white/5 text-paper/60"}`}>Quantitative Ability</button>
        <button onClick={() => setTab("VARC")} className={`px-5 py-2.5 rounded-full font-semibold transition-all ${tab === "VARC" ? "bg-violet text-ink shadow-glow" : "bg-white/5 text-paper/60"}`}>Verbal (VARC)</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((t, i) => (
          <motion.div key={t.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Link href={`/practice/${t.slug}`} className="card card-hover p-5 block h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl grid place-items-center text-xl font-bold" style={{ background: `${t.color}22`, color: t.color }}>{t.icon}</div>
                {topicAttempts(t.slug) > 0 && <Chip color="#78F2C0">{topicAttempts(t.slug)} attempts</Chip>}
              </div>
              <div className="font-semibold text-lg">{t.name}</div>
              <div className="text-sm text-paper/50 mt-1">{t.blurb}</div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {t.subtopics.slice(0, 3).map((s) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-paper/50">{s}</span>
                ))}
                {t.subtopics.length > 3 && <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-paper/40">+{t.subtopics.length - 3}</span>}
              </div>
              <div className="mt-4 text-xs text-orange font-semibold">5 practice tests →</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
