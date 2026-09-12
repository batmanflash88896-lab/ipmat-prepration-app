"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import QuizRunner from "@/components/QuizRunner";
import { buildQATest, QA_GENERATORS } from "@/lib/qaGen";
import { buildVARCSet } from "@/lib/varc";
import { hashSeed } from "@/lib/rng";
import Link from "next/link";

export default function PracticeTest() {
  const params = useParams();
  const search = useSearchParams();
  const slug = params.slug as string;
  const testNo = Number(params.test);
  const label = search.get("label") || slug;
  const realslug = search.get("realslug") || slug;

  const questions = useMemo(() => {
    const seed = hashSeed("practice", slug, testNo);
    if (QA_GENERATORS[slug]) return buildQATest(slug, seed, 30);
    return buildVARCSet(seed, 30);
  }, [slug, testNo]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto mb-4 flex justify-between items-center">
        <Link href={`/practice/${realslug}`} className="text-sm text-paper/50 hover:text-orange">← Exit test</Link>
        <span className="chip bg-orange/15 text-orange">Focus Mode</span>
      </div>
      <QuizRunner
        questions={questions}
        title={`${label} · Practice Test ${testNo}`}
        kind={`practice:${realslug}:${testNo}`}
        focusMode
      />
    </div>
  );
}
