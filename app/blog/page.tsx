import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "../lib/blog";

export const metadata: Metadata = {
  title: "Blog — Sueño, estrés y sistema nervioso",
  description:
    "Artículos basados en evidencia sobre sueño, estrés e hiperactivación: por qué te despiertas de madrugada, cómo dormir mejor y qué dice la investigación.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const articles = getAllArticles();
  return (
    <div className="min-h-screen bg-rest-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-rest-accent text-sm mb-8 hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>

        <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-bold text-white mb-3">
          Blog
        </h1>
        <p className="text-rest-text-secondary text-base leading-relaxed mb-10">
          Artículos sobre sueño, estrés y sistema nervioso, con referencias y
          niveles de evidencia explícitos. Si buscas una visión de conjunto,
          empieza por la guía{" "}
          <Link href="/sueno-y-estres" className="text-rest-accent hover:underline">
            Insomnio por estrés
          </Link>
          .
        </p>

        <ul className="space-y-6">
          {articles.map((a) => (
            <li key={a.slug} className="pb-6 border-b border-white/10 last:border-0">
              <Link href={`/blog/${a.slug}`} className="group block">
                <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white group-hover:text-rest-accent transition mb-2">
                  {a.title}
                </h2>
                <p className="text-rest-text-secondary text-sm leading-relaxed">
                  {a.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
