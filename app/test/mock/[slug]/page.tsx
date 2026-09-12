"use client";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import QuizRunner from "@/components/QuizRunner";
import { mockBySlug } from "@/lib/mocks";
import { buildMixedQA } from "@/lib/qaGen";
import { buildVARCSet } from "@/lib/varc";
import { hashSeed } from "@/lib/rng";
import type { Question } from "@/lib/types";
import Link from "next/link";

export default function MockTest() {
  const params = useParams();
  const slug = params.slug as string;
  const m = mockBySlug(slug);

  const questions = useMemo<Question[]>(() => {
    if (!m) return [];
    const out: Question[] = [];
    m.sections.forEach((sec, si) => {
      const seed = hashSeed("mock", slug, si);
      if (sec.type === "VARC") out.push(...buildVARCSet(seed, sec.count));
      else out.push(...buildMixedQA(seed, sec.count, sec.type as "QA-MCQ" | "QA-SA").map((q) => ({ ...q, source: m.pyq ? `${m.exam} ${m.year} (PYQ pattern)` : undefined })));
    });
    return out;
  }, [slug]);

  if (!m) return <div className="p-8">Mock not found. <Link href="/mocks" className="text-orange">Back</Link></div>;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto mb-4 flex justify-between items-center">
        <Link href={`/mocks/${slug}`} className="text-sm text-paper/50 hover:text-orange">← Exit mock</Link>
        <span className="chip bg-rose/15 text-rose">⏱ Timed · Focus Mode</span>
      </div>
      <QuizRunner
        questions={questions}
        title={m.title}
        kind={`mock:${slug}`}
        totalSec={m.durationMin * 60}
        focusMode
        gamified={false}
      />
    </div>
  );
}
