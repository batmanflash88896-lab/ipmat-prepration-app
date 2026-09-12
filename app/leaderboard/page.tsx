"use client";
import { useState, useMemo } from "react";
import { useApp, levelFromXp } from "@/lib/store";
import { SectionTitle, Chip } from "@/components/ui";
import { BotBubble } from "@/components/AiBot";

// Simulated cohort — the user is inserted live by XP/accuracy/streak
const BOTS = [
  { name: "Aarav S.", xp: 2480, acc: 82, streak: 41 },
  { name: "Diya P.", xp: 2210, acc: 79, streak: 33 },
  { name: "Kabir M.", xp: 1990, acc: 85, streak: 22 },
  { name: "Ananya R.", xp: 1760, acc: 74, streak: 28 },
  { name: "Vihaan K.", xp: 1540, acc: 71, streak: 19 },
  { name: "Ishita J.", xp: 1320, acc: 88, streak: 15 },
  { name: "Reyansh T.", xp: 1180, acc: 68, streak: 12 },
  { name: "Sara N.", xp: 990, acc: 76, streak: 9 },
  { name: "Arjun D.", xp: 820, acc: 64, streak: 7 },
  { name: "Myra B.", xp: 640, acc: 81, streak: 5 },
  { name: "Aditya V.", xp: 480, acc: 59, streak: 4 },
  { name: "Kiara L.", xp: 300, acc: 72, streak: 3 },
];

type Board = "xp" | "acc" | "streak";

export default function Leaderboard() {
  const { profile, xp, streak, attempts, ready } = useApp();
  const [board, setBoard] = useState<Board>("xp");
  const [anon, setAnon] = useState(false);

  const acc = useMemo(() => {
    const t = attempts.reduce((s, a) => s + a.total, 0);
    const c = attempts.reduce((s, a) => s + a.correct, 0);
    return t ? Math.round((c / t) * 100) : 0;
  }, [attempts]);

  if (!ready) return null;

  const me = { name: anon ? "You (anonymous)" : profile.name || "You", xp, acc, streak, isMe: true };
  const all = [...BOTS.map((b) => ({ ...b, isMe: false })), me];
  const key = board;
  const sorted = [...all].sort((a, b) => (b as any)[key] - (a as any)[key]);
  const myRank = sorted.findIndex((x) => (x as any).isMe) + 1;

  const boards: { id: Board; label: string; suffix: string; color: string }[] = [
    { id: "xp", label: "Weekly XP", suffix: " XP", color: "#78F2C0" },
    { id: "acc", label: "Accuracy", suffix: "%", color: "#7267F0" },
    { id: "streak", label: "Streak", suffix: "🔥", color: "#FF6B35" },
  ];
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Leaderboard" title="Compete & climb" sub="Ranked by XP, accuracy and streak. Keep practising to rise — your class cohort is watching!" />

      <BotBubble expression={myRank <= 5 ? "cheer" : "happy"} text={<>You're rank <b className="text-orange">#{myRank}</b> on the <b>{boards.find(b => b.id === board)?.label}</b> board. {myRank > 3 ? "A couple of solid tests could push you into the medals! 🏅" : "You're in the medals — defend your spot! 🏆"}</>} />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {boards.map((b) => (
            <button key={b.id} onClick={() => setBoard(b.id)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${board === b.id ? "bg-orange text-ink shadow-glow" : "bg-white/5 text-paper/60"}`}>{b.label}</button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-paper/60 cursor-pointer">
          <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} className="accent-orange" /> Anonymous mode
        </label>
      </div>

      <div className="card overflow-hidden">
        {sorted.map((row, i) => {
          const b = boards.find((x) => x.id === board)!;
          const val = (row as any)[key];
          return (
            <div key={i} className={`flex items-center gap-4 px-4 md:px-6 py-3.5 border-b border-white/5 last:border-0 ${(row as any).isMe ? "bg-orange/10" : i % 2 ? "bg-white/[0.02]" : ""}`}>
              <div className="w-8 text-center font-bold text-lg">{i < 3 ? medals[i] : <span className="text-paper/50">{i + 1}</span>}</div>
              <div className={`w-10 h-10 rounded-full grid place-items-center font-bold ${(row as any).isMe ? "bg-orange text-ink" : "bg-white/10"}`}>{(row as any).name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate flex items-center gap-2">{(row as any).name} {(row as any).isMe && <Chip color="#FF6B35">You</Chip>}</div>
                <div className="text-xs text-paper/40">Level {levelFromXp((row as any).xp).level}</div>
              </div>
              <div className="font-bold text-lg" style={{ color: b.color }}>{val}{b.suffix}</div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-paper/40 text-center">Cohort shown is a simulated practice class so you always have someone to chase. Real class/friends leaderboards activate when accounts & groups are connected.</p>
    </div>
  );
}
