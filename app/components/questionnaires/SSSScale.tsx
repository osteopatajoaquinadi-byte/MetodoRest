"use client";

import { useState } from "react";

const options = [
  "Me siento activo, vital, alerta; totalmente despierto",
  "Funcionando a buen nivel, pero no al máximo; algo cansado",
  "Alerta, pero relajado; no totalmente despierto",
  "Algo somnoliento, pero sin dificultad para permanecer despierto",
  "Somnoliento; prefiero estar acostado",
  "Somnoliento; luchando por permanecer despierto",
  "Casi dormido; el sueño es inminente",
];

interface Props {
  onComplete: (score: number) => void;
  showResult?: boolean;
}

export default function SSSScale({ onComplete, showResult = true }: Props) {
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    setScore(value);
    onComplete(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-lg mb-1 text-white">Stanford Sleepiness Scale (SSS)</h2>
        <p className="text-rest-text-muted text-xs mb-6">Somnolencia en el momento actual — aplícalo 10 min después de despertar</p>
      </div>

      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i + 1)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
              score === i + 1
                ? "bg-rest-accent/15 shadow-[0_0_10px_rgba(0,229,160,0.2),0_2px_6px_rgba(0,0,0,0.3)]"
                : "bg-white/[0.05] hover:bg-white/[0.1] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
            }`}
          >
            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              score === i + 1 ? "bg-rest-accent text-rest-bg" : "bg-white/[0.08] text-rest-text-secondary"
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm ${score === i + 1 ? "text-rest-text" : "text-rest-text-secondary"}`}>{opt}</span>
          </button>
        ))}
      </div>

      {showResult && score && (
        <div className={`mt-6 p-4 rounded-xl ${
          score >= 5 ? "bg-rest-danger/10" : score >= 4 ? "bg-rest-warning/10" : "bg-rest-accent/10"
        }`}>
          <p className="font-medium text-sm">
            Puntuación: {score}/7 —{" "}
            <span className={score >= 5 ? "text-rest-danger" : score >= 4 ? "text-rest-warning" : "text-rest-accent"}>
              {score >= 5 ? "Somnolencia significativa" : score >= 4 ? "Somnolencia clínicamente relevante" : "Nivel normal"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
