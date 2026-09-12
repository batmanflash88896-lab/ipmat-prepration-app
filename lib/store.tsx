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
  vocabLearned: [],
  plan: [],
  dailyDone: {},
};

type Ctx = State & {
  ready: boolean;
  setProfile: (p: Partial<Profile>) => void;
  addAttempt: (a: Omit<AttemptLog, "id" | "date">) => void;
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
      value={{ ...state, ready, setProfile, addAttempt, addXp, touchStreak, learnVocab, markDaily, setPlan, toggleTask, reset }}
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
