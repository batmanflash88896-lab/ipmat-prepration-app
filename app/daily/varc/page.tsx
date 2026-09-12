"use client";
import QuizRunner from "@/components/QuizRunner";
import { buildVARCSet } from "@/lib/varc";
import { useApp } from "@/lib/store";
import { useMemo } from "react";

export default function DailyVARC() {
  const { markDaily } = useApp();
  const seed = useMemo(() => Number(new Date().toISOString().slice(0, 10).replace(/-/g, "")) + 7, []);
  const questions = useMemo(() => buildVARCSet(seed, 6), [seed]);
  return (
    <QuizRunner
      questions={questions}
      title="Daily VARC Challenge"
      kind="daily-varc"
      onFinish={() => markDaily("daily-varc")}
    />
  );
}
