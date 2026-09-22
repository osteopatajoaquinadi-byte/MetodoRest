import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cómo clasificamos la evidencia",
  description:
    "Usamos tres niveles de evidencia en todo nuestro contenido: firme, mecanicista y debatido. Aquí explicamos qué significa cada uno.",
  alternates: { canonical: "/evidencia" },
};

const niveles = [
  {
    tag: "EVIDENCIA FIRME",
    color: "text-rest-accent",
    ring: "ring-rest-accent/30",
    desc: "Respaldado por revisiones sistemáticas, metaanálisis o ensayos clínicos replicados. Cuando algo aparece marcado así, hay un cuerpo de estudios que apunta en la misma dirección.",
  },
  {
    tag: "RAZONAMIENTO MECANICISTA",
    color: "text-white",
    ring: "ring-white/20",
    desc: "Coherencia fisiológica: se deduce de lo que sabemos sobre cómo funciona el cuerpo, pero todavía no hay ensayos clínicos directos que lo confirmen. Es plausible, no probado.",
  },
  {
    tag: "DEBATIDO",
    color: "text-rest-text-muted",
    ring: "ring-white/10",
    desc: "Resultados contradictorios, estudios pequeños, o áreas donde la comunidad científica no tiene consenso. Lo mostramos igual, pero diciendo con claridad que no está zanjado.",
  },
];

export default function EvidenciaPage() {
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

        <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-bold text-white mb-4">
          Cómo clasificamos la evidencia
        </h1>
        <p className="text-rest-text-secondary text-base leading-relaxed mb-10">
          La mayoría del contenido de salud en internet no te dice cuándo lo que
          afirma está bien respaldado y cuándo es una hipótesis razonable. Aquí sí.
          En todo nuestro contenido marcamos cada afirmación relevante con uno de
          tres niveles, para que sepas con qué firmeza está sostenida.
        </p>

        <div className="space-y-5 mb-12">
          {niveles.map((n) => (
            <div
              key={n.tag}
              className={`p-6 rounded-2xl bg-white/[0.03] ring-1 ${n.ring}`}
            >
              <span
                className={`inline-block font-[family-name:var(--font-space)] text-xs font-semibold tracking-[0.15em] uppercase mb-3 ${n.color}`}
              >
                [{n.tag}]
              </span>
              <p className="text-rest-text-secondary text-base leading-relaxed">
                {n.desc}
              </p>
            </div>
          ))}
        </div>

        <section className="text-rest-text-secondary text-base leading-relaxed space-y-4">
          <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white">
            Por qué lo hacemos así
          </h2>
          <p>
            Distinguir estos niveles no es un adorno académico: es lo que te
            permite decidir con la cabeza fría. No todo lo que ayuda a dormir tiene
            el mismo grado de respaldo, y esconderlo sería tratarte como alguien
            que no puede con el matiz. Preferimos mostrarte el mapa completo.
          </p>
          <p>
            Si quieres ver esto aplicado, la{" "}
            <Link href="/sueno-y-estres" className="link-inline">
              guía sobre insomnio por estrés
            </Link>{" "}
            usa esta clasificación a lo largo de todo el texto.
          </p>
        </section>
      </div>
    </div>
  );
}
