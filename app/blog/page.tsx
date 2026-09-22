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
          <Link href="/sueno-y-estres" className="link-inline">
            Insomnio por estrés
          </Link>
          .
        </p>

        <div className="mb-12 p-6 rounded-2xl bg-white/[0.03] ring-1 ring-rest-accent/30 text-center">
          <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white mb-2">
            ¿Sobre qué te gustaría leer?
          </h2>
          <p className="text-rest-text-secondary text-sm leading-relaxed mb-5 max-w-md mx-auto">
            Estos artículos se escriben a partir de las dudas reales de quienes
            duermen mal. Si hay un tema sobre sueño o estrés que te gustaría que
            abordemos, cuéntanoslo.
          </p>
          <a
            href="mailto:metodorest@gmail.com?subject=Sugerencia%20para%20el%20blog&body=Me%20gustar%C3%ADa%20leer%20sobre%3A%0A%0A"
            className="inline-flex items-center justify-center rounded-full bg-rest-accent px-6 py-3 text-sm font-semibold text-rest-bg hover:opacity-90 transition"
          >
            Proponer un tema
          </a>
        </div>

        <ul className="space-y-6">
          {articles.map((a) => (
            <li key={a.slug} className="pb-6 border-b border-white/10 last:border-0">
              <Link href={`/blog/${a.slug}`} className="group block">
                <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white group-hover:text-rest-accent transition mb-2 flex items-baseline gap-2.5">
                  <svg
                    className="w-4 h-4 shrink-0 translate-y-px text-rest-accent transition-transform duration-200 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h13" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                  <span>{a.title}</span>
                </h2>
                <p className="text-rest-text-secondary text-sm leading-relaxed pl-[26px]">
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
