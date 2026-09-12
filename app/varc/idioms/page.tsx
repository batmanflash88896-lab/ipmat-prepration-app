"use client";
import { useMemo } from "react";
import QuizRunner from "@/components/QuizRunner";
import { buildIdiomQuestion } from "@/lib/varc";
import { RNG, hashSeed } from "@/lib/rng";
import { IDIOMS } from "@/lib/vocab";
import Link from "next/link";

export default function IdiomsPage() {
  const questions = useMemo(() => {
    const n = Math.min(10, IDIOMS.length);
    return Array.from({ length: n }, (_, i) => buildIdiomQuestion(new RNG(hashSeed("idiom", i, Date.now() % 100000)), `idiom-${i}`));
  }, []);
  return (
    <div>
      <div className="max-w-3xl mx-auto mb-4"><Link href="/varc" className="text-sm text-paper/50 hover:text-orange">← VARC</Link></div>
      <QuizRunner questions={questions} title="Idioms & Phrases Practice" kind="varc:idioms" />
    </div>
  );
}
