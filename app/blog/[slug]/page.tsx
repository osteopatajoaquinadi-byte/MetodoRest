import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getSlugs, getAllArticles, RELATED } from "../../lib/blog";
import { Markdown } from "../../components/Markdown";

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `https://metodorest.cl/blog/${slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const all = getAllArticles();
  const relatedSlugs = RELATED[slug] ?? [];
  const related = relatedSlugs
    .map((s) => all.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: "Joaquín Adi",
      url: "https://metodorest.cl/sobre-mi",
    },
    publisher: { "@type": "Organization", name: "Método R.E.S.T." },
    mainEntityOfPage: `https://metodorest.cl/blog/${slug}`,
    datePublished: "2026-09-20",
    dateModified: "2026-09-20",
  };

  return (
    <div className="min-h-screen bg-rest-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-rest-accent text-sm mb-8 hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al blog
        </Link>

        <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-bold text-white mb-8 leading-tight">
          {article.title}
        </h1>

        <div className="text-rest-text-secondary text-base">
          <Markdown body={article.body} />
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-white/[0.03] ring-1 ring-white/10 text-rest-text-muted text-sm leading-relaxed">
          Este contenido tiene fines educativos y no reemplaza la evaluación ni el
          tratamiento de un profesional de salud. Puedes revisar{" "}
          <Link href="/evidencia" className="text-rest-accent hover:underline">
            cómo clasificamos la evidencia
          </Link>{" "}
          detrás de cada afirmación.
        </div>

        {/* CTA secundario al test */}
        <div className="mt-6 p-6 rounded-2xl bg-white/[0.03] ring-1 ring-white/10">
          <p className="text-rest-text-secondary text-base leading-relaxed mb-4">
            ¿Quieres saber cómo estás durmiendo? Responde la evaluación gratuita de
            sueño y estrés.
          </p>
          <Link
            href="/test-sueno"
            className="inline-flex items-center justify-center rounded-full bg-rest-accent px-6 py-3 text-sm font-semibold text-rest-bg hover:opacity-90 transition"
          >
            Hacer la evaluación
          </Link>
        </div>

        {/* Enlace a la pilar */}
        <p className="mt-6 text-rest-text-secondary text-sm">
          Este artículo forma parte de la guía{" "}
          <Link href="/sueno-y-estres" className="text-rest-accent hover:underline">
            Insomnio por estrés
          </Link>
          .
        </p>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-white/10">
            <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white mb-4">
              Artículos relacionados
            </h2>
            <ul className="space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="text-rest-accent hover:underline font-medium"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 flex items-center gap-3 text-sm">
          <span className="text-rest-text-muted">Escrito por</span>
          <Link href="/sobre-mi" className="text-rest-accent hover:underline font-medium">
            Joaquín Adi — Kinesiólogo y Osteópata
          </Link>
        </div>
      </article>
    </div>
  );
}
