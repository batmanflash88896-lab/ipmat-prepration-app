"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { topicBySlug } from "@/lib/content";
import { SectionTitle } from "@/components/ui";
import { BotBubble } from "@/components/AiBot";
import { useApp } from "@/lib/store";
import { VIDEOS } from "@/lib/videos";

const DIFFS = ["Warm-up", "Foundation", "Exam-level", "Challenge", "Mastery"];
const DIFF_COLORS = ["#78F2C0", "#4FC3F7", "#FFC15E", "#FF6B35", "#FF5D8F"];

export default function TopicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const topic = topicBySlug(slug);
  const { attempts } = useApp();

  if (!topic) return <div className="card p-8">Topic not found. <Link href="/practice" className="text-orange">Back to practice</Link></div>;

  const relatedVideo = VIDEOS.find((v) => v.quizTopic === slug);
  const isVARC = topic.section === "VARC";
  const practiceSlug = isVARC ? (slug === "rc" ? "vocab" : slug === "para-jumbles" ? "vocab" : slug === "grammar" ? "vocab" : slug === "critical-reasoning" ? "vocab" : slug) : slug;

  function bestScore(testNo: number) {
    const rel = attempts.filter((a) => a.kind === `practice:${slug}:${testNo}`);
    if (!rel.length) return null;
    return Math.max(...rel.map((a) => Math.round((a.correct / a.total) * 100)));
  }

  return (
    <div className="space-y-6">
      <Link href="/practice" className="text-sm text-paper/50 hover:text-orange">← Practice Arena</Link>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl grid place-items-center text-3xl font-bold" style={{ background: `${topic.color}22`, color: topic.color }}>{topic.icon}</div>
        <div>
          <h1 className="display text-4xl font-bold">{topic.name}</h1>
          <p className="text-paper/50">{topic.blurb}</p>
        </div>
      </div>

      <BotBubble expression="happy" text={<>Each test has <b>30 questions</b> with a live timer. New numbers every attempt, so you can practise endlessly. Aim for accuracy first, then speed. Let's go! 💪</>} />

      {/* Subtopic explanations */}
      <div className="card p-6">
        <h2 className="display text-2xl font-semibold mb-1">Subtopics covered</h2>
        <p className="text-paper/50 text-sm mb-4">Every subtopic below appears in these practice sets, each with worked solutions.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {topic.subtopics.map((s, i) => (
            <div key={s} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5">
              <span className="shrink-0 w-7 h-7 rounded-lg grid place-items-center text-sm font-bold" style={{ background: `${topic.color}22`, color: topic.color }}>{i + 1}</span>
              <span className="text-sm text-paper/85">{s}</span>
            </div>
          ))}
        </div>
        {relatedVideo && (
          <Link href={`/videos/${relatedVideo.slug}`} className="btn-ghost mt-4 inline-flex">▶ Watch the {topic.name} video lesson</Link>
        )}
      </div>

      {/* Practice tests */}
      <SectionTitle title="Practice Tests" sub="5 tests · 30 questions each · timed · gamified with XP and combos." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map((n, i) => {
          const best = bestScore(n);
          return (
            <motion.div key={n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/test/practice/${practiceSlug}/${n}?label=${encodeURIComponent(topic.name)}&realslug=${slug}`} className="card card-hover p-5 block">
                <div className="flex items-center justify-between mb-3">
                  <span className="chip" style={{ background: `${DIFF_COLORS[i]}22`, color: DIFF_COLORS[i] }}>{DIFFS[i]}</span>
                  {best != null && <span className="text-xs text-mint font-bold">Best {best}%</span>}
                </div>
                <div className="font-semibold text-lg">Practice Test {n}</div>
                <div className="text-sm text-paper/50 mt-1">30 questions · ~25 min</div>
                <div className="mt-4 btn-primary w-full justify-center text-sm">Start Test {n} →</div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
