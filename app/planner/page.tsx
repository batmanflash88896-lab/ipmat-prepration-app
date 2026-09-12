"use client";
import { useApp, type StudyTask } from "@/lib/store";
import { SectionTitle, Chip } from "@/components/ui";
import { BotBubble } from "@/components/AiBot";
import { QA_TOPICS, VARC_TOPICS } from "@/lib/content";
import Link from "next/link";

function daysTo(dateStr: string) {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000));
}

export default function Planner() {
  const { profile, plan, setPlan, toggleTask, attempts, ready } = useApp();
  if (!ready) return null;

  function generate() {
    // weak topics first from attempts
    const byTopic: Record<string, { c: number; t: number }> = {};
    attempts.forEach((a) => { const k = a.topic || "Mixed"; byTopic[k] = byTopic[k] || { c: 0, t: 0 }; byTopic[k].c += a.correct; byTopic[k].t += a.total; });
    const weakTopics = Object.entries(byTopic).map(([topic, v]) => ({ topic, acc: v.c / v.t })).sort((a, b) => a.acc - b.acc).map((x) => x.topic);
    const qaPool = [...weakTopics.filter(t => QA_TOPICS.some(q => q.name === t)), ...QA_TOPICS.map(t => t.name)];
    const uniqQA = [...new Set(qaPool)];
    const varcPool = VARC_TOPICS.map(t => t.name);

    const days = Math.min(7, Math.max(5, profile.dailyHours >= 3 ? 7 : 6));
    const tasks: StudyTask[] = [];
    let id = 0;
    for (let d = 0; d < days; d++) {
      const qa = uniqQA[d % uniqQA.length];
      tasks.push({ id: `t${id++}`, title: `QA: ${qa} — concept + Practice Test`, type: "QA", done: false, day: d });
      const varc = varcPool[d % varcPool.length];
      tasks.push({ id: `t${id++}`, title: `VARC: ${varc} + Word of the Day`, type: "VARC", done: false, day: d });
      if (profile.dailyHours >= 2) tasks.push({ id: `t${id++}`, title: `Revise: yesterday's mistakes`, type: "Revision", done: false, day: d });
      if (d === 3 || d === 6) tasks.push({ id: `t${id++}`, title: `Full Mock (${profile.targetExam}) + analysis`, type: "Mock", done: false, day: d });
    }
    setPlan(tasks);
  }

  const dLeft = daysTo(profile.examDate);
  const dayNames = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
  const grouped = plan.reduce<Record<number, StudyTask[]>>((acc, t) => { (acc[t.day] = acc[t.day] || []).push(t); return acc; }, {});
  const doneCount = plan.filter((t) => t.done).length;
  const typeColor: Record<string, string> = { QA: "#FF6B35", VARC: "#7267F0", Mock: "#FF5D8F", Revision: "#FFC15E" };

  const links: Record<string, string> = { QA: "/practice", VARC: "/varc", Mock: "/mocks", Revision: "/analytics" };

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Study Planner" title="Your adaptive weekly plan" sub="Built from your target exam, daily hours and — as you practise — your weakest topics. Regenerate anytime to re-prioritise." />

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="card p-4"><div className="text-xs text-paper/50">Target exam</div><div className="font-semibold">{profile.targetExam}</div></div>
        <div className="card p-4"><div className="text-xs text-paper/50">Days remaining</div><div className="font-semibold text-orange">{dLeft} days</div></div>
        <div className="card p-4"><div className="text-xs text-paper/50">Daily commitment</div><div className="font-semibold text-mint">{profile.dailyHours} hours</div></div>
      </div>

      <BotBubble expression="think" text={
        plan.length ? <>You've completed <b className="text-mint">{doneCount}/{plan.length}</b> tasks. Consistency beats intensity — tick off today's tasks and keep your streak alive! 🗓</>
        : <>Let me build your personalised week. As you take tests, I'll push your weak topics higher automatically. Ready?</>
      } />

      <div className="flex gap-3">
        <button onClick={generate} className="btn-primary">{plan.length ? "↻ Regenerate plan" : "✨ Generate my plan"}</button>
        <Link href="/onboarding" className="btn-ghost">Edit goals</Link>
      </div>

      {plan.length > 0 && (
        <div className="space-y-4">
          {Object.entries(grouped).map(([day, tasks]) => (
            <div key={day} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="display text-xl font-semibold">{dayNames[+day]}</h3>
                <Chip color="#78F2C0">{tasks.filter(t => t.done).length}/{tasks.length}</Chip>
              </div>
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5">
                    <button onClick={() => toggleTask(t.id)} className={`shrink-0 w-6 h-6 rounded-lg border-2 grid place-items-center transition-all ${t.done ? "bg-mint border-mint text-ink" : "border-white/20"}`}>{t.done && "✓"}</button>
                    <span className="chip shrink-0" style={{ background: `${typeColor[t.type]}22`, color: typeColor[t.type] }}>{t.type}</span>
                    <span className={`text-sm flex-1 ${t.done ? "line-through text-paper/40" : ""}`}>{t.title}</span>
                    <Link href={links[t.type]} className="text-xs text-orange hover:underline shrink-0">Go →</Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
