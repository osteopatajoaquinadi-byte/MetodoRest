export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-[#040f0f] via-[#0a2e2e] to-[#0d3838]" />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5A0" stopOpacity="0" />
            <stop offset="30%" stopColor="#00E5A0" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#00CED1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00E5E5" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00E5E5" stopOpacity="0" />
            <stop offset="20%" stopColor="#00CED1" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#00E5A0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00E5A0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5A0" stopOpacity="0" />
            <stop offset="40%" stopColor="#00DDB8" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#00E5E5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00CED1" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d="M 900 950 Q 1100 600, 1500 450" stroke="url(#lineGrad1)" strokeWidth="2" opacity="0.7" />
        <path d="M 900 950 Q 1100 600, 1500 450" stroke="#00E5D0" strokeWidth="0.8" opacity="0.5" />
        <path d="M -50 -50 Q 300 200, 600 700 Q 750 900, 850 950" stroke="url(#lineGrad2)" strokeWidth="2" opacity="0.6" />
        <path d="M -50 -50 Q 300 200, 600 700 Q 750 900, 850 950" stroke="#00E5D0" strokeWidth="0.6" opacity="0.4" />
        <path d="M 800 -50 Q 950 150, 1100 300 Q 1300 500, 1500 520" stroke="url(#lineGrad1)" strokeWidth="1.5" opacity="0.5" />
        <path d="M -100 400 Q 400 200, 800 350 Q 1200 500, 1550 300" stroke="url(#lineGrad3)" strokeWidth="2" opacity="0.5" />
        <path d="M -100 400 Q 400 200, 800 350 Q 1200 500, 1550 300" stroke="#00DDB8" strokeWidth="0.5" opacity="0.4" />
        <path d="M 200 -50 Q 350 100, 400 350" stroke="url(#lineGrad2)" strokeWidth="1.5" opacity="0.4" />
      </svg>

      <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,229,160,0.04) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,206,209,0.05) 0%, transparent 70%)" }} />
    </div>
  );
}
