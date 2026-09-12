"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { BotBubble } from "@/components/AiBot";

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
    <div className="min-h-screen grid-bg flex items-center justify-center p-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet/15 blur-[120px]" />
      </div>
      <div className="w-full max-w-xl">
        <div className="flex gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-orange" : "bg-white/10"}`} />
          ))}
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
    </div>
  );
}
