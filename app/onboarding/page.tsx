"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { BotBubble } from "@/components/AiBot";
import { BrainCircuit, Sparkles, Target } from "lucide-react";

const Apti3D = dynamic(() => import("@/components/Apti3D"), { ssr: false, loading: () => <div className="h-[320px] animate-pulse-soft rounded-full bg-orange/5" /> });

const EXAMS = [
  { id: "IPMAT Indore", desc: "IIM Indore · 5-year IPM · QA MCQ + QA SA + VARC" },
  { id: "IPMAT Rohtak", desc: "IIM Rohtak · QA + Logical Reasoning + Verbal" },
  { id: "JIPMAT", desc: "IIM Jammu & Bodh Gaya · QA + DILR + VARC" },
  { id: "Other IIM-level", desc: "General 5-year integrated management aptitude prep" },
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const VOICES = [
  { id: "coach", label: "Exam Coach", desc: "Focused, motivating" },
  { id: "friendly", label: "Friendly Mentor", desc: "Warm & encouraging" },
  { id: "energetic", label: "High Energy", desc: "Fast & hype" },
  { id: "calm", label: "Calm Teacher", desc: "Steady & clear" },
];

export default function Onboarding() {
  const router = useRouter();
  const { setProfile, profile } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [exam, setExam] = useState(profile.targetExam);
  const [examDate, setExamDate] = useState(profile.examDate);
  const [hours, setHours] = useState(2);
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Beginner");
  const [voice, setVoice] = useState("coach");

  const steps = ["Welcome", "Your goal", "Your level", "Your voice", "Ready"];

  function finish() {
    setProfile({ name: name || "Aspirant", targetExam: exam, examDate, dailyHours: hours, level, voice, onboarded: true });
    router.replace("/");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07101d] p-4 md:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,107,53,.18),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(114,103,240,.17),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="relative mx-auto grid min-h-[calc(100vh-56px)] w-full max-w-7xl overflow-hidden rounded-[36px] border border-white/10 bg-[#0c1829]/80 shadow-[0_50px_140px_-50px_rgba(0,0,0,1)] backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
        <aside className="relative hidden overflow-hidden border-r border-white/[0.08] p-10 lg:flex lg:flex-col lg:justify-between">
          <div><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange text-ink"><Target size={22} /></div><div><div className="display text-2xl font-bold">Aptivo</div><div className="text-[9px] font-bold uppercase tracking-[.25em] text-paper/35">IIM mastery engine</div></div></div><h1 className="display mt-10 text-5xl font-semibold leading-[1.02]">Meet the coach that<br/><span className="text-gradient">studies how you think.</span></h1><p className="mt-5 max-w-lg text-sm leading-6 text-paper/45">A living preparation system with above-PYQ practice, forensic mistake analysis and a plan that changes as you improve.</p></div>
          <div className="absolute inset-x-8 top-[210px]"><Apti3D compact /></div>
          <div className="relative grid grid-cols-3 gap-3">{[[BrainCircuit,"19","Skill tracks"],[Sparkles,"90","Elite questions"],[Target,"1","Daily target"]].map(([Icon,value,label]) => { const I = Icon as typeof Target; return <div key={String(label)} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4"><I size={16} className="mb-4 text-orange"/><div className="text-xl font-bold">{String(value)}</div><div className="mt-1 text-[9px] uppercase tracking-wider text-paper/30">{String(label)}</div></div>; })}</div>
        </aside>
        <section className="flex items-center p-5 md:p-10">
          <div className="w-full max-w-xl mx-auto">
            <div className="mb-7 lg:hidden"><Apti3D compact /></div>
            <div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-orange">Personalise your system</span><span className="text-xs font-bold text-paper/35">{step + 1} / {steps.length}</span></div>
            <div className="flex gap-1.5 mb-6">
              {steps.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-gradient-to-r from-orange to-gold" : "bg-white/10"}`} />)}
            </div>
            <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card p-7">
            {step === 0 && (
              <div className="space-y-5">
                <BotBubble expression="cheer" text={<>Hi! I'm <b className="text-mint">Apti</b>, your AI study buddy. I'll turn your IPMAT prep into a daily game you actually enjoy. Let's set you up in 30 seconds!</>} />
                <div>
                  <label className="text-sm text-paper/60">What should I call you?</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                    className="w-full mt-2 bg-ink3 rounded-2xl px-4 py-3 outline-none border border-white/10 focus:border-orange/50" />
                </div>
                <button onClick={() => setStep(1)} className="btn-primary w-full">Let's go →</button>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-5">
                <BotBubble expression="think" text="Which exam are you targeting? I'll tailor mocks, sections and difficulty to it." />
                <div className="grid gap-2">
                  {EXAMS.map((e) => (
                    <button key={e.id} onClick={() => setExam(e.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all ${exam === e.id ? "border-orange bg-orange/10" : "border-white/10 hover:border-white/25"}`}>
                      <div className="font-semibold">{e.id}</div>
                      <div className="text-xs text-paper/50">{e.desc}</div>
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-sm text-paper/60">Target exam date</label>
                  <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)}
                    className="w-full mt-2 bg-ink3 rounded-2xl px-4 py-3 outline-none border border-white/10 focus:border-orange/50" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-ghost">← Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1">Continue →</button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-5">
                <BotBubble expression="happy" text="How would you rate yourself right now, and how many hours can you study daily? I'll build your plan around this." />
                <div>
                  <label className="text-sm text-paper/60 mb-2 block">Current level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {LEVELS.map((l) => (
                      <button key={l} onClick={() => setLevel(l)}
                        className={`py-3 rounded-2xl border text-sm font-semibold transition-all ${level === l ? "border-mint bg-mint/10 text-mint" : "border-white/10"}`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-paper/60 mb-2 block">Daily study hours: <b className="text-orange">{hours}h</b></label>
                  <input type="range" min={1} max={8} value={hours} onChange={(e) => setHours(+e.target.value)} className="w-full accent-orange" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1">Continue →</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-5">
                <BotBubble expression="wow" text={<>Pick my teaching voice! You can change it anytime. (These are original AI coach voices — friendly, licensed, and exam-focused.)</>} />
                <div className="grid grid-cols-2 gap-2">
                  {VOICES.map((v) => (
                    <button key={v.id} onClick={() => setVoice(v.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all ${voice === v.id ? "border-violet bg-violet/10" : "border-white/10 hover:border-white/25"}`}>
                      <div className="font-semibold">{v.label}</div>
                      <div className="text-xs text-paper/50">{v.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-ghost">← Back</button>
                  <button onClick={() => setStep(4)} className="btn-primary flex-1">Continue →</button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-5 text-center">
                <BotBubble expression="cheer" text={<>You're all set, <b>{name || "champion"}</b>! Your personalised IPMAT journey is ready. Daily challenges, mocks, video lessons and me — every step of the way. 🚀</>} />
                <button onClick={finish} className="btn-primary w-full text-lg">Enter Aptivo →</button>
              </div>
            )}
          </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
