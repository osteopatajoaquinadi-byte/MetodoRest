import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PRO_COOKIE, verifyProToken } from "../../lib/profesional-session";
import SalirProfesional from "../../components/profesional/SalirProfesional";

export const metadata: Metadata = {
  title: { default: "Acceso profesional", template: "%s | Acceso profesional" },
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/profesional", label: "Inicio" },
  { href: "/profesional/ficha", label: "Ficha" },
  { href: "/profesional/material", label: "Material" },
];

export default async function ProfesionalLayout({ children }: { children: React.ReactNode }) {
  // Segunda verificación (además del proxy), por si la ruta se sirve sin pasar por él.
  const session = verifyProToken((await cookies()).get(PRO_COOKIE)?.value);
  if (!session) redirect("/profesional/acceso");

  return (
    <div className="min-h-screen bg-rest-bg">
      <header className="no-print sticky top-0 z-30 bg-rest-bg/85 backdrop-blur-lg border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/profesional" className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-bold tracking-wider text-rest-accent font-[family-name:var(--font-space)]">R.E.S.T.</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rest-accent/10 text-rest-accent ring-1 ring-rest-accent/20 font-medium">
              PROFESIONAL
            </span>
          </Link>
          <nav className="flex items-center gap-0.5 sm:gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`min-h-[44px] items-center px-2 sm:px-3 text-sm text-rest-text-secondary hover:text-rest-text transition ${
                  n.href === "/profesional" ? "hidden sm:flex" : "flex"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <SalirProfesional />
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</main>
    </div>
  );
}
