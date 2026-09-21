import type { Metadata } from "next";
import Link from "next/link";
import EvaluacionLanding from "../components/EvaluacionLanding";

export const metadata: Metadata = {
  title: "¿Cómo estás durmiendo? — Evaluación gratuita",
  description:
    "Responde 21 preguntas sobre tu sueño y estrés. Herramienta gratuita basada en el cuestionario RESET-Q.",
  alternates: { canonical: "/test-sueno" },
};

export default function TestSuenoPage() {
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
          ¿Cómo estás durmiendo?
        </h1>
        <p className="text-rest-text-secondary text-base leading-relaxed mb-3">
          Responde 21 preguntas para conocer tu perfil de sueño y estrés.
        </p>
        <p className="text-rest-text-muted text-sm mb-10">
          Este cuestionario es un screener orientativo, no un diagnóstico clínico.
          Puedes revisar{" "}
          <Link href="/evidencia" className="text-rest-accent hover:underline">
            cómo clasificamos la evidencia
          </Link>{" "}
          detrás de cada interpretación.
        </p>

        <EvaluacionLanding />

        <div className="mt-12 p-6 rounded-2xl bg-white/[0.03] ring-1 ring-white/10 text-center">
          <p className="text-rest-text-secondary text-base leading-relaxed mb-4">
            ¿Quieres pasar de conocer tu perfil a hacer algo con él? El Método
            R.E.S.T. es un protocolo de 21 días para dormir mejor, basado en
            fisiología del sueño y regulación del estrés.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-rest-accent px-6 py-3 text-sm font-semibold text-rest-bg hover:opacity-90 transition"
          >
            Conocer el Método R.E.S.T.
          </Link>
        </div>
      </div>
    </div>
  );
}
