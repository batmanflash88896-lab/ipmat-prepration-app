"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type AttemptLog = {
  id: string;
  kind: string; // e.g. "practice:percentages", "mock:ipmat-indore-1", "daily-qa"
  label: string;
  topic?: string;
  section?: string;
  correct: number;
  total: number;
  timeSec: number;
  xp: number;
  date: string; // ISO
};

export type StudyTask = {
  id: string;
  title: string;
  type: "QA" | "VARC" | "Mock" | "Revision";
  done: boolean;
  day: number; // day index in plan
};

export type MistakeItem = {
  id: string;
  questionId: string;
  stem: string;
  topic: string;
  subtopic: string;
  section: string;
  difficulty: "Easy" | "Medium" | "Hard";
  chosenAnswer: string;
  correctAnswer: string;
  solution: string[];
  commonMistake?: string;
  source?: string;
  date: string;
  reviewed: boolean;
  reviewCount: number;
};

export type Profile = {
  name: string;
  targetExam: string;
  examDate: string; // ISO date
  dailyHours: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  voice: string;
  onboarded: boolean;
};

type State = {
  profile: Profile;
  xp: number;
  streak: number;
  lastActive: string; // ISO date (yyyy-mm-dd)
  attempts: AttemptLog[];
  mistakes: MistakeItem[];
  vocabLearned: string[];
  plan: StudyTask[];
  dailyDone: Record<string, string>; // e.g. {"daily-qa": "2026-09-12"}
};

const todayStr = () => new Date().toISOString().slice(0, 10);

const DEFAULT_STATE: State = {
  profile: {
    name: "",
    targetExam: "IPMAT Indore",
    examDate: "2027-05-15",
    dailyHours: 2,
    level: "Beginner",
    voice: "coach",
    onboarded: false,
  },
  xp: 0,
  streak: 0,
  lastActive: "",
  attempts: [],
  mistakes: [],
  vocabLearned: [],
  plan: [],
  dailyDone: {},
};

type Ctx = State & {
  ready: boolean;
  setProfile: (p: Partial<Profile>) => void;
  addAttempt: (a: Omit<AttemptLog, "id" | "date">) => void;
  recordMistakes: (items: Omit<MistakeItem, "id" | "date" | "reviewed" | "reviewCount">[]) => void;
  toggleMistakeReviewed: (id: string) => void;
  clearReviewedMistakes: () => void;
  addXp: (n: number) => void;
  touchStreak: () => void;
  learnVocab: (word: string) => void;
  markDaily: (key: string) => void;
  setPlan: (p: StudyTask[]) => void;
  toggleTask: (id: string) => void;
  reset: () => void;
};

const AppCtx = createContext<Ctx | null>(null);
const KEY = "aptivo-state-v1";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
    }
  }, [state, ready]);

  const setProfile = useCallback((p: Partial<Profile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...p } }));
  }, []);

  const touchStreak = useCallback(() => {
    setState((s) => {
      const today = todayStr();
      if (s.lastActive === today) return s;
      const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streak = s.lastActive === yest ? s.streak + 1 : 1;
      return { ...s, streak, lastActive: today };
    });
  }, []);

  const addXp = useCallback((n: number) => setState((s) => ({ ...s, xp: s.xp + n })), []);

  const addAttempt = useCallback((a: Omit<AttemptLog, "id" | "date">) => {
    setState((s) => {
      const today = todayStr();
      const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streak = s.lastActive === today ? s.streak : s.lastActive === yest ? s.streak + 1 : 1;
      return {
        ...s,
        xp: s.xp + a.xp,
        lastActive: today,
        streak,
        attempts: [
          { ...a, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: new Date().toISOString() },
          ...s.attempts,
        ].slice(0, 500),
      };
    });
  }, []);

  const recordMistakes = useCallback((items: Omit<MistakeItem, "id" | "date" | "reviewed" | "reviewCount">[]) => {
    if (!items.length) return;
    setState((s) => {
      const now = new Date().toISOString();
      const incoming = items.map((item) => {
        const previous = s.mistakes.find((m) => m.questionId === item.questionId);
        return {
          ...item,
          id: previous?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          date: now,
          reviewed: false,
          reviewCount: previous?.reviewCount ?? 0,
        };
      });
      const incomingIds = new Set(incoming.map((m) => m.questionId));
      return { ...s, mistakes: [...incoming, ...s.mistakes.filter((m) => !incomingIds.has(m.questionId))].slice(0, 300) };
    });
  }, []);

  const toggleMistakeReviewed = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      mistakes: s.mistakes.map((m) => m.id === id
        ? { ...m, reviewed: !m.reviewed, reviewCount: !m.reviewed ? m.reviewCount + 1 : m.reviewCount }
        : m),
    }));
  }, []);

  const clearReviewedMistakes = useCallback(() => {
    setState((s) => ({ ...s, mistakes: s.mistakes.filter((m) => !m.reviewed) }));
  }, []);

  const learnVocab = useCallback((word: string) => {
    setState((s) => (s.vocabLearned.includes(word) ? s : { ...s, vocabLearned: [...s.vocabLearned, word] }));
  }, []);

  const markDaily = useCallback((key: string) => {
    setState((s) => ({ ...s, dailyDone: { ...s.dailyDone, [key]: todayStr() } }));
  }, []);

  const setPlan = useCallback((p: StudyTask[]) => setState((s) => ({ ...s, plan: p })), []);
  const toggleTask = useCallback((id: string) => {
    setState((s) => ({ ...s, plan: s.plan.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
  }, []);

  const reset = useCallback(() => setState(DEFAULT_STATE), []);

  return (
    <AppCtx.Provider
      value={{ ...state, ready, setProfile, addAttempt, recordMistakes, toggleMistakeReviewed, clearReviewedMistakes, addXp, touchStreak, learnVocab, markDaily, setPlan, toggleTask, reset }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
}

// XP helpers
export function levelFromXp(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const curBase = 50 * (level - 1) ** 2;
  const nextBase = 50 * level ** 2;
  const pct = Math.min(100, Math.round(((xp - curBase) / (nextBase - curBase)) * 100));
  return { level, pct, toNext: nextBase - xp };
}

export function isDailyDone(dailyDone: Record<string, string>, key: string) {
  return dailyDone[key] === todayStr();
}
