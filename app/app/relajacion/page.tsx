"use client";

import Link from "next/link";

const techniques = [
  {
    title: "Respiración 4-7-8",
    category: "Antes de dormir",
    time: "5-10 min",
    desc: "La exhalación prolongada favorece la activación parasimpática, enviando señales de calma al cerebro para salir del modo supervivencia.",
    steps: ["Inhala por nariz (4s)", "Mantén (7s)", "Exhala por nariz (8s)", "Repite 5-10 min"],
    link: "/app/respiraciones",
    gradient: "from-rest-accent to-emerald-400",
  },
  {
    title: "Respiración Diafragmática",
    category: "Coherencia cardíaca",
    time: "5-10 min",
    desc: "Entrena a tu cuerpo para salir del modo alerta. Una mano en pecho, otra en abdomen. El abdomen se infla, el pecho se mueve mínimo.",
    steps: ["Inhala inflando abdomen (5s)", "Exhala desinflando (5s)", "Mantén 5-10 min"],
    link: "/app/respiraciones",
    gradient: "from-rest-accent to-emerald-400",
  },
  {
    title: "Exhalación 2x",
    category: "Si te despiertas en la noche",
    time: "3-5 min",
    desc: "Toma el doble de tiempo para exhalar que para inhalar. Esta técnica activa rápidamente el nervio vago cuando te despiertas.",
    steps: ["Inhala (4s)", "Exhala lentamente (8s)", "Repite hasta sentir calma"],
    link: null,
    gradient: "from-rest-accent to-emerald-400",
  },
];

const nightKit: { step: string; text: string; icon?: string; iconSrc?: string }[] = [
  { step: "1", text: "No mires la hora, solo busca volver a dormir", icon: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" },
  { step: "2", text: "Haz respiración Exhalación 2x: inhala 4s, exhala 8s", iconSrc: "/icons/respiraciones.svg" },
  { step: "3", text: "Baja la temperatura de la habitación o date una ducha tibia", icon: "M12 2a2 2 0 00-2 2v9.17a4 4 0 104 0V4a2 2 0 00-2-2zm0 16a2 2 0 100-4 2 2 0 000 4z" },
  { step: "4", text: "Si nada funciona, cambia de lugar para dormir", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
];

const alertSigns = [
  "Mente acelerada al acostarse",
  "Tensión muscular persistente",
  "Palpitaciones nocturnas",
  "Sensación de no desconectar",
  "Despertares con ansiedad",
];

export default function RelajacionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Ejercicios de relajación</h1>
        <p className="text-rest-text-muted mt-1">Técnicas para activar tu sistema nervioso parasimpático</p>
      </div>

      {/* Alert signs */}
      <div className="p-6 rounded-2xl glass-card">
        <h2 className="font-semibold text-lg mb-1 text-white">¿Tu sistema nervioso está hiperactivo?</h2>
        <p className="text-rest-text-muted text-xs mb-4">Signos comunes de hiperactividad simpática:</p>
        <div className="flex flex-wrap gap-2">
          {alertSigns.map((sign, i) => (
            <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-[#1a1a0e] shadow-[0_1px_4px_rgba(0,0,0,0.2)] text-rest-warning">
              {sign}
            </span>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/10 to-rest-accent/5">
        <p className="text-sm text-rest-text-secondary leading-relaxed">
          <span className="font-medium text-rest-text">Tu sistema nervioso no se calma con fuerza de voluntad.</span>{" "}
          Se calma con señales físicas, químicas y ambientales de seguridad. Estas técnicas bajan el cortisol,
          normalizan la frecuencia cardíaca y reducen la inflamación.
        </p>
      </div>

      {/* Techniques */}
      <div>
        <h2 className="font-semibold mb-4 text-white">Técnicas de respiración</h2>
        <div className="space-y-4">
          {techniques.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl glass-card">
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center`}>
                  <div
                    className="w-9 h-9"
                    style={{
                      backgroundColor: "white",
                      WebkitMaskImage: "url(/icons/respiraciones.svg)",
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskImage: "url(/icons/respiraciones.svg)",
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-white">{t.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-rest-accent/10 text-rest-accent font-medium">{t.category}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-black/20 text-rest-text-muted">{t.time}</span>
                  </div>
                  <p className="text-rest-text-secondary text-sm mb-3">{t.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {t.steps.map((s, j) => (
                      <span key={j} className="text-xs px-3 py-1.5 rounded-lg bg-[#0a1e1e] shadow-[0_1px_4px_rgba(0,0,0,0.15)] text-rest-text-secondary">
                        {s}
                      </span>
                    ))}
                  </div>
                  {t.link && (
                    <Link href={t.link} className="inline-flex items-center gap-1 text-rest-accent text-sm font-medium hover:underline">
                      Practicar con temporizador
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Night wake-up kit */}
      <div className="p-6 rounded-2xl glass-card">
        <h2 className="font-semibold text-lg mb-1 text-white">Si te despiertas en la noche</h2>
        <p className="text-rest-text-muted text-xs mb-2">Recuerda estos principios (están en tu ebook, no mires el teléfono de noche):</p>
        <div className="space-y-4">
          {nightKit.map((k, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-rest-accent/10 flex items-center justify-center">
                {k.iconSrc ? (
                  <div
                    className="w-7 h-7"
                    style={{
                      backgroundColor: "currentColor",
                      WebkitMaskImage: `url(${k.iconSrc})`,
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskImage: `url(${k.iconSrc})`,
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                    }}
                  />
                ) : (
                  <svg className="w-5 h-5 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={k.icon} />
                  </svg>
                )}
              </div>
              <div className="flex-1 pt-2">
                <p className="text-sm text-rest-text-secondary">{k.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environment tips */}
      <div className="p-6 rounded-2xl glass-card">
        <h2 className="font-semibold text-lg mb-4 text-white">Señales ambientales de calma</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { title: "Temperatura", desc: "Habitación fresca (18-20°C). Tu cuerpo necesita bajar la temperatura central." },
            { title: "Oscuridad", desc: "Lo más oscuro posible. Usa antifaz si es necesario. Led apagados." },
            { title: "Ruido", desc: "Silencio o ruido blanco constante. Evita notificaciones." },
            { title: "Luz nocturna", desc: "Si necesitas levantarte: luz roja/ámbar mínima." },
          ].map((tip, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#0a1e1e] shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
              <h4 className="font-semibold text-sm mb-1 text-white">{tip.title}</h4>
              <p className="text-rest-text-muted text-[11px] leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
