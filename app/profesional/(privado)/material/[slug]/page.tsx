import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllMaterial, getMaterial } from "../../../../lib/profesional-material";
import { Markdown } from "../../../../components/Markdown";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getMaterial(slug);
  return m ? { title: m.title } : {};
}

export default async function MaterialDetalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMaterial(slug);
  if (!m) notFound();

  const todos = getAllMaterial();
  const i = todos.findIndex((x) => x.slug === slug);
  const anterior = i > 0 ? todos[i - 1] : null;
  const siguiente = i >= 0 && i < todos.length - 1 ? todos[i + 1] : null;

  return (
    <article className="max-w-3xl">
      <Link href="/profesional/material" className="inline-flex items-center gap-2 text-rest-accent text-sm mb-6 hover:underline">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Todo el material
      </Link>
      <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-bold text-white mb-3">{m.title}</h1>
      <p className="text-rest-text-secondary text-base leading-relaxed mb-6">{m.summary}</p>
      <div className="text-rest-text-secondary text-base leading-relaxed">
        <Markdown body={m.body} />
      </div>

      <nav className="mt-12 pt-6 border-t border-white/[0.06] grid sm:grid-cols-2 gap-3 text-sm">
        {anterior ? (
          <Link href={`/profesional/material/${anterior.slug}`} className="glass-card p-4 hover:ring-1 hover:ring-rest-accent/30 transition">
            <span className="block text-rest-text-muted text-xs mb-1">Anterior</span>
            <span className="text-white">{anterior.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {siguiente && (
          <Link href={`/profesional/material/${siguiente.slug}`} className="glass-card p-4 sm:text-right hover:ring-1 hover:ring-rest-accent/30 transition">
            <span className="block text-rest-text-muted text-xs mb-1">Siguiente</span>
            <span className="text-white">{siguiente.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
