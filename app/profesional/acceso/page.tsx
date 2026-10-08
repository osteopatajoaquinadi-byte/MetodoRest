import type { Metadata } from "next";
import Link from "next/link";
import AccesoForm from "../../components/profesional/AccesoForm";

export const metadata: Metadata = {
  title: "Acceso profesional",
  robots: { index: false, follow: false },
};

function destinoSeguro(next: string | string[] | undefined): string {
  const v = Array.isArray(next) ? next[0] : next;
  return v && v.startsWith("/profesional") && !v.startsWith("//") ? v : "/profesional";
}

export default async function AccesoProfesionalPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="min-h-screen bg-rest-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/logo.svg" alt="Método R.E.S.T." className="h-12 mx-auto mb-4" />
          </Link>
          <h1 className="font-[family-name:var(--font-space)] text-2xl font-bold text-white">Acceso profesional</h1>
          <p className="text-rest-text-secondary text-sm mt-2 leading-relaxed">
            Para profesionales de la Red Método REST: ficha de evaluación y material de respaldo.
          </p>
        </div>
        <AccesoForm next={destinoSeguro(next)} />
      </div>
    </div>
  );
}
