# Aptivo — IPMAT Preparation Platform

A polished, gamified study platform for students preparing for **IPMAT Indore, IPMAT Rohtak, JIPMAT** and other IIM-level 5-year integrated management entrance tests. Built to give aspirants high-quality, structured study material with a smart, encouraging AI study buddy.

> Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion and Recharts.

## Why this exists
Made for students who struggle to find good, affordable IPMAT material — so no one has to face that gap again. Every question is generated with a **verified answer** and a full **step-by-step solution**, the method, the common trap, and a faster alternative.

## Features

### Daily habit
- **Daily QA Challenge** — 5 mixed quant questions, fresh every day
- **Daily VARC Challenge** — vocabulary, idioms & usage
- **Word of the Day** and **Daily RC** passage
- Streaks, XP, levels and combo confetti to keep you coming back

### Practice Arena (gamified)
- 13 QA topics + 6 VARC topics, each with **5 practice tests × 30 questions**
- Live timer, difficulty ramps, per-question hints, XP & combo streaks
- Subtopic explanations for every topic
- New numbers every attempt (seeded generators) → endless practice

### Mock Tests
- 5+ full mocks across **IIM Indore, Rohtak, JIPMAT**, sectionals, and a **previous-year (PYQ) pattern** paper
- Exam-accurate section splits & timing (IPMAT Indore keeps **QA-MCQ, QA-SA, VARC** separate)
- Whole-paper countdown, focus mode, full post-test review

### AI Tutor / Doubt Solver
- Solves calculations, equations and concept questions **deterministically** (verified, not guessed)
- Shows steps, "why this method", common mistakes, faster ways, and related practice
- Every reply tagged **Confirmed / Likely / Interpretation** for trust

### AI Video Lessons
- Animated topic lessons with **AI voice narration**, on-screen equations, PYQ notes, common traps
- Post-video 5-question quiz
- (Original AI coach voice — see note below)

### More
- **Vocabulary Builder** — flip cards with meaning, sentence, synonyms & antonyms
- **Reading Comprehension** — exam-level passages with evidence-based explanations
- **Para Jumbles** — drag-to-reorder with logic explanations
- **Performance Analytics** — accuracy, speed, topic strengths/weaknesses, section split, progress trend, expected-score band
- **Adaptive Study Planner** — weekly plan from your goal, hours & weak topics
- **Leaderboard** — XP / accuracy / streak boards, anonymous mode
- **Smart AI mascot (Apti)** — expressions and encouragement throughout

## Design
Premium dark palette — deep navy `#08111F`, electric orange `#FF6B35`, mint `#78F2C0`, violet `#7267F0`, warm paper `#FFF8EC` — editorial display type, progress rings, animated counters, gradient + grid backgrounds, mobile-first bottom nav and focus mode.

## Getting started
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start
```
Progress (XP, streak, attempts, plan) is saved in the browser via localStorage — no backend required for the demo.

## UI skills and registries

Project-scoped agent skills are installed in `.agents/skills/` for:

- Magic UI
- SmoothUI (including component craft, React performance, and design review guidance)
- unlumen UI
- Neobrutalism UI

`components.json` configures all four shadcn-compatible registries. Registry components install into `components/registry/` so they do not conflict with the app's existing `components/ui.tsx` module.

```bash
# Examples — install only the components a feature needs
npx shadcn@latest add @magicui/blur-fade
npx shadcn@latest add @smoothui/smooth-button
npx shadcn@latest add @unlumen-ui/<public-component-name>
npx shadcn@latest add @neobrutalism/button

# Inspect installed project skills
npx skills list
```

Unlumen Pro components require a separately purchased `UNLUMEN_LICENSE_KEY`; public components do not. Never commit license keys or other credentials.

## A note on voices & content integrity
- The app uses **original AI coach voices**, not imitations of public figures. Cloning real people's voices (e.g. celebrities) requires their explicit authorization, so that is intentionally not done here.
- PYQ mocks mirror the real **paper structure** (section split, count, timing) with fresh, verified questions and retained source metadata (exam, year, pattern).

## Roadmap
User accounts & real leaderboards, expanded PYQ library, more video lessons with narration, image-based doubt upload, and subscriptions.
