"use client";
import QuizRunner from "@/components/QuizRunner";
import { buildMixedQA } from "@/lib/qaGen";
import { useApp } from "@/lib/store";
import { useMemo } from "react";

export default function DailyQA() {
  const { markDaily } = useApp();
  const seed = useMemo(() => Number(new Date().toISOString().slice(0, 10).replace(/-/g, "")), []);
  const questions = useMemo(() => buildMixedQA(seed, 5), [seed]);
  return (
    <QuizRunner
      questions={questions}
      title="Daily QA Challenge"
      kind="daily-qa"
      onFinish={() => markDaily("daily-qa")}
    />
  );
}
