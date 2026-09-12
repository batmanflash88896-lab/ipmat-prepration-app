"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { mockBySlug } from "@/lib/mocks";
import { Chip } from "@/components/ui";
import { BotBubble } from "@/components/AiBot";

export default function MockDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const m = mockBySlug(slug);
  if (!m) return <div className="card p-8">Mock not found. <Link href="/mocks" className="text-orange">Back</Link></div>;
  const totalQ = m.sections.reduce((s, x) => s + x.count, 0);

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/mocks" className="text-sm text-paper/50 hover:text-orange">← All mocks</Link>
      <div className="flex items-center gap-3">
        <Chip color={m.color}>{m.badge}</Chip>
        {m.pyq && <span className="chip bg-gold/15 text-gold">Previous Year Pattern {m.year}</span>}
      </div>
      <h1 className="display text-4xl font-bold">{m.title}</h1>
      <p className="text-paper/60">{m.pattern}</p>

      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center"><div className="text-2xl font-bold text-orange">{m.durationMin}</div><div className="text-xs text-paper/50">minutes</div></div>
        <div className="card p-4 text-center"><div className="text-2xl font-bold text-mint">{totalQ}</div><div className="text-xs text-paper/50">questions</div></div>
        <div className="card p-4 text-center"><div className="text-2xl font-bold text-violet">{m.sections.length}</div><div className="text-xs text-paper/50">sections</div></div>
      </div>

      <div className="card p-6">
        <h2 className="display text-2xl font-semibold mb-4">Section breakdown</h2>
        <div className="space-y-3">
          {m.sections.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-paper/50">{s.type === "QA-SA" ? "Short answer (type the value)" : s.type === "VARC" ? "Verbal ability MCQ" : "Multiple choice"}</div>
              </div>
              <span className="chip bg-white/5 text-paper/70">{s.count} Qs</span>
            </div>
          ))}
        </div>
      </div>

      <BotBubble expression="calm" text={<>The timer runs for the whole paper. Attempt confidently, flag the tough ones, and keep moving. Good luck — you've got this! 🍀</>} />

      <Link href={`/test/mock/${m.slug}`} className="btn-primary w-full justify-center text-lg">Start Mock Test 🏁</Link>
      {m.pyq && <p className="text-xs text-paper/40 text-center">Note: This is a previous-year <b>pattern</b> practice set that mirrors the {m.year} paper structure (section split, count and timing) with fresh, verified questions. Source metadata (exam, year, pattern) is retained for authenticity.</p>}
    </div>
  );
}
