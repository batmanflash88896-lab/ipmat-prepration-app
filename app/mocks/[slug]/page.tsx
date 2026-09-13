"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, BookOpenCheck, Check, Clock3, FileQuestion, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { mockBySlug } from "@/lib/mocks";

export default function MockDetail() {
  const params = useParams();
  const mock = mockBySlug(params.slug as string);
  if (!mock) return <div className="card p-8">Mock not found. <Link href="/mocks" className="text-orange">Return to lab</Link></div>;
  const total = mock.sections.reduce((sum, section) => sum + section.count, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link href="/mocks" className="inline-flex items-center gap-2 text-xs font-bold text-paper/40 transition hover:text-orange">← Back to simulation lab</Link>
      <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#111f33] p-6 md:p-9">
        <div className="absolute right-0 top-0 h-full w-1/3" style={{ background: `radial-gradient(circle at 100% 0%, ${mock.color}32, transparent 68%)` }} />
        <div className="relative"><div className="flex flex-wrap gap-2"><span className="chip" style={{ color: mock.color, background: `${mock.color}16` }}>{mock.badge}</span><span className="chip bg-rose/10 text-rose">{mock.difficulty} difficulty</span>{mock.benchmark && <span className="chip bg-gold/10 text-gold">Pattern benchmark · {mock.year}</span>}</div>
        <h1 className="display mt-6 max-w-3xl text-4xl font-semibold md:text-6xl">{mock.title}</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-paper/50">{mock.pattern}</p>
        <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3"><div className="metric"><Clock3 size={17} className="mb-4 text-orange" /><div className="text-xl font-bold">{mock.durationMin}</div><div className="text-[10px] text-paper/35">minutes</div></div><div className="metric"><FileQuestion size={17} className="mb-4 text-mint" /><div className="text-xl font-bold">{total}</div><div className="text-[10px] text-paper/35">questions</div></div><div className="metric"><Sparkles size={17} className="mb-4 text-violet" /><div className="text-xl font-bold">{mock.sections.length}</div><div className="text-[10px] text-paper/35">sections</div></div></div></div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <section className="card p-5 md:p-6"><div className="mb-5 flex items-center gap-2"><BookOpenCheck size={18} className="text-orange" /><h2 className="font-bold">Paper architecture</h2></div><div className="space-y-2">{mock.sections.map((section, index) => (
          <div key={section.name} className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-xs font-bold text-paper/40">0{index + 1}</div><div className="min-w-0 flex-1"><div className="text-sm font-bold">{section.name}</div><div className="mt-1 text-[10px] text-paper/35">{section.type === "QA-SA" ? "Numeric response · no negative marking" : section.type === "LRDI" ? "Single-correct reasoning MCQ" : "Single-correct MCQ"}</div></div><div className="text-right"><div className="text-sm font-bold">{section.count} Q</div><div className="text-[10px] text-paper/35">{section.durationMin ? `${section.durationMin} min` : "flexible"}</div></div></div>
        ))}</div></section>
        <aside className="paper-panel p-5"><div className="flex items-center gap-2 text-sm font-bold"><ShieldCheck size={18} /> Before you begin</div><ul className="mt-5 space-y-4 text-xs leading-5 text-ink/65">{["Sit the paper in one uninterrupted attempt.", "Keep rough paper ready; no calculator.", "Skip strategically when negative marking applies.", "Review the concept and alternate method after submitting."].map((text) => <li key={text} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-orange" />{text}</li>)}</ul><div className="mt-6 border-t border-ink/10 pt-4 text-[11px] font-bold text-ink/60">{mock.marking}</div></aside>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-xs leading-5 text-paper/45"><b className="text-paper/70">Provenance:</b> {mock.sourceNote}</div>
      <Link href={`/test/mock/${mock.slug}`} className="btn-primary w-full text-base"><LockKeyhole size={17} /> Start secure simulation <ArrowRight size={17} /></Link>
    </div>
  );
}
