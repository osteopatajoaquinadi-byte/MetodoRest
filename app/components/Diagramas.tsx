// Diagramas SVG a medida para el contenido de sueño.
// Sin dependencias, theme-aware con la paleta del sitio (verde #00E5A0 sobre
// fondo oscuro). Cada uno se usa donde el concepto es visual.

const ACCENT = "var(--color-rest-accent, #00E5A0)";
const MUTED = "var(--color-rest-text-muted, #506070)";
const TEXT = "var(--color-rest-text-secondary, #9BAABD)";

function Figure({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: string;
}) {
  return (
    <figure className="my-8">
      <div className="rounded-2xl bg-white/[0.03] ring-1 ring-white/10 p-4 sm:p-6">
        {children}
      </div>
      <figcaption className="text-rest-text-muted text-xs mt-3 text-center leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}

/* 1. Ritmo del cortisol durante la noche: normal vs. con despertar de madrugada */
export function CortisolNocturno() {
  return (
    <Figure caption="Ritmo del cortisol durante la noche. En verde, el patrón esperado: bajo al inicio del sueño y subiendo hacia el amanecer. Punteado, el pico adelantado que puede coincidir con el despertar de madrugada.">
      <svg viewBox="0 0 400 200" className="w-full h-auto" role="img" aria-label="Gráfico del ritmo de cortisol nocturno">
        {/* ejes */}
        <line x1="40" y1="170" x2="380" y2="170" stroke={MUTED} strokeWidth="1" />
        <line x1="40" y1="20" x2="40" y2="170" stroke={MUTED} strokeWidth="1" />
        {/* etiquetas horas */}
        <text x="40" y="188" fill={TEXT} fontSize="10" textAnchor="middle">23h</text>
        <text x="150" y="188" fill={TEXT} fontSize="10" textAnchor="middle">2h</text>
        <text x="260" y="188" fill={TEXT} fontSize="10" textAnchor="middle">4h</text>
        <text x="370" y="188" fill={TEXT} fontSize="10" textAnchor="middle">7h</text>
        <text x="20" y="30" fill={TEXT} fontSize="10" textAnchor="middle">cortisol</text>
        {/* curva normal */}
        <path
          d="M40,155 C110,150 130,140 180,120 C240,96 300,55 380,35"
          fill="none"
          stroke={ACCENT}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* curva con pico adelantado */}
        <path
          d="M40,150 C100,150 120,120 170,80 C200,58 220,70 260,95 C300,120 330,70 380,45"
          fill="none"
          stroke={MUTED}
          strokeWidth="2"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />
        {/* marca del pico madrugada */}
        <circle cx="170" cy="80" r="3.5" fill={ACCENT} />
        <text x="170" y="70" fill={TEXT} fontSize="9" textAnchor="middle">pico 3–4h</text>
      </svg>
    </Figure>
  );
}

/* 2. Balance simpático / parasimpático: la balanza del sistema nervioso */
export function BalanceAutonomico() {
  return (
    <Figure caption="El sistema nervioso autónomo en equilibrio. Para dormir, la rama parasimpática (recuperación) necesita predominar sobre la simpática (activación). Bajo estrés sostenido, la balanza queda cargada hacia la activación.">
      <svg viewBox="0 0 400 180" className="w-full h-auto" role="img" aria-label="Balanza entre sistema simpático y parasimpático">
        {/* fulcro */}
        <path d="M195,150 L205,150 L200,120 Z" fill={MUTED} />
        <line x1="150" y1="130" x2="250" y2="110" stroke={TEXT} strokeWidth="2" strokeLinecap="round" />
        {/* platillo izquierdo (simpático, cargado) */}
        <line x1="150" y1="130" x2="150" y2="145" stroke={MUTED} strokeWidth="1" />
        <ellipse cx="150" cy="148" rx="34" ry="6" fill={MUTED} opacity="0.5" />
        <text x="150" y="172" fill={TEXT} fontSize="11" textAnchor="middle" fontWeight="600">Simpático</text>
        <text x="150" y="120" fill={TEXT} fontSize="9" textAnchor="middle">activación</text>
        {/* platillo derecho (parasimpático, arriba) */}
        <line x1="250" y1="110" x2="250" y2="125" stroke={MUTED} strokeWidth="1" />
        <ellipse cx="250" cy="128" rx="34" ry="6" fill={ACCENT} opacity="0.35" />
        <text x="250" y="152" fill={ACCENT} fontSize="11" textAnchor="middle" fontWeight="600">Parasimpático</text>
        <text x="250" y="100" fill={TEXT} fontSize="9" textAnchor="middle">recuperación</text>
      </svg>
    </Figure>
  );
}

/* 3. Arquitectura del sueño (hipnograma simplificado) */
export function ArquitecturaSueno() {
  // niveles: 0 vigilia, 1 REM, 2 ligero, 3 profundo (más abajo = más profundo)
  const y = { vigilia: 30, rem: 60, ligero: 95, profundo: 135 };
  const pts = [
    [40, y.vigilia], [55, y.ligero], [80, y.profundo], [110, y.profundo],
    [130, y.ligero], [150, y.rem], [170, y.ligero], [195, y.profundo],
    [220, y.ligero], [245, y.rem], [270, y.ligero], [300, y.rem],
    [330, y.ligero], [360, y.rem], [380, y.vigilia],
  ];
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  return (
    <Figure caption="Arquitectura de una noche de sueño. El sueño profundo (ondas lentas) predomina en la primera mitad; el REM y las fases ligeras, en la segunda. Por eso de madrugada el sueño es más frágil.">
      <svg viewBox="0 0 400 170" className="w-full h-auto" role="img" aria-label="Hipnograma de las fases del sueño">
        {/* líneas guía por fase */}
        {Object.entries(y).map(([k, val]) => (
          <g key={k}>
            <line x1="70" y1={val} x2="385" y2={val} stroke={MUTED} strokeWidth="0.5" opacity="0.4" />
            <text x="66" y={val + 3} fill={TEXT} fontSize="9" textAnchor="end">
              {k === "vigilia" ? "Vigilia" : k === "rem" ? "REM" : k === "ligero" ? "Ligero" : "Profundo"}
            </text>
          </g>
        ))}
        <path d={d} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <text x="55" y="160" fill={TEXT} fontSize="9">dormir</text>
        <text x="385" y="160" fill={TEXT} fontSize="9" textAnchor="end">despertar</text>
      </svg>
    </Figure>
  );
}

/* 4. Los tres niveles de evidencia */
export function NivelesEvidencia() {
  const niveles = [
    { tag: "EVIDENCIA FIRME", w: 100, color: ACCENT, op: 1 },
    { tag: "RAZONAMIENTO MECANICISTA", w: 70, color: TEXT, op: 0.8 },
    { tag: "DEBATIDO", w: 42, color: MUTED, op: 0.9 },
  ];
  return (
    <Figure caption="Cómo clasificamos cada afirmación: de lo más respaldado por estudios a lo que todavía se debate.">
      <svg viewBox="0 0 400 150" className="w-full h-auto" role="img" aria-label="Los tres niveles de evidencia">
        {niveles.map((n, i) => {
          const yy = 20 + i * 42;
          return (
            <g key={n.tag}>
              <rect x="20" y={yy} width={n.w * 3.2} height="26" rx="6" fill={n.color} opacity={n.op * 0.25} />
              <rect x="20" y={yy} width="4" height="26" rx="2" fill={n.color} opacity={n.op} />
              <text x="34" y={yy + 17} fill={n.color} fontSize="11" fontWeight="600" fontFamily="var(--font-space)">
                {n.tag}
              </text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}
