"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3, BookOpen, Bot, BrainCircuit, CalendarDays, ChevronRight,
  Clock3, Flame, Home, Medal, NotebookPen, PlayCircle, Search, Sparkles, Target,
} from "lucide-react";
import { useApp, levelFromXp } from "@/lib/store";

const SpatialEnvironment = dynamic(() => import("./SpatialEnvironment"), { ssr: false });

const NAV: { href: string; label: string; icon: LucideIcon; group: string }[] = [
  { href: "/", label: "Overview", icon: Home, group: "Today" },
  { href: "/planner", label: "Study plan", icon: CalendarDays, group: "Today" },
  { href: "/practice", label: "Topic practice", icon: BrainCircuit, group: "Prepare" },
  { href: "/mocks", label: "Mock lab", icon: Clock3, group: "Prepare" },
  { href: "/varc", label: "VARC studio", icon: BookOpen, group: "Prepare" },
  { href: "/videos", label: "Concept lessons", icon: PlayCircle, group: "Learn" },
  { href: "/tutor", label: "AI doubt room", icon: Bot, group: "Learn" },
  { href: "/revision", label: "Mistake book", icon: NotebookPen, group: "Improve" },
  { href: "/analytics", label: "Performance", icon: BarChart3, group: "Improve" },
  { href: "/leaderboard", label: "Ranks", icon: Medal, group: "Improve" },
];

const BOTTOM = [
  { href: "/", label: "Home", icon: Home },
  { href: "/practice", label: "Practice", icon: BrainCircuit },
  { href: "/mocks", label: "Mocks", icon: Clock3 },
  { href: "/tutor", label: "Tutor", icon: Bot },
  { href: "/analytics", label: "Progress", icon: BarChart3 },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, xp, streak, ready, mistakes } = useApp();
  const { level, pct } = levelFromXp(xp);

  useEffect(() => {
    if (ready && !profile.onboarded && pathname !== "/onboarding") router.replace("/onboarding");
  }, [ready, profile.onboarded, pathname, router]);

  if (pathname?.startsWith("/test") || pathname === "/onboarding") return <div className="min-h-screen grid-bg">{children}</div>;

  const activeFor = (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href));
  const groups = ["Today", "Prepare", "Learn", "Improve"];

  return (
    <div className="spatial-shell min-h-screen grid-bg">
      <SpatialEnvironment />
      <div className="spatial-layout flex">
        <aside className="spatial-sidebar sticky top-0 hidden h-screen w-[276px] shrink-0 flex-col border-r border-white/[0.07] bg-[#081322]/85 px-4 py-5 backdrop-blur-xl lg:flex">
          <Link href="/" className="mb-7 flex items-center gap-3 px-2" aria-label="Aptivo home">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-orange/30 bg-orange/10">
              <Target className="text-orange" size={22} strokeWidth={2.4} />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-ink bg-mint" />
            </div>
            <div>
              <div className="display text-[26px] font-bold leading-none text-gradient">Aptivo</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[.26em] text-paper/35">IPM command centre</div>
            </div>
          </Link>

          <nav className="no-scrollbar flex-1 overflow-y-auto pr-1" aria-label="Primary navigation">
            {groups.map((group) => (
              <div key={group} className="mb-4">
                <div className="mb-1.5 px-3 text-[9px] font-bold uppercase tracking-[.2em] text-paper/25">{group}</div>
                <div className="space-y-0.5">
                  {NAV.filter((item) => item.group === group).map((item) => {
                    const active = activeFor(item.href);
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${active ? "bg-paper text-ink shadow-[3px_3px_0_#ff6b35]" : "text-paper/55 hover:bg-white/[0.05] hover:text-paper"}`}>
                        <Icon size={17} strokeWidth={active ? 2.5 : 2} />
                        <span className="flex-1">{item.label}</span>
                        {item.href === "/revision" && mistakes.filter((m) => !m.reviewed).length > 0 && <span className="rounded-full bg-rose/15 px-1.5 text-[9px] text-rose">{mistakes.filter((m) => !m.reviewed).length}</span>}
                        {active && <ChevronRight size={14} />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="spatial-core-icon grid h-[34px] w-[34px] place-items-center rounded-xl border border-orange/25 bg-orange/10"><BrainCircuit size={17} className="text-orange" /></div><div><div className="text-xs font-bold">Level {level}</div><div className="text-[10px] text-paper/40">{xp} total XP</div></div></div>
              <div className="flex items-center gap-1 text-xs font-bold text-orange"><Flame size={14} />{streak}</div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-gradient-to-r from-orange to-gold" style={{ width: `${pct}%` }} /></div>
          </div>
        </aside>

        <main className="spatial-main min-w-0 flex-1">
          <header className="spatial-header sticky top-0 z-40 border-b border-white/[0.06] bg-[#07101d]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-[1260px] items-center justify-between px-4 md:px-8">
              <Link href="/" className="flex items-center gap-2 lg:hidden"><Target size={22} className="text-orange" /><span className="display text-xl font-bold">Aptivo</span></Link>
              <div className="hidden items-center gap-2 text-xs text-paper/40 lg:flex"><Sparkles size={14} className="text-gold" /><span>Train for the decision, not just the question.</span></div>
              <div className="flex items-center gap-2">
                <Link href="/practice" className="hidden min-w-[210px] items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs text-paper/35 md:flex"><Search size={14} /> Search topics <span className="ml-auto rounded border border-white/10 px-1.5 py-0.5 text-[9px]">⌘ K</span></Link>
                <span className="chip bg-orange/10 text-orange"><Flame size={13} />{streak} day streak</span>
                <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-violet/15 text-xs font-bold text-violet">{(profile.name || "A").slice(0, 1).toUpperCase()}</div>
              </div>
            </div>
          </header>

          <div className="spatial-content mx-auto max-w-[1260px] px-4 py-6 pb-28 md:px-8 md:py-9 lg:pb-10">{children}</div>
        </main>
      </div>

      <nav className="glass fixed inset-x-2 bottom-2 z-50 flex justify-around rounded-2xl p-1.5 shadow-2xl lg:hidden" aria-label="Mobile navigation">
        {BOTTOM.map((item) => { const Icon = item.icon; const active = activeFor(item.href); return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[9px] font-bold ${active ? "bg-orange text-ink" : "text-paper/45"}`}><Icon size={18} />{item.label}</Link>
        ); })}
      </nav>
    </div>
  );
}
