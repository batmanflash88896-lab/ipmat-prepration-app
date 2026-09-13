"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BotBubble } from "@/components/AiBot";
import { Chip, SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";

const FILTERS = ["To review", "Mastered", "All"] as const;
type Filter = (typeof FILTERS)[number];

export default function RevisionNotebook() {
  const { mistakes, toggleMistakeReviewed, clearReviewedMistakes, ready } = useApp();
  const [filter, setFilter] = useState<Filter>("To review");
  const [topic, setTopic] = useState("All topics");
  const [query, setQuery] = useState("");

  const topics = useMemo(() => [...new Set(mistakes.map((m) => m.topic))].sort(), [mistakes]);
  const visible = useMemo(() => mistakes.filter((mistake) => {
    if (filter === "To review" && mistake.reviewed) return false;
    if (filter === "Mastered" && !mistake.reviewed) return false;
    if (topic !== "All topics" && mistake.topic !== topic) return false;
    const search = query.trim().toLowerCase();
    return !search || `${mistake.stem} ${mistake.topic} ${mistake.subtopic}`.toLowerCase().includes(search);
  }), [filter, mistakes, query, topic]);

  if (!ready) return null;

  const pending = mistakes.filter((m) => !m.reviewed).length;
  const mastered = mistakes.length - pending;
  const mastery = mistakes.length ? Math.round((mastered / mistakes.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Smart revision"
        title="Mistake Notebook"
        sub="Every missed or skipped question is saved automatically. Review the method, learn the trap, then mark it mastered."
      />

      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="text-2xl font-bold text-gold">{pending}</div>
          <div className="text-xs text-paper/50">To review</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-mint">{mastered}</div>
          <div className="text-xs text-paper/50">Mastered</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-violet">{mastery}%</div>
          <div className="text-xs text-paper/50">Recovery rate</div>
        </div>
      </div>

      {!mistakes.length ? (
        <div className="card p-8 md:p-10 text-center space-y-5">
          <BotBubble expression="calm" text={<>Your notebook is clean. Complete a quiz and I&apos;ll collect every missed question here for focused revision.</>} />
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/daily/qa" className="btn-primary">Start daily QA</Link>
            <Link href="/practice" className="btn-ghost">Browse practice</Link>
          </div>
        </div>
      ) : (
        <>
          <BotBubble
            expression={pending ? "think" : "cheer"}
            text={pending
              ? <>You have <b className="text-gold">{pending} questions</b> waiting. Start with the common trap, then solve the question again without looking at the steps.</>
              : <>Notebook cleared — excellent recovery work! Keep practising to make your accuracy stick. 🎯</>}
          />

          <div className="card p-4 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {FILTERS.map((item) => (
                <button key={item} onClick={() => setFilter(item)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filter === item ? "bg-orange text-ink" : "bg-white/5 text-paper/60 hover:bg-white/10"}`}>
                  {item}
                </button>
              ))}
            </div>
            <div className="md:ml-auto flex flex-col sm:flex-row gap-3">
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-ink3 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange/50">
                <option>All topics</option>
                {topics.map((item) => <option key={item}>{item}</option>)}
              </select>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search mistakes…" className="bg-ink3 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-orange/50" />
            </div>
          </div>

          <div className="space-y-3">
            {visible.map((mistake, index) => (
              <article key={mistake.id} className={`card p-5 transition-all ${mistake.reviewed ? "opacity-70" : ""}`}>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs text-paper/40 font-semibold">#{index + 1}</span>
                  <Chip color="#FF6B35">{mistake.topic}</Chip>
                  <Chip color="#7267F0">{mistake.subtopic}</Chip>
                  <Chip color={mistake.difficulty === "Hard" ? "#FF5D8F" : mistake.difficulty === "Medium" ? "#FFC15E" : "#78F2C0"}>{mistake.difficulty}</Chip>
                  {mistake.reviewCount > 0 && <span className="text-xs text-paper/40">Reviewed {mistake.reviewCount}×</span>}
                  <span className="sm:ml-auto text-xs text-paper/40">{new Date(mistake.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>

                <h2 className="font-semibold text-lg leading-relaxed">{mistake.stem}</h2>
                <div className="grid sm:grid-cols-2 gap-2 mt-4 text-sm">
                  <div className="rounded-xl bg-rose/10 border border-rose/15 px-4 py-3">
                    <div className="text-xs text-rose/80 mb-1">Your answer</div>
                    <div>{mistake.chosenAnswer}</div>
                  </div>
                  <div className="rounded-xl bg-mint/10 border border-mint/15 px-4 py-3">
                    <div className="text-xs text-mint/80 mb-1">Correct answer</div>
                    <div>{mistake.correctAnswer}</div>
                  </div>
                </div>

                <details className="mt-4 rounded-2xl bg-white/[0.03] border border-white/5 group">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-sky flex justify-between">
                    Review solution <span className="group-open:rotate-90 transition-transform">→</span>
                  </summary>
                  <div className="border-t border-white/5 p-4 space-y-2 text-sm text-paper/80">
                    {mistake.solution.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex gap-3"><span className="text-orange font-bold">{stepIndex + 1}.</span><span>{step}</span></div>
                    ))}
                    {mistake.commonMistake && <div className="mt-3 rounded-xl bg-gold/10 px-3 py-2 text-gold">⚠ Common trap: {mistake.commonMistake}</div>}
                    {mistake.source && <div className="text-xs text-paper/40 pt-1">Source: {mistake.source}</div>}
                  </div>
                </details>

                <div className="flex justify-end mt-4">
                  <button onClick={() => toggleMistakeReviewed(mistake.id)} className={mistake.reviewed ? "btn-ghost !py-2" : "btn-mint !py-2"}>
                    {mistake.reviewed ? "↻ Move back to review" : "✓ Mark as mastered"}
                  </button>
                </div>
              </article>
            ))}
            {!visible.length && <div className="card p-8 text-center text-paper/50">No questions match these filters.</div>}
          </div>

          {mastered > 0 && (
            <div className="flex justify-end">
              <button onClick={clearReviewedMistakes} className="text-xs text-paper/40 hover:text-rose transition-colors">Clear all mastered questions</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
