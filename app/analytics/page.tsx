"use client";
import { useApp } from "@/lib/store";
import { SectionTitle, Ring, AnimatedNumber } from "@/components/ui";
import { BotBubble } from "@/components/AiBot";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, CartesianGrid } from "recharts";
import Link from "next/link";

export default function Analytics() {
  const { attempts, ready } = useApp();
  if (!ready) return null;

  if (!attempts.length) {
    return (
      <div className="space-y-6">
        <SectionTitle kicker="Analytics" title="Performance Analytics" />
        <div className="card p-10 text-center">
          <BotBubble expression="calm" text={<>No attempts yet! Take a <b>practice test</b> or a <b>daily challenge</b> and I'll start tracking your accuracy, speed and weak topics here. 📊</>} />
          <div className="flex gap-3 justify-center mt-6"><Link href="/practice" className="btn-primary">Start practising</Link><Link href="/daily/qa" className="btn-ghost">Daily QA</Link></div>
        </div>
      </div>
    );
  }

  const totalQ = attempts.reduce((s, a) => s + a.total, 0);
  const totalCorrect = attempts.reduce((s, a) => s + a.correct, 0);
  const accuracy = Math.round((totalCorrect / totalQ) * 100);
  const timed = attempts.filter((a) => a.timeSec > 0);
  const avgSpeed = timed.length ? Math.round(timed.reduce((s, a) => s + a.timeSec / a.total, 0) / timed.length) : 0;

  // topic-wise
  const byTopic: Record<string, { c: number; t: number }> = {};
  attempts.forEach((a) => {
    const k = a.topic || "Mixed";
    byTopic[k] = byTopic[k] || { c: 0, t: 0 };
    byTopic[k].c += a.correct; byTopic[k].t += a.total;
  });
  const topicRows = Object.entries(byTopic).map(([topic, v]) => ({ topic, acc: Math.round((v.c / v.t) * 100), attempts: v.t })).sort((a, b) => a.acc - b.acc);
  const weak = topicRows.slice(0, 3);
  const strong = [...topicRows].reverse().slice(0, 3);

  // section split
  const bySection: Record<string, { c: number; t: number }> = {};
  attempts.forEach((a) => {
    const k = a.section || "Other";
    bySection[k] = bySection[k] || { c: 0, t: 0 };
    bySection[k].c += a.correct; bySection[k].t += a.total;
  });
  const sectionData = Object.entries(bySection).map(([section, v]) => ({ section: section.replace("QA-", "QA "), accuracy: Math.round((v.c / v.t) * 100) }));

  // progress over time (last 12 attempts, reversed)
  const trend = [...attempts].slice(0, 12).reverse().map((a, i) => ({ n: i + 1, acc: Math.round((a.correct / a.total) * 100) }));

  const radar = topicRows.slice(0, 6).map((r) => ({ topic: r.topic.split(" ")[0], acc: r.acc }));

  // expected score band (rough): scale accuracy to a 0-100 exam index
  const low = Math.max(0, accuracy - 8), high = Math.min(100, accuracy + 8);

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Analytics" title="Performance Analytics" sub="Accuracy, speed, topic strengths & weaknesses, section split and progress over time." />

      <BotBubble expression={accuracy >= 70 ? "cheer" : "happy"} text={
        weak.length ? <>Your accuracy is <b className="text-mint">{accuracy}%</b>. Biggest opportunity: <b className="text-gold">{weak[0].topic}</b> ({weak[0].acc}%). Do 2 focused tests there this week and watch it climb! 📈</> : <>Great start — keep the streak going!</>
      } />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card p-5 flex items-center gap-4">
          <Ring value={accuracy} size={70} color="#78F2C0" label={<div className="text-lg font-bold">{accuracy}%</div>} />
          <div><div className="text-xs text-paper/50">Overall accuracy</div><div className="text-sm text-paper/70">{totalCorrect}/{totalQ} correct</div></div>
        </div>
        <div className="card p-5"><div className="text-xs text-paper/50">Avg time / question</div><div className="text-3xl font-bold text-orange"><AnimatedNumber value={avgSpeed} suffix="s" /></div><div className="text-sm text-paper/50">across {timed.length} timed tests</div></div>
        <div className="card p-5"><div className="text-xs text-paper/50">Tests completed</div><div className="text-3xl font-bold text-violet"><AnimatedNumber value={attempts.length} /></div><div className="text-sm text-paper/50">{totalQ} questions attempted</div></div>
        <div className="card p-5"><div className="text-xs text-paper/50">Expected score band</div><div className="text-3xl font-bold text-mint">{low}–{high}</div><div className="text-sm text-paper/50">percentile index (est.)</div></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Trend */}
        <div className="card p-5">
          <h3 className="display text-xl font-semibold mb-3">Progress over time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="n" stroke="#ffffff40" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#ffffff40" fontSize={12} />
              <Tooltip contentStyle={{ background: "#0E1B2E", border: "1px solid #ffffff20", borderRadius: 12 }} />
              <Line type="monotone" dataKey="acc" stroke="#FF6B35" strokeWidth={3} dot={{ fill: "#78F2C0" }} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="card p-5">
          <h3 className="display text-xl font-semibold mb-3">Topic mastery map</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radar}>
              <PolarGrid stroke="#ffffff15" />
              <PolarAngleAxis dataKey="topic" stroke="#ffffff70" fontSize={11} />
              <PolarRadiusAxis domain={[0, 100]} stroke="#ffffff20" fontSize={10} />
              <Radar dataKey="acc" stroke="#7267F0" fill="#7267F0" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section split */}
      <div className="card p-5">
        <h3 className="display text-xl font-semibold mb-3">Section-wise accuracy</h3>
        <p className="text-xs text-paper/50 mb-3">IPMAT Indore scores QA-MCQ, QA-SA and VARC separately — so we keep them separate too.</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sectionData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="section" stroke="#ffffff40" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="#ffffff40" fontSize={12} />
            <Tooltip contentStyle={{ background: "#0E1B2E", border: "1px solid #ffffff20", borderRadius: 12 }} />
            <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} fill="#78F2C0" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Strengths & weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="display text-xl font-semibold mb-3 text-mint">💪 Strengths</h3>
          {strong.map((t) => (
            <div key={t.topic} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-sm">{t.topic}</span>
              <div className="flex items-center gap-2"><div className="w-24 h-2 rounded-full bg-ink3 overflow-hidden"><div className="h-full bg-mint" style={{ width: `${t.acc}%` }} /></div><span className="text-sm font-bold text-mint w-10 text-right">{t.acc}%</span></div>
            </div>
          ))}
        </div>
        <div className="card p-5">
          <h3 className="display text-xl font-semibold mb-3 text-gold">🎯 Focus areas</h3>
          {weak.map((t) => (
            <div key={t.topic} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <Link href="/practice" className="text-sm hover:text-orange">{t.topic}</Link>
              <div className="flex items-center gap-2"><div className="w-24 h-2 rounded-full bg-ink3 overflow-hidden"><div className="h-full bg-gold" style={{ width: `${t.acc}%` }} /></div><span className="text-sm font-bold text-gold w-10 text-right">{t.acc}%</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
