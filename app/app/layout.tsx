"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import HeroBackground from "../components/HeroBackground";
import { getOnboardingStatus } from "../lib/storage";

const navItems: { href: string; label: string; mobileLabel?: string; icon?: string; iconSrc?: string }[] = [
  { href: "/app", label: "Inicio", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/app/respiraciones", label: "Respiraciones", iconSrc: "/icons/respiraciones.svg" },
  { href: "/app/relajacion-progresiva", label: "Relajación", iconSrc: "/icons/relajacion.svg" },
  { href: "/app/nutricion", label: "Nutrición", iconSrc: "/icons/nutricion.svg" },
  { href: "/app/plan-21-dias", label: "Checklist Semanal", mobileLabel: "Checklist", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { href: "/app/mide-tu-sueno", label: "Mide tu sueño", mobileLabel: "Medir", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { href: "/app/ebook", label: "Ebook", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
];

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/app/onboarding") {
      setReady(true);
      return;
    }
    const status = getOnboardingStatus();
    if (!status.profileCompleted || !status.basalCompleted) {
      router.replace("/app/onboarding");
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  if (!ready) return null;
  return <>{children}</>;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  if (pathname === "/app/onboarding") {
    return (
      <div className="min-h-screen flex relative overflow-hidden">
        <div className="fixed inset-0 z-0 opacity-40" style={{ contain: "strict" }}>
          <HeroBackground />
        </div>
        <div className="relative z-10 flex-1">
          <header className="lg:hidden sticky top-0 z-30 h-12 bg-rest-bg/80 backdrop-blur-lg flex items-center justify-center px-4">
            <img src="/logo.svg" alt="Método R.E.S.T." className="h-14 -my-1" />
          </header>
          <main className="p-4 pt-3 sm:p-6 sm:pt-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <OnboardingGuard>
      <div className="min-h-screen flex relative overflow-hidden">
        <div className="fixed inset-0 z-0 opacity-40" style={{ contain: "strict" }}>
          <HeroBackground />
        </div>

        {/* Sidebar Desktop */}
        <aside
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          className={`hidden lg:flex flex-col fixed top-3 bottom-3 left-3 z-40 rounded-2xl bg-rest-card-solid/90 transition-[width] duration-300 ease-in-out will-change-[width] ${
            expanded ? "w-60" : "w-[68px]"
          }`}
          style={{ boxShadow: "0 0 40px rgba(0,0,0,0.3)" }}
        >
          <div className="h-14 flex items-center px-3 shrink-0">
            <Link href="/app" className="flex items-center overflow-hidden">
              <img src="/logo.svg" alt="Método R.E.S.T." className={`transition-all duration-300 ${expanded ? "h-10" : "h-6"}`} />
            </Link>
          </div>

          <nav className="flex-1 py-2 px-2 space-y-1 overflow-hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap overflow-hidden ${
                    isActive
                      ? "bg-[#00E5A0]/15 text-[#00E5A0] shadow-[inset_0_0_0_1px_rgba(0,229,160,0.25)]"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.iconSrc ? (
                    <div
                      className={`w-5 h-5 shrink-0 ${isActive ? "drop-shadow-[0_0_4px_rgba(0,229,160,0.5)]" : ""}`}
                      style={{
                        backgroundColor: "currentColor",
                        WebkitMaskImage: `url(${item.iconSrc})`,
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskImage: `url(${item.iconSrc})`,
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                      }}
                    />
                  ) : (
                    <svg className={`w-5 h-5 shrink-0 ${isActive ? "drop-shadow-[0_0_4px_rgba(0,229,160,0.5)]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2 : 1.5} d={item.icon} />
                    </svg>
                  )}
                  <span className={`transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className={`relative z-10 flex-1 transition-[margin] duration-300 will-change-[margin] ${expanded ? "lg:ml-[252px]" : "lg:ml-[80px]"}`}>
          <header className="lg:hidden sticky top-0 z-30 h-12 bg-rest-bg/80 backdrop-blur-lg flex items-center justify-center px-4">
            <Link href="/app">
              <img src="/logo.svg" alt="Método R.E.S.T." className="h-14 -my-1" />
            </Link>
          </header>

          <main className="p-4 pt-3 sm:p-6 sm:pt-4 lg:p-8 pb-24 lg:pb-8">
            {children}
          </main>
        </div>

        {/* Bottom nav mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-rest-bg-alt/95 backdrop-blur-lg">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.slice(0, 6).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition ${
                    isActive ? "text-[#00E5A0] drop-shadow-[0_0_6px_rgba(0,229,160,0.4)]" : "text-white/60"
                  }`}
                >
                  {item.iconSrc ? (
                    <div
                      className={`w-5 h-5 ${isActive ? "" : "opacity-70"}`}
                      style={{
                        backgroundColor: "currentColor",
                        WebkitMaskImage: `url(${item.iconSrc})`,
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskImage: `url(${item.iconSrc})`,
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                      }}
                    />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2 : 1.5} d={item.icon} />
                    </svg>
                  )}
                  <span className="text-[10px] font-medium">{item.mobileLabel ?? item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/app/ebook"
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition ${
                pathname === "/app/ebook" ? "text-[#00E5A0] drop-shadow-[0_0_6px_rgba(0,229,160,0.4)]" : "text-white/60"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              <span className="text-[10px] font-medium">Más</span>
            </Link>
          </div>
        </nav>
      </div>
    </OnboardingGuard>
  );
}
