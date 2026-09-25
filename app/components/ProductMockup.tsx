// Mockup SVG a medida del Método R.E.S.T.: portada del ebook al frente y un
// teléfono detrás mostrando la app/dashboard. Sin dependencias, con la paleta
// del sitio (verde #00E5A0 sobre oscuro). Sombras y perspectiva simuladas.

export default function ProductMockup({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label="El Método R.E.S.T.: ebook y aplicación de acompañamiento diario"
    >
      <defs>
        <linearGradient id="mk-book" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d2f28" />
          <stop offset="1" stopColor="#071d18" />
        </linearGradient>
        <linearGradient id="mk-phone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1512" />
          <stop offset="1" stopColor="#050d0b" />
        </linearGradient>
        <linearGradient id="mk-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#00B880" />
          <stop offset="0.5" stopColor="#00E5A0" />
          <stop offset="1" stopColor="#33FFBB" />
        </linearGradient>
        <radialGradient id="mk-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#00E5A0" stopOpacity="0.22" />
          <stop offset="1" stopColor="#00E5A0" stopOpacity="0" />
        </radialGradient>
        <filter id="mk-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000000" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* halo */}
      <ellipse cx="200" cy="160" rx="180" ry="120" fill="url(#mk-glow)" />

      {/* ---- Teléfono (detrás, a la derecha, con la app) ---- */}
      <g filter="url(#mk-shadow)" transform="rotate(8 300 150)">
        <rect x="256" y="58" width="92" height="192" rx="18" fill="url(#mk-phone)" stroke="#12332b" strokeWidth="1.5" />
        <rect x="264" y="72" width="76" height="164" rx="10" fill="#06110e" />
        {/* notch */}
        <rect x="288" y="78" width="26" height="5" rx="2.5" fill="#12332b" />
        {/* barra superior app */}
        <text x="302" y="102" fill="#00E5A0" fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="var(--font-space), sans-serif">DÍA 7 / 21</text>
        {/* anillo de progreso */}
        <circle cx="302" cy="138" r="20" fill="none" stroke="#12332b" strokeWidth="5" />
        <circle cx="302" cy="138" r="20" fill="none" stroke="url(#mk-accent)" strokeWidth="5" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset="84" transform="rotate(-90 302 138)" />
        <text x="302" y="142" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">33%</text>
        {/* checklist */}
        <g>
          <circle cx="272" cy="174" r="3.5" fill="#00E5A0" />
          <rect x="280" y="171.5" width="50" height="5" rx="2.5" fill="#1a3d34" />
          <circle cx="272" cy="190" r="3.5" fill="#00E5A0" />
          <rect x="280" y="187.5" width="44" height="5" rx="2.5" fill="#1a3d34" />
          <circle cx="272" cy="206" r="3.5" fill="none" stroke="#33463f" strokeWidth="1.5" />
          <rect x="280" y="203.5" width="46" height="5" rx="2.5" fill="#12241f" />
          <circle cx="272" cy="222" r="3.5" fill="none" stroke="#33463f" strokeWidth="1.5" />
          <rect x="280" y="219.5" width="38" height="5" rx="2.5" fill="#12241f" />
        </g>
      </g>

      {/* ---- Ebook (al frente, izquierda) ---- */}
      <g filter="url(#mk-shadow)" transform="rotate(-5 140 158)">
        {/* canto del libro */}
        <path d="M92,72 L96,68 L96,240 L92,244 Z" fill="#04120f" />
        {/* portada */}
        <rect x="96" y="68" width="132" height="176" rx="6" fill="url(#mk-book)" stroke="#1a3d34" strokeWidth="1" />
        {/* brillo diagonal */}
        <path d="M96,68 L150,68 L110,244 L96,244 Z" fill="#ffffff" opacity="0.03" />
        {/* marca */}
        <text x="162" y="120" fill="#8fa39d" fontSize="7" fontWeight="600" letterSpacing="3" textAnchor="middle" fontFamily="var(--font-space), sans-serif">MÉTODO</text>
        <text x="162" y="150" fill="#ffffff" fontSize="26" fontWeight="800" letterSpacing="4" textAnchor="middle" fontFamily="var(--font-space), sans-serif">R.E.S.T.</text>
        <rect x="132" y="164" width="60" height="2" rx="1" fill="url(#mk-accent)" />
        <text x="162" y="188" fill="#9BAABD" fontSize="7.5" textAnchor="middle">Protocolo de 21 días</text>
        <text x="162" y="200" fill="#9BAABD" fontSize="7.5" textAnchor="middle">para dormir mejor</text>
        {/* onda decorativa */}
        <path d="M116,224 C132,214 148,234 162,224 C176,214 192,234 208,224" fill="none" stroke="#00E5A0" strokeWidth="1.5" opacity="0.55" />
      </g>
    </svg>
  );
}
