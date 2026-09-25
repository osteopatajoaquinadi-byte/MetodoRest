"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Qué es el Método R.E.S.T.?",
    a: "Es un protocolo de 21 días para dormir mejor, basado en fisiología del sueño y regulación del estrés. Fue creado por Joaquín Adi, kinesiólogo y osteópata (D.O., MSc en Psiconeuroinmunología Clínica), y trabaja sobre las vías que regulan el sueño en lugar de forzarlo.",
  },
  {
    q: "¿En cuánto tiempo se ven resultados?",
    a: "No es un proceso lineal. Siendo constante con los estímulos, muchas personas empiezan a notar sensaciones diferentes desde el día 7, sobre todo cuando el problema principal es circadiano. A lo largo de los 21 días se van incorporando más estímulos de regulación en el resto de los pilares. Los tiempos varían según cada persona.",
  },
  {
    q: "¿Sirve si tomo medicación para dormir?",
    a: "El Método R.E.S.T. es material educativo y no reemplaza la indicación de tu médico. No suspendas ni modifiques ninguna medicación para dormir sin consultar antes con el profesional que te la indicó. Si tienes un trastorno del sueño diagnosticado, consúltalo con tu médico.",
  },
  {
    q: "¿Necesito conocimientos previos o algún equipo especial?",
    a: "No. El protocolo está diseñado para seguirse paso a paso, sin conocimientos previos ni equipamiento especial. Solo necesitas seguir los estímulos diarios de forma constante.",
  },
  {
    q: "¿Tiene garantía?",
    a: "Sí. El método completo incluye una garantía de 7 días.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="relative py-20 sm:py-28 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">
            Preguntas frecuentes
          </span>
          <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">
            Antes de <span className="text-gradient-green">empezar</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-2xl bg-white/[0.03] ring-1 ring-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  aria-expanded={isOpen}
                >
                  <span className="font-[family-name:var(--font-space)] text-base sm:text-lg font-medium text-white">
                    {f.q}
                  </span>
                  <svg
                    className={`w-5 h-5 shrink-0 text-rest-accent transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                {isOpen && (
                  <p className="px-6 pb-5 -mt-1 text-rest-text-secondary text-sm sm:text-base leading-relaxed">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
