"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp, levelFromXp } from "@/lib/store";
import { BotFace } from "./AiBot";
import { useEffect } from "react";

const NAV = [
  { href: "/", label: "Home", icon: "◆" },
  { href: "/practice", label: "Practice", icon: "▦" },
  { href: "/mocks", label: "Mocks", icon: "⏱" },
  { href: "/varc", label: "VARC", icon: "📖" },
  { href: "/videos", label: "Videos", icon: "▶" },
  { href: "/tutor", label: "AI Tutor", icon: "✦" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
  { href: "/revision", label: "Mistakes", icon: "↻" },
  { href: "/planner", label: "Planner", icon: "🗓" },
  { href: "/leaderboard", label: "Ranks", icon: "🏆" },
];

const BOTTOM = [
  { href: "/", label: "Home", icon: "◆" },
  { href: "/practice", label: "Practice", icon: "▦" },
  { href: "/mocks", label: "Mocks", icon: "⏱" },
  { href: "/tutor", label: "Tutor", icon: "✦" },
  { href: "/analytics", label: "Stats", icon: "📈" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, xp, streak, ready } = useApp();
  const { level, pct } = levelFromXp(xp);

  // Onboarding gate
  useEffect(() => {
    if (!ready) return;
    if (!profile.onboarded && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [ready, profile.onboarded, pathname, router]);

  const inTest = pathname?.startsWith("/test") || pathname === "/onboarding";

  if (inTest) {
    return <div className="min-h-screen grid-bg">{children}</div>;
  }

  return (
    <div className="min-h-screen grid-bg">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-violet/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-mint/5 blur-[120px]" />
      </div>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-white/5 p-5">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <BotFace expression="happy" size={40} />
            <div>
              <div className="display text-2xl font-bold leading-none text-gradient">Aptivo</div>
              <div className="text-[10px] tracking-[0.25em] text-paper/40 uppercase">IPMAT Prep</div>
            </div>
          </Link>

          <nav className="flex-1 space-y-1">
            {NAV.map((n) => {
              const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
              return (
                <Link key={n.href} href={n.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? "bg-orange/15 text-orange border border-orange/20" : "text-paper/60 hover:text-paper hover:bg-white/5"}`}>
                  <span className="w-5 text-center">{n.icon}</span>{n.label}
                </Link>
              );
            })}
          </nav>

          <div className="card p-4 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-paper/60">Level {level}</span>
              <span className="text-mint font-bold">{xp} XP</span>
            </div>
            <div className="h-2 rounded-full bg-ink3 mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange to-mint rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-sm">
              <span className="text-orange">🔥</span>
              <span className="font-bold">{streak}</span>
              <span className="text-paper/50">day streak</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Mobile top bar */}
          <div className="lg:hidden sticky top-0 z-40 glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BotFace expression="happy" size={30} />
              <span className="display text-xl font-bold text-gradient">Aptivo</span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <span className="chip bg-mint/15 text-mint">{xp} XP</span>
              <span className="chip bg-orange/15 text-orange">🔥 {streak}</span>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28 lg:pb-10">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-white/10 px-2 py-2 flex justify-around">
        {BOTTOM.map((n) => {
          const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
          return (
            <Link key={n.href} href={n.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all ${active ? "text-orange" : "text-paper/50"}`}>
              <span className="text-lg">{n.icon}</span>{n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
