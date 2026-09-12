"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui";
import { BotBubble } from "@/components/AiBot";
import { VARC_TOPICS } from "@/lib/content";

const MODULES = [
  { href: "/varc/vocab", title: "Vocabulary Builder", desc: "Meaning · sentence · synonyms · antonyms — the full word, daily.", icon: "📖", color: "#7267F0" },
  { href: "/varc/rc", title: "Reading Comprehension", desc: "Exam-relevant passages with evidence-based answers.", icon: "📰", color: "#4FC3F7" },
  { href: "/varc/idioms", title: "Idioms & Phrases", desc: "High-frequency idioms with meaning and usage.", icon: "💬", color: "#FFC15E" },
  { href: "/varc/parajumbles", title: "Para Jumbles", desc: "Reorder sentences into a coherent paragraph.", icon: "🧩", color: "#FF6B35" },
  { href: "/daily/varc", title: "Daily VARC Set", desc: "Mixed vocab, idioms & usage — quick daily reps.", icon: "⚡", color: "#78F2C0" },
  { href: "/practice", title: "Verbal Practice Tests", desc: "Timed VARC drills in the Practice Arena.", icon: "▦", color: "#FF5D8F" },
];

export default function VARCHub() {
  return (
    <div className="space-y-6">
      <SectionTitle kicker="VARC" title="Verbal Ability & Reading" sub="Everything for the verbal section — built around what IPMAT actually tests: vocabulary, idioms, usage and inference-based RC." />
      <BotBubble expression="happy" text={<>Verbal marks come from <b>daily habit</b>. Learn one word deeply, read one passage carefully, every single day. It compounds fast. 📚</>} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map((m, i) => (
          <motion.div key={m.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link href={m.href} className="card card-hover p-5 block h-full">
              <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl mb-3" style={{ background: `${m.color}22` }}>{m.icon}</div>
              <div className="font-semibold text-lg">{m.title}</div>
              <div className="text-sm text-paper/50 mt-1">{m.desc}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="display text-2xl font-semibold mb-3">What VARC covers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {VARC_TOPICS.map((t) => (
            <div key={t.slug} className="p-3 rounded-2xl bg-white/5">
              <div className="font-semibold text-sm flex items-center gap-2"><span>{t.icon}</span>{t.name}</div>
              <div className="text-xs text-paper/50 mt-1">{t.subtopics.join(" · ")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
