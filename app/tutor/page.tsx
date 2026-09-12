"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { solveDoubt, type TutorReply } from "@/lib/tutor";
import { BotFace } from "@/components/AiBot";
import { SectionTitle } from "@/components/ui";
import { useApp } from "@/lib/store";

type Msg = { role: "user" | "bot"; text?: string; reply?: TutorReply };

const SUGGESTIONS = ["12.5% of 480", "increase 400 by 15%", "solve 3x+5=20", "compound interest", "time and work", "18*24 + 96/4"];

const CONF_COLOR: Record<string, string> = { Confirmed: "#78F2C0", Likely: "#FFC15E", Interpretation: "#7267F0" };

export default function TutorPage() {
  const { addXp } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", reply: { kind: "chat", title: "Hi, I'm Apti — your AI doubt solver!", steps: ["Ask me any QA question and I'll solve it step-by-step and verify the arithmetic.", "Try a calculation like '25% of 960', an equation like 'solve 5x-3=22', or a concept like 'compound interest'."], confidence: "Confirmed", related: SUGGESTIONS.slice(0, 3) } },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, thinking]);

  function send(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const reply = solveDoubt(text);
      setMsgs((m) => [...m, { role: "bot", reply }]);
      setThinking(false);
      if (reply.kind === "solution") addXp(2);
    }, 650);
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <SectionTitle kicker="AI Tutor" title="AI Doubt Solver" sub="Step-by-step, verified solutions with the method, common mistakes and faster alternatives." />

      <div className="card p-4 md:p-6 flex flex-col h-[62vh]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {msgs.map((m, i) =>
            m.role === "user" ? (
              <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end">
                <div className="bg-orange text-ink rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] font-medium">{m.text}</div>
              </motion.div>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                <BotFace expression={m.reply?.kind === "solution" ? "cheer" : m.reply?.kind === "tip" ? "happy" : "calm"} size={44} />
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{m.reply?.title}</span>
                    {m.reply?.confidence && <span className="chip" style={{ background: `${CONF_COLOR[m.reply.confidence]}22`, color: CONF_COLOR[m.reply.confidence] }}>{m.reply.confidence}</span>}
                  </div>
                  <div className="text-sm space-y-1 text-paper/85">
                    {m.reply?.steps.map((s, j) => <div key={j} className="flex gap-2"><span className="text-orange font-bold">{m.reply?.kind === "solution" ? `${j + 1}.` : "•"}</span><span>{s}</span></div>)}
                  </div>
                  {m.reply?.whyMethod && <div className="text-sm text-sky/90"><b>Why:</b> {m.reply.whyMethod}</div>}
                  {m.reply?.commonMistake && <div className="text-sm text-gold/90"><b>⚠ Common mistake:</b> {m.reply.commonMistake}</div>}
                  {m.reply?.faster && <div className="text-sm text-mint/90"><b>⚡ Faster:</b> {m.reply.faster}</div>}
                  {m.reply?.related && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.reply.related.map((r) => <button key={r} onClick={() => send(r.replace(/^(Try|Ask):?\s*'?|'$/g, ""))} className="chip bg-white/5 text-paper/60 hover:bg-white/10">{r}</button>)}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          )}
          {thinking && (
            <div className="flex gap-3 items-center">
              <BotFace expression="think" size={44} />
              <div className="glass rounded-2xl px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => <motion.span key={i} className="w-2 h-2 rounded-full bg-paper/60" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="pt-3 border-t border-white/5 mt-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
            {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)} className="chip bg-white/5 text-paper/60 hover:bg-white/10 whitespace-nowrap">{s}</button>)}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a question, calculation or topic…"
              className="flex-1 bg-ink3 rounded-2xl px-4 py-3 outline-none border border-white/10 focus:border-orange/50" />
            <button type="submit" className="btn-primary">Solve</button>
          </form>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-start gap-3">
          <BotFace expression="calm" size={40} />
          <div className="text-sm text-paper/70">
            <b className="text-paper">How I keep answers trustworthy:</b> calculations are computed deterministically and verified, not guessed. Every reply is tagged <span className="text-mint">Confirmed</span>, <span className="text-gold">Likely</span>, or <span className="text-violet">Interpretation</span> so you always know how sure to be.
          </div>
        </div>
      </div>
    </div>
  );
}
