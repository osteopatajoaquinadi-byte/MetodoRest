"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-rest-bg flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-rest-accent/[0.04] bg-rest-bg-alt fixed inset-y-0 left-0 z-40">
        <div className="h-16 flex items-center px-6 border-b border-rest-accent/[0.04]">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-wider text-rest-accent font-[family-name:var(--font-space)]">R.E.S.T.</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rest-accent/10 text-rest-accent border border-rest-accent/20 font-medium">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-rest-accent/10 text-rest-accent border border-rest-accent/20" : "text-rest-text-secondary hover:text-rest-text hover:bg-rest-card"
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-rest-accent/[0.04]">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-rest-text-muted hover:text-rest-text transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 h-14 bg-rest-bg/80 backdrop-blur-lg border-b border-rest-accent/[0.04] flex items-center justify-between px-4 lg:px-8">
          <div className="lg:hidden flex items-center gap-2">
            <span className="text-lg font-bold tracking-wider text-rest-accent font-[family-name:var(--font-space)]">R.E.S.T.</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rest-accent/10 text-rest-accent border border-rest-accent/20 font-medium">ADMIN</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rest-accent/20 flex items-center justify-center">
              <span className="text-rest-accent text-xs font-bold">A</span>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
