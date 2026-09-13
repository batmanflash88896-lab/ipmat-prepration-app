"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, Flag, Lightbulb,
  Minus, RotateCcw, Target, X,
} from "lucide-react";
import type { Question } from "@/lib/types";
import type { MockDef } from "@/lib/mocks";
import { useApp } from "@/lib/store";

type Props = { mock: MockDef; questions: Question[] };
type SectionKey = Question["section"];
type Status = "unseen" | "seen" | "answered" | "review";

const SECTION_LABEL: Record<SectionKey, string> = {
  "QA-SA": "QA (SA)", "QA-MCQ": "QA (MCQ)", VARC: "VARC", LRDI: "DILR",
};

const sectionOf = (q: Question) => q.section;
const isCorrect = (q: Question, answer?: string) => q.section === "QA-SA"
  ? Math.abs(parseFloat(answer ?? "") - (q.answerValue ?? Number.NaN)) < 1e-6
  : answer === q.answer;

export default function MockExam({ mock, questions }: Props) {
  const app = useApp();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });
  const [review, setReview] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(mock.durationMin * 60);
  const [submitted, setSubmitted] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const startedAt = useRef(Date.now());
  const saved = useRef(false);

  const q = questions[index];
  const sections = useMemo(() => Array.from(new Set(questions.map(sectionOf))), [questions]);
  const currentSection = q.section;
  const sectionIndexes = questions.map((question, i) => question.section === currentSection ? i : -1).filter((i) => i >= 0);
  const sectionPosition = sectionIndexes.indexOf(index) + 1;

  useEffect(() => {
    if (submitted) return;
    const timer = window.setInterval(() => setTimeLeft((value) => {
      if (value <= 1) { window.clearInterval(timer); setSubmitted(true); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [submitted]);

  useEffect(() => {
    if (!submitted || saved.current) return;
    saved.current = true;
    const correct = questions.filter((question, i) => isCorrect(question, answers[i])).length;
    const attempted = Object.keys(answers).filter((key) => answers[Number(key)] !== "").length;
    const wrong = attempted - correct;
    const saWrong = questions.filter((question, i) => question.section === "QA-SA" && answers[i] && !isCorrect(question, answers[i])).length;
    const mcqWrong = wrong - saWrong;
    const marks = correct * 4 - mcqWrong;
    const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
    app.addAttempt({ kind: `mock:${mock.slug}`, label: mock.title, correct, total: questions.length, timeSec: elapsed, xp: Math.max(0, correct * 5) });
    app.recordMistakes(questions.flatMap((question, i) => {
      if (isCorrect(question, answers[i])) return [];
      return [{ questionId: question.id, stem: question.stem, topic: question.topic, subtopic: question.subtopic, section: question.section, difficulty: question.difficulty, chosenAnswer: answers[i] || "Skipped", correctAnswer: question.answer, solution: question.solution, commonMistake: question.commonMistake, source: question.source }];
    }));
    sessionStorage.setItem(`aptivo-mock-${mock.slug}`, JSON.stringify({ marks, correct, wrong, attempted, total: questions.length, elapsed, date: new Date().toISOString() }));
  }, [submitted, answers, questions, app, mock]);

  const go = (next: number) => {
    if (next < 0 || next >= questions.length) return;
    setIndex(next); setVisited((state) => ({ ...state, [next]: true })); setShowSolution(false);
  };
  const goSection = (section: SectionKey) => {
    const target = questions.findIndex((question) => question.section === section);
    if (target >= 0) go(target);
  };
  const statusFor = (i: number): Status => review[i] ? "review" : answers[i] ? "answered" : visited[i] ? "seen" : "unseen";
  const submit = () => { if (window.confirm("Submit this paper? You will not be able to change your responses.")) setSubmitted(true); };
  const fmt = (seconds: number) => `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds % 3600 / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  if (submitted && !reviewing) return <MockAnalysis mock={mock} questions={questions} answers={answers} elapsed={Math.floor((Date.now() - startedAt.current) / 1000)} onReview={() => { setReviewing(true); setIndex(0); }} />;

  return (
    <div className="min-h-screen bg-[#f4f5f9] font-sans text-[#182033]">
      <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-3 bg-[#16132f] px-3 py-2 text-white shadow-sm md:px-5">
        <Link href={`/mocks/${mock.slug}`} className="flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 text-sm font-semibold hover:bg-white/10"><ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span></Link>
        <div className="flex items-center gap-1.5">{sections.map((section) => <button key={section} onClick={() => goSection(section)} className={`min-h-9 rounded-xl border px-3 text-xs font-bold transition md:px-5 ${section === currentSection ? "border-white/35 bg-white/15 text-white shadow-inner" : "border-white/10 bg-white/[0.04] text-white/55 hover:text-white"}`}>{SECTION_LABEL[section]}</button>)}</div>
        <button onClick={submit} className="flex min-h-10 items-center gap-2 rounded-xl border border-[#f06f76]/25 bg-[#f06f76]/10 px-3 text-xs font-bold text-[#ff9aa0] hover:bg-[#f06f76]/20"><X size={15} /> <span className="hidden sm:inline">Submit test</span></button>
      </header>

      <div className="grid min-h-[calc(100vh-64px)] xl:grid-cols-[1fr_300px]">
        <main className="min-w-0 p-3 pb-24 md:p-6 md:pb-24">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-xl bg-[#eeeaff] px-4 py-2 text-sm font-bold text-[#5d4ac7]">Question {sectionPosition} <span className="font-medium text-[#9289c5]">of {sectionIndexes.length}</span></span>
            <div className="flex gap-2 text-xs font-bold"><span className="rounded-lg bg-[#eaf9ef] px-3 py-1.5 text-[#25a759]">+4</span>{q.section !== "QA-SA" && <span className="rounded-lg bg-[#fff0f0] px-3 py-1.5 text-[#d95960]">−1</span>}</div>
          </div>

          <section className="rounded-2xl border border-[#e3e6ed] bg-white p-5 text-base leading-7 shadow-[0_2px_10px_rgba(23,31,56,.04)] md:p-7 md:text-lg">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#8a91a2]">{q.topic} · {q.subtopic}</div>
            {q.stem}
          </section>

          <div className="mt-4 space-y-3">
            {q.section === "QA-SA" ? <input type="number" value={answers[index] ?? ""} disabled={reviewing} onChange={(event) => setAnswers((state) => ({ ...state, [index]: event.target.value }))} placeholder="Enter your numerical answer" className="min-h-16 w-full rounded-2xl border border-[#dfe3eb] bg-white px-5 text-lg font-semibold outline-none transition focus:border-[#6657d9] focus:ring-4 focus:ring-[#6657d9]/10" /> : q.choices?.map((choice) => {
              const selected = answers[index] === choice.key;
              const correctReview = reviewing && choice.key === q.answer;
              const wrongReview = reviewing && selected && choice.key !== q.answer;
              return <button key={choice.key} disabled={reviewing} onClick={() => setAnswers((state) => ({ ...state, [index]: choice.key }))} className={`flex min-h-[66px] w-full items-stretch overflow-hidden rounded-2xl border bg-white text-left text-sm transition md:text-base ${correctReview ? "border-[#4fc46b] bg-[#f0fff3]" : wrongReview ? "border-[#e9656b] bg-[#fff4f4]" : selected ? "border-[#6657d9] ring-2 ring-[#6657d9]/10" : "border-[#e0e4eb] hover:border-[#b8b1ef]"}`}><span className={`grid w-14 shrink-0 place-items-center border-r font-bold ${correctReview ? "border-[#4fc46b] bg-[#4fc46b] text-white" : wrongReview ? "border-[#e9656b] bg-[#e9656b] text-white" : selected ? "border-[#6657d9] bg-[#6657d9] text-white" : "border-[#e6e8ee] bg-[#fafbfc] text-[#51596b]"}`}>{choice.key}</span><span className="flex flex-1 items-center px-4 py-3">{choice.text}</span>{correctReview && <span className="grid w-12 place-items-center text-[#2aa34d]"><Check size={19} /></span>}</button>;
            })}
          </div>

          {reviewing && <div className={`mt-4 rounded-2xl border p-4 text-sm font-semibold ${isCorrect(q, answers[index]) ? "border-[#66cb7c] bg-[#effcf2] text-[#248b40]" : "border-[#ec8c91] bg-[#fff3f3] text-[#bc444b]"}`}>Your answer: {answers[index] || "Skipped"} · Correct answer: {q.answer}</div>}
          {reviewing && <button onClick={() => setShowSolution((value) => !value)} className="mt-5 flex min-h-11 items-center gap-2 rounded-xl border border-[#27233f] bg-white px-4 text-sm font-bold"><Lightbulb size={16} /> {showSolution ? "Hide solution" : "View solution"}</button>}
          {showSolution && <div className="mt-3 rounded-2xl border border-[#dde1e9] bg-white p-5"><h3 className="font-bold">Step-by-step solution</h3><div className="mt-4 space-y-3 text-sm leading-6 text-[#596174]">{q.solution.map((step, i) => <div key={step} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#eeeaff] text-xs font-bold text-[#6657d9]">{i + 1}</span>{step}</div>)}</div>{q.whyMethod && <div className="mt-5 rounded-xl bg-[#f6f7fa] p-4 text-sm leading-6"><b>Why this method:</b> {q.whyMethod}</div>}</div>}
        </main>

        <aside className="border-l border-[#e2e5eb] bg-white p-5 xl:sticky xl:top-16 xl:h-[calc(100vh-64px)] xl:overflow-y-auto">
          <div className="flex items-center gap-3 border-b border-[#eceef2] pb-5"><div className="grid h-14 w-14 place-items-center rounded-full bg-[#6557dd] text-lg font-bold text-white">{(app.profile.name || "AS").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div><div className="font-bold">{app.profile.name || "Aptivo Student"}</div><div className="mt-1 text-xs text-[#9299a8]">{reviewing ? "Answer review" : "Live examination"}</div></div></div>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-[#f5f3ff] px-4 py-3"><span className="flex items-center gap-2 text-xs font-bold text-[#6557dd]"><Clock3 size={16} /> Time remaining</span><span className="font-mono text-sm font-bold text-[#282342]">{fmt(timeLeft)}</span></div>
          <div className="mt-6 text-[11px] font-bold uppercase tracking-wider text-[#8d94a3]">Question palette · {SECTION_LABEL[currentSection]}</div>
          <div className="mt-4 grid grid-cols-5 gap-2">{sectionIndexes.map((questionIndex, i) => { const status = statusFor(questionIndex); return <button key={questionIndex} onClick={() => go(questionIndex)} className={`relative grid aspect-square place-items-center rounded-full text-xs font-bold transition ${questionIndex === index ? "ring-2 ring-[#201b42] ring-offset-2" : ""} ${status === "answered" ? "bg-[#54c66b] text-white" : status === "review" ? "bg-[#f1b84b] text-white" : status === "seen" ? "bg-[#e96d73] text-white" : "bg-[#a5adba] text-white"}`}>{i + 1}{status === "review" && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#6757dc]" />}</button>; })}</div>
          <div className="mt-6 grid grid-cols-2 gap-y-3 text-[11px] text-[#656d7d]"><Legend color="#54c66b" label="Answered" /><Legend color="#e96d73" label="Not answered" /><Legend color="#a5adba" label="Not visited" /><Legend color="#f1b84b" label="Marked review" /></div>
        </aside>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-30 flex min-h-16 items-center justify-between border-t border-[#e1e4ea] bg-white px-3 py-2 shadow-[0_-6px_20px_rgba(25,31,50,.06)] md:px-5 xl:right-[300px]">
        <div className="flex gap-2"><button onClick={() => go(index - 1)} disabled={index === 0} className="flex min-h-10 items-center gap-2 rounded-xl border border-[#dfe3e9] px-3 text-xs font-bold text-[#717888] disabled:opacity-30"><ArrowLeft size={15} /> Prev</button>{!reviewing && <button onClick={() => setAnswers((state) => ({ ...state, [index]: "" }))} className="min-h-10 rounded-xl border border-[#f0c9cb] px-3 text-xs font-bold text-[#cd555c]">Clear</button>}</div>
        {!reviewing && <button onClick={() => { setReview((state) => ({ ...state, [index]: true })); go(index + 1); }} className="hidden min-h-10 items-center gap-2 rounded-xl border border-[#e0b64c] px-4 text-xs font-bold text-[#9c7412] sm:flex"><Flag size={14} /> Mark for review & next</button>}
        <button onClick={() => index === questions.length - 1 ? (reviewing ? setReviewing(false) : submit()) : go(index + 1)} className="flex min-h-10 items-center gap-2 rounded-xl bg-[#17132f] px-5 text-xs font-bold text-white">{index === questions.length - 1 ? (reviewing ? "Back to analysis" : "Submit") : "Save & next"} <ChevronRight size={15} /></button>
      </footer>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: color }} />{label}</span>;
}

function MockAnalysis({ mock, questions, answers, elapsed, onReview }: { mock: MockDef; questions: Question[]; answers: Record<number, string>; elapsed: number; onReview: () => void }) {
  const [tab, setTab] = useState<"overview" | "sections">("overview");
  const sections = Array.from(new Set(questions.map(sectionOf)));
  const rows = sections.map((section) => {
    const indexes = questions.map((q, i) => q.section === section ? i : -1).filter((i) => i >= 0);
    const correct = indexes.filter((i) => isCorrect(questions[i], answers[i])).length;
    const attempted = indexes.filter((i) => answers[i]).length;
    const wrong = attempted - correct;
    const negative = section === "QA-SA" ? 0 : wrong;
    return { section, total: indexes.length, correct, wrong, missed: indexes.length - attempted, marks: correct * 4 - negative, max: indexes.length * 4, accuracy: attempted ? Math.round(correct / attempted * 100) : 0 };
  });
  const totalCorrect = rows.reduce((sum, row) => sum + row.correct, 0);
  const totalWrong = rows.reduce((sum, row) => sum + row.wrong, 0);
  const totalMissed = rows.reduce((sum, row) => sum + row.missed, 0);
  const negative = rows.reduce((sum, row) => sum + (row.section === "QA-SA" ? 0 : row.wrong), 0);
  const marks = rows.reduce((sum, row) => sum + row.marks, 0);
  const max = questions.length * 4;
  const accuracy = totalCorrect + totalWrong ? Math.round(totalCorrect / (totalCorrect + totalWrong) * 100) : 0;
  const fmtDuration = `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;

  return <div className="min-h-screen bg-[#f5f6f8] p-4 text-[#161a23] md:p-7">
    <div className="mx-auto max-w-[1480px] space-y-5">
      <header className="rounded-2xl border border-[#e8e9ed] bg-white p-5 shadow-sm md:p-7"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><div className="text-xl font-bold">{mock.title}</div><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#8c929d]"><span className="flex items-center gap-2"><Clock3 size={16} /> {fmtDuration}</span><span className="flex items-center gap-2"><Check size={16} /> {totalCorrect}</span><span className="flex items-center gap-2"><X size={16} /> {totalWrong}</span><span className="flex items-center gap-2"><Minus size={16} /> {totalMissed}</span><span className="flex items-center gap-2"><Target size={16} /> {marks} marks</span></div></div><button onClick={onReview} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#7b70eb] px-5 text-sm font-bold text-white">View questions <ArrowRight size={16} /></button></div></header>

      <div className="flex gap-1 rounded-xl bg-white p-1.5 shadow-sm md:w-fit"><button onClick={() => setTab("overview")} className={`rounded-lg px-4 py-2 text-xs font-bold ${tab === "overview" ? "bg-[#191633] text-white" : "text-[#777e8d]"}`}>Overview</button><button onClick={() => setTab("sections")} className={`rounded-lg px-4 py-2 text-xs font-bold ${tab === "sections" ? "bg-[#191633] text-white" : "text-[#777e8d]"}`}>Section analysis</button></div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.45fr_.75fr]">
        <Panel title="Your performance"><div className="grid grid-cols-2 gap-3"><Metric label="Score" value={`${marks}/${max}`} color="#7065df" /><Metric label="Accuracy" value={`${accuracy}%`} color="#28a860" /><Metric label="Attempted" value={`${totalCorrect + totalWrong}/${questions.length}`} color="#2995c8" /><Metric label="Time used" value={fmtDuration} color="#df9640" /></div></Panel>
        <Panel title="Mock spotlight"><div className="grid gap-3 sm:grid-cols-3"><Spotlight color="#fff0f0" icon={<Clock3 />} label="Question trap" value={`${Math.max(0, Math.round(elapsed / 60 - mock.durationMin * .8))} min`} /><Spotlight color="#fff7dd" icon={<Target />} label="Question picking" value={`${totalCorrect} of ${totalCorrect + totalWrong}`} /><Spotlight color="#e5faf3" icon={<Minus />} label="Total negative" value={`−${negative} marks`} /></div></Panel>
        <Panel title="Coach note"><p className="text-base leading-7 text-[#4d5360]">Your score could have been <b className="text-xl text-[#171b24]">{marks + negative}</b> without negative marks. {negative > 5 ? "Reduce low-confidence guesses before increasing attempts." : "Your selection discipline is a green flag."}</p></Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Section wise"><div className="space-y-5">{rows.map((row) => <div key={row.section}><div className="mb-2 flex justify-between text-sm"><b>{SECTION_LABEL[row.section]}</b><span className="text-[#707786]">{row.marks}/{row.max} · {row.accuracy}% accuracy</span></div><div className="flex h-5 overflow-hidden rounded-md bg-[#eceef1]"><div className="bg-[#7b70eb]" style={{ width: `${row.correct / row.total * 100}%` }} /><div className="bg-[#eb666c]" style={{ width: `${row.wrong / row.total * 100}%` }} /></div></div>)}</div></Panel>
        <Panel title="Attempts"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-[#9399a5]"><tr><th className="pb-4">Section</th><th className="pb-4 text-[#289b55]">Correct</th><th className="pb-4 text-[#d94f56]">Wrong</th><th className="pb-4 text-[#cb941c]">Missed</th></tr></thead><tbody>{rows.map((row) => <tr key={row.section} className="border-t border-[#eceef2]"><td className="py-4 font-bold">{SECTION_LABEL[row.section]}</td><td className="py-4">{row.correct}</td><td className="py-4">{row.wrong}</td><td className="py-4">{row.missed}</td></tr>)}</tbody></table></div></Panel>
      </div>

      <div className="flex flex-wrap gap-3"><Link href="/mocks" className="flex min-h-11 items-center gap-2 rounded-xl border border-[#dde0e6] bg-white px-5 text-sm font-bold"><ArrowLeft size={16} /> Mock library</Link><button onClick={() => window.location.reload()} className="flex min-h-11 items-center gap-2 rounded-xl bg-[#191633] px-5 text-sm font-bold text-white"><RotateCcw size={16} /> Retake paper</button></div>
    </div>
  </div>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-[#e8e9ed] bg-white p-5 shadow-sm md:p-6"><h2 className="mb-5 text-lg font-bold">{title}</h2>{children}</section>; }
function Metric({ label, value, color }: { label: string; value: string; color: string }) { return <div className="rounded-xl border border-[#eceef2] p-4"><div className="text-xs text-[#9ba0aa]">{label}</div><div className="mt-2 text-xl font-bold" style={{ color }}>{value}</div></div>; }
function Spotlight({ color, icon, label, value }: { color: string; icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-2xl p-4" style={{ background: color }}><div className="mb-6 text-[#837d8e] [&_svg]:h-5 [&_svg]:w-5">{icon}</div><div className="text-xs text-[#92919a]">{label}</div><div className="mt-2 text-xl font-bold">{value}</div></div>; }
