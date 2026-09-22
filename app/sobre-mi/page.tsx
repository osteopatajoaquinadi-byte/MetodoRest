import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sobre mí — Joaquín Adi, Kinesiólogo y Osteópata",
  description:
    "Kinesiólogo, osteópata (D.O.) y MSc en PNI clínica. Director de Clínica Sakros en Viña del Mar, Chile.",
  alternates: { canonical: "/sobre-mi" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Joaquín Adi",
  jobTitle: "Kinesiólogo y Osteópata",
  description:
    "Director de Clínica Sakros. D.O., MSc en Psiconeuroinmunología Clínica.",
  url: "https://metodorest.cl/sobre-mi",
  worksFor: {
    "@type": "Organization",
    name: "Clínica Sakros",
    url: "https://www.clinicasakros.cl",
  },
};

export default function SobreMiPage() {
  return (
    <div className="min-h-screen bg-rest-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
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

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 ring-1 ring-white/10">
            <Image
              src="/autor-bg.png"
              alt="Joaquín Adi, kinesiólogo y osteópata, director de Clínica Sakros"
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-bold text-white mb-2">
              Joaquín Adi — Kinesiólogo y Osteópata
            </h1>
            <p className="text-rest-accent text-sm font-medium">
              D.O. · MSc en Psiconeuroinmunología Clínica · Director de Clínica Sakros
            </p>
          </div>
        </div>

        <div className="space-y-8 text-rest-text-secondary text-base leading-relaxed">
          <section>
            <p>
              Soy kinesiólogo y osteópata (D.O.), con un máster en
              Psiconeuroinmunología Clínica (MSc PNIc). Dirijo{" "}
              <a
                href="https://www.clinicasakros.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="link-inline"
              >
                Clínica Sakros
              </a>
              , en Viña del Mar, Chile, donde atiendo a pacientes y formo a otros
              profesionales de la salud.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white mb-3">
              Cómo trabajo el sueño
            </h2>
            <p>
              Mi enfoque integra osteopatía, kinesiología y psiconeuroinmunología
              clínica, con foco en la regulación del sistema nervioso autónomo, la
              variabilidad de la frecuencia cardíaca (HRV) y el eje del estrés. El
              Método R.E.S.T. nace de ese cruce: un protocolo de 21 días para
              dormir mejor construido sobre fisiología del sueño y regulación del
              estrés, no sobre promesas.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white mb-3">
              Transparencia sobre la evidencia
            </h2>
            <p>
              En todo el contenido distingo con claridad cuándo una afirmación se
              apoya en evidencia firme, cuándo es razonamiento fisiológico y cuándo
              es un punto todavía debatido. Puedes revisar{" "}
              <Link href="/evidencia" className="link-inline">
                cómo clasifico la evidencia
              </Link>{" "}
              y, si quieres empezar por conocer tu propio perfil de sueño,
              responder la{" "}
              <Link href="/test-sueno" className="link-inline">
                evaluación gratuita
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
