"use client";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { ShieldCheck, TimerReset } from "lucide-react";
import QuizRunner from "@/components/QuizRunner";
import { mockBySlug } from "@/lib/mocks";
import { buildMixedQA } from "@/lib/qaGen";
import { buildVARCSet } from "@/lib/varc";
import { benchmarkQuestions, buildLogicalReasoningSet, enrichQuestion } from "@/lib/advancedQuestions";
import { hashSeed } from "@/lib/rng";
import type { Question } from "@/lib/types";

export default function MockTest() {
  const params = useParams();
  const slug = params.slug as string;
  const mock = mockBySlug(slug);

  const questions = useMemo<Question[]>(() => {
    if (!mock) return [];
    const out: Question[] = [];
    mock.sections.forEach((section, sectionIndex) => {
      const seed = hashSeed("mock-v2", slug, sectionIndex);
      const source = mock.benchmark
        ? `${mock.exam} ${mock.year} pattern · original benchmark`
        : `${mock.exam} pattern · original Aptivo question`;
      const advanced = benchmarkQuestions(section.type, Math.ceil(section.count * 0.28), seed, source);
      const remaining = section.count - advanced.length;
      let generated: Question[];
      if (section.type === "VARC") {
        generated = buildVARCSet(seed, remaining);
      } else if (section.type === "LRDI") {
        generated = buildLogicalReasoningSet(seed, remaining, source);
      } else {
        generated = buildMixedQA(seed, remaining, section.type);
      }
      out.push(...advanced, ...generated.map((question) => enrichQuestion({ ...question, source, difficulty: section.type === "QA-SA" || mock.difficulty !== "Moderate" ? "Hard" : question.difficulty })));
    });
    return out;
  }, [slug, mock]);

  if (!mock) return <div className="p-8">Mock not found. <Link href="/mocks" className="text-orange">Back</Link></div>;

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="mx-auto mb-4 flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-ink2/90 px-4 py-3 shadow-card backdrop-blur-xl">
        <Link href={`/mocks/${slug}`} className="text-sm font-semibold text-paper/55 transition hover:text-orange">← Exit simulation</Link>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="hidden items-center gap-1.5 rounded-full bg-mint/10 px-3 py-1.5 text-mint sm:flex"><ShieldCheck size={14} /> Original benchmark</span>
          <span className="flex items-center gap-1.5 rounded-full bg-rose/10 px-3 py-1.5 text-rose"><TimerReset size={14} /> Focus mode</span>
        </div>
      </div>
      <QuizRunner questions={questions} title={mock.title} kind={`mock:${slug}`} totalSec={mock.durationMin * 60} focusMode gamified={false} />
    </div>
  );
}
