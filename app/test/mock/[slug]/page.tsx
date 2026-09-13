"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import MockExam from "@/components/MockExam";
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
    const output: Question[] = [];
    mock.sections.forEach((section, sectionIndex) => {
      const seed = hashSeed("mock-v3", slug, sectionIndex);
      const source = mock.benchmark ? `${mock.exam} ${mock.year} pattern benchmark` : mock.sourceNote;
      const advanced = benchmarkQuestions(section.type, Math.ceil(section.count * .28), seed, source);
      const remaining = section.count - advanced.length;
      const generated = section.type === "VARC" ? buildVARCSet(seed, remaining)
        : section.type === "LRDI" ? buildLogicalReasoningSet(seed, remaining, source)
        : buildMixedQA(seed, remaining, section.type);
      output.push(...advanced, ...generated.map((question) => enrichQuestion({ ...question, source, difficulty: "Hard" })));
    });
    return output;
  }, [slug, mock]);

  if (!mock) return <div className="min-h-screen bg-white p-8 text-slate-900">Mock not found. <Link href="/mocks" className="text-violet">Back to mocks</Link></div>;
  return <MockExam mock={mock} questions={questions} />;
}
