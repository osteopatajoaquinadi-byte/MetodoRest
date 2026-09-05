"use client";

const HOTMART_COMPLETO = "https://pay.hotmart.com/L105253165X";

const SECCION_INFO: Record<string, { titulo: string; desc: string }> = {
  "/app/respiraciones": { titulo: "Respiraciones guiadas", desc: "Técnicas de respiración 4-7-8 y diafragmática con guía paso a paso para calmar tu sistema nervioso en minutos." },
  "/app/relajacion-progresiva": { titulo: "Relajación progresiva", desc: "Sesiones de relajación muscular guiada para soltar la tensión del día antes de dormir." },
  "/app/relajacion": { titulo: "Relajación", desc: "Herramientas de relajación para preparar tu cuerpo y tu mente para el descanso." },
  "/app/nutricion": { titulo: "Plan nutricional nocturno", desc: "Qué cenar y qué evitar para no sabotear tu sueño, con recetas y guía completa." },
  "/app/plan-21-dias": { titulo: "Plan de 21 días", desc: "El plan completo dividido en pasos simples, con checklist diaria y seguimiento de tu progreso." },
  "/app/mide-tu-sueno": { titulo: "Mide tu sueño", desc: "Evalúa tu sistema nervioso con RESET-Q y SSS, y mira cómo mejora tu descanso semana a semana." },
  "/app/ritual": { titulo: "Ritual de cierre", desc: "Tu rutina nocturna guiada para cerrar el día y preparar un sueño reparador." },
  "/app/diario": { titulo: "Diario de sueño", desc: "Registra tu sueño cada día y descubre patrones que puedes mejorar." },
};

export default function BloqueoPremium({ pathname }: { pathname: string }) {
  const info = SECCION_INFO[pathname] || { titulo: "Método completo", desc: "Esta sección es parte del Método R.E.S.T. completo." };

  return (
    <div className="max-w-lg mx-auto pt-8">
      <div className="p-8 rounded-3xl glass-card text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rest-accent/15 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span className="text-rest-accent text-xs font-medium tracking-widest uppercase">Parte del método completo</span>
        <h1 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white mt-3 mb-3">{info.titulo}</h1>
        <p className="text-rest-text-secondary text-sm leading-relaxed mb-6">{info.desc}</p>

        <div className="p-4 rounded-xl bg-rest-bg mb-6 text-left">
          <p className="text-rest-text-secondary text-sm leading-relaxed">
            Tienes acceso al <span className="text-white font-medium">ebook del Método R.E.S.T.</span> Para desbloquear las respiraciones guiadas, el plan de 21 días, la nutrición nocturna y el seguimiento de tu sueño, accede al método completo.
          </p>
        </div>

        <a href={HOTMART_COMPLETO} target="_blank" rel="noopener noreferrer"
          className="block w-full py-3.5 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] hover:shadow-[0_0_24px_rgba(0,229,160,0.5)]">
          Desbloquear el método completo
        </a>
        <p className="text-rest-text-muted text-[11px] mt-4">
          Pago seguro a través de Hotmart · Acceso inmediato · 7 días de garantía
        </p>
      </div>
    </div>
  );
}
