"use client";

import { useState } from "react";

const LIKERT_OPTIONS = [
  { value: 0, label: "Nunca" },
  { value: 1, label: "Rara vez" },
  { value: 2, label: "A veces" },
  { value: 3, label: "Frecuente" },
  { value: 4, label: "Siempre" },
];

const DOMAINS = {
  H: {
    label: "Hiperactivación cognitivo-simpática",
    items: [
      "Al acostarme, mi mente sigue trabajando aunque mi cuerpo esté cansado.",
      "Si me despierto en la madrugada, empiezo a pensar y no puedo volver a dormir con facilidad.",
      "Después de un día intenso necesito más de 30 minutos para que mi cuerpo se \"apague\".",
      "Aunque duerma horas suficientes, me despierto sintiendo que no descansé.",
    ],
  },
  A: {
    label: "Autonómico somático",
    items: [
      "Noto tensión persistente en mandíbula, cuello u hombros al despertar.",
      "Tengo palpitaciones, opresión torácica o sensación de falta de aire sin causa aparente.",
      "Al levantarme rápido siento mareo, aturdimiento o visión borrosa breve.",
      "Mis manos o pies están frecuentemente fríos, incluso en ambientes templados.",
    ],
  },
  R: {
    label: "Ritmicidad y recuperación",
    items: [
      "Necesito cafeína o azúcar en las primeras dos horas del día para funcionar.",
      "Mi energía cae bruscamente entre las 14:00 y 16:00 hs.",
      "Después de un evento estresante tardo horas en volver a sentirme calmado.",
      "En fines de semana o vacaciones tiendo a enfermarme o sentir agotamiento profundo.",
    ],
  },
  I: {
    label: "Fenomenología del insomnio",
    items: [
      "Tardo más de 30 minutos en quedarme dormido/a.",
      "Me despierto múltiples veces durante la noche.",
      "Me despierto antes de lo que quisiera y no puedo volver a dormir.",
      "Al levantarme siento que el sueño no fue reparador.",
    ],
  },
};

const B_ITEMS = [
  "¿Roncas fuerte (audible desde otra habitación)?",
  "¿Alguien te dijo que dejas de respirar o haces pausas al dormir?",
  "¿Te despiertas con dolor de cabeza o boca extremadamente seca?",
  "¿Tienes hipertensión arterial diagnosticada o en tratamiento?",
  "Circunferencia de cuello mayor a 40 cm (mujer) / 43 cm (hombre).",
];

export interface ResetQScores {
  h: number[];
  a: number[];
  r: number[];
  i: number[];
  b: boolean[];
  scoreH: number;
  scoreA: number;
  scoreR: number;
  scoreI: number;
  scoreB: number;
  global: number;
  phenotype: string;
  band: string;
}

function computePhenotype(sH: number, sA: number, sR: number, sI: number, sB: number, g: number): string {
  if (sB >= 3) return "SAFETY";
  if (g <= 15) return "SR-5";
  if (sH >= 10 && sH >= sA && sH >= sR) return "SR-1";
  if (sA >= 10 && sA >= sH && sA >= sR) return "SR-2";
  if (sR >= 10) return "SR-3";
  if (sI <= 7 && g >= 24) return "SR-4";
  if (g >= 16) return "SR-3";
  return "SR-5";
}

function computeBand(g: number): string {
  if (g <= 15) return "Regulación preservada";
  if (g <= 29) return "Desregulación leve a moderada";
  if (g <= 45) return "Desregulación moderada a marcada";
  return "Desregulación marcada";
}

const PHENO_INFO: Record<string, { title: string; desc: string; color: string }> = {
  "SR-1": { title: "Hiperactivación cognitivo-simpática", desc: "Tu sistema nervioso se mantiene en alerta cuando debería descansar. Tu mente no se apaga al acostarte.", color: "text-amber-400" },
  "SR-2": { title: "Autonómico desregulado", desc: "Tu cuerpo muestra signos de baja modulación vagal: tensión, palpitaciones o frío periférico.", color: "text-orange-400" },
  "SR-3": { title: "Recuperación alterada", desc: "Tu ritmo energético diario está alterado y la recuperación post-estrés es lenta.", color: "text-purple-400" },
  "SR-4": { title: "Desregulación silente", desc: "Puntuación global elevada pero tu percepción del insomnio está preservada. El impacto puede estar en otros sistemas.", color: "text-cyan-400" },
  "SR-5": { title: "Regulación preservada", desc: "No aparecen indicadores relevantes de desregulación. Puedes optimizar lo que ya funciona.", color: "text-rest-accent" },
  SAFETY: { title: "Evaluación médica prioritaria", desc: "Tus respuestas sugieren posibles signos de trastorno respiratorio del sueño. Consulta con un médico antes de continuar.", color: "text-rest-danger" },
};

interface Props {
  onComplete: (scores: ResetQScores) => void;
  showResult?: boolean;
}

type Phase = "H" | "A" | "R" | "I" | "B" | "done";
const PHASES: Phase[] = ["H", "A", "R", "I", "B"];

export default function ResetQScale({ onComplete, showResult = true }: Props) {
  const [phase, setPhase] = useState<Phase>("H");
  const [hA, setHA] = useState<(number | null)[]>([null, null, null, null]);
  const [aA, setAA] = useState<(number | null)[]>([null, null, null, null]);
  const [rA, setRA] = useState<(number | null)[]>([null, null, null, null]);
  const [iA, setIA] = useState<(number | null)[]>([null, null, null, null]);
  const [bA, setBA] = useState<(boolean | null)[]>([null, null, null, null, null]);
  const [scores, setScores] = useState<ResetQScores | null>(null);

  const aMap: Record<string, (number | null)[]> = { H: hA, A: aA, R: rA, I: iA };
  const sMap: Record<string, (a: (number | null)[]) => void> = { H: setHA, A: setAA, R: setRA, I: setIA };
  const pi = PHASES.indexOf(phase);

  const setLikert = (d: string, idx: number, v: number) => {
    const c = [...aMap[d]]; c[idx] = v; sMap[d](c);
  };
  const setBool = (idx: number, v: boolean) => {
    const c = [...bA]; c[idx] = v; setBA(c);
  };
  const done = (p: Phase) => p === "B" ? bA.every((x) => x !== null) : (aMap[p]?.every((x) => x !== null) ?? false);

  const advance = () => {
    if (pi + 1 >= PHASES.length) { finalize(); return; }
    setPhase(PHASES[pi + 1]);
  };

  const finalize = () => {
    const h = hA as number[], a = aA as number[], r = rA as number[], i = iA as number[], b = bA as boolean[];
    const sH = h.reduce((s, v) => s + v, 0), sA = a.reduce((s, v) => s + v, 0);
    const sR = r.reduce((s, v) => s + v, 0), sI = i.reduce((s, v) => s + v, 0);
    const sB = b.filter(Boolean).length, g = sH + sA + sR + sI;
    const res: ResetQScores = { h, a, r, i, b, scoreH: sH, scoreA: sA, scoreR: sR, scoreI: sI, scoreB: sB, global: g, phenotype: computePhenotype(sH, sA, sR, sI, sB, g), band: computeBand(g) };
    setScores(res); setPhase("done"); onComplete(res);
  };

  const bc = (g: number) => g <= 15 ? "text-rest-accent" : g <= 29 ? "text-amber-400" : g <= 45 ? "text-orange-400" : "text-rest-danger";
  const bb = (g: number) => g <= 15 ? "bg-rest-accent" : g <= 29 ? "bg-amber-400" : g <= 45 ? "bg-orange-400" : "bg-rest-danger";

  if (phase !== "B" && phase !== "done") {
    const dom = DOMAINS[phase as keyof typeof DOMAINS];
    const ans = aMap[phase];
    return (
      <div className="space-y-4">
        <div>
          <span className="text-rest-accent text-[10px] font-medium tracking-widest uppercase">Dominio {phase} — {pi + 1}/{PHASES.length}</span>
          <h2 className="font-semibold text-lg mb-1 text-white mt-1">{dom.label}</h2>
          <p className="text-rest-text-muted text-xs">Responde según tu experiencia en las últimas 2 semanas</p>
          <div className="flex gap-1.5 mt-3">{PHASES.map((p, idx) => (
            <div key={p} className={`h-1.5 flex-1 rounded-full transition-all ${idx === pi ? "bg-rest-accent shadow-[0_0_6px_rgba(0,229,160,0.4)]" : idx < pi ? "bg-rest-accent/40" : "bg-white/10"}`} />
          ))}</div>
        </div>
        <div className="space-y-5 mt-4">{dom.items.map((q, idx) => (
          <div key={idx}>
            <p className="text-sm text-rest-text-secondary mb-2">{q}</p>
            <div className="flex gap-1.5">{LIKERT_OPTIONS.map((o) => (
              <button key={o.value} onClick={() => setLikert(phase, idx, o.value)} className={`flex-1 py-2 rounded-lg text-center transition ${ans[idx] === o.value ? "bg-rest-accent text-rest-bg font-bold shadow-[0_0_14px_rgba(0,229,160,0.4)] scale-105" : "bg-white/[0.05] text-rest-text-secondary hover:bg-white/[0.1] hover:text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"}`}>
                <span className="block text-sm font-medium">{o.value}</span>
                <span className="block text-[8px] leading-tight opacity-60 mt-0.5">{o.label}</span>
              </button>
            ))}</div>
          </div>
        ))}</div>
        <button onClick={advance} disabled={!done(phase)} className="w-full mt-4 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-30 disabled:cursor-not-allowed">
          {pi === PHASES.length - 2 ? "Siguiente — Señales respiratorias" : `Siguiente — Dominio ${PHASES[pi + 1]}`}
        </button>
      </div>
    );
  }

  if (phase === "B") {
    return (
      <div className="space-y-4">
        <div>
          <span className="text-rest-accent text-[10px] font-medium tracking-widest uppercase">Dominio B — {PHASES.length}/{PHASES.length}</span>
          <h2 className="font-semibold text-lg mb-1 text-white mt-1">Señales respiratorias</h2>
          <p className="text-rest-text-muted text-xs">Estas preguntas ayudan a detectar posibles trastornos respiratorios del sueño</p>
          <div className="flex gap-1.5 mt-3">{PHASES.map((p, idx) => (
            <div key={p} className={`h-1.5 flex-1 rounded-full transition-all ${idx === pi ? "bg-rest-accent shadow-[0_0_6px_rgba(0,229,160,0.4)]" : "bg-rest-accent/40"}`} />
          ))}</div>
        </div>
        <div className="space-y-3 mt-4">{B_ITEMS.map((q, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-rest-bg">
            <p className="text-sm text-rest-text-secondary mb-3">{q}</p>
            <div className="flex gap-3">
              <button onClick={() => setBool(idx, true)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${bA[idx] === true ? "bg-rest-danger/20 text-rest-danger shadow-[0_0_8px_rgba(239,68,68,0.2)]" : "bg-white/[0.05] text-rest-text-secondary hover:bg-white/[0.1] hover:text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"}`}>Sí</button>
              <button onClick={() => setBool(idx, false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${bA[idx] === false ? "bg-rest-accent/20 text-rest-accent shadow-[0_0_8px_rgba(0,229,160,0.2)]" : "bg-white/[0.05] text-rest-text-secondary hover:bg-white/[0.1] hover:text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"}`}>No</button>
            </div>
          </div>
        ))}</div>
        <button onClick={advance} disabled={!done("B")} className="w-full mt-4 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-30 disabled:cursor-not-allowed">Ver mis resultados</button>
      </div>
    );
  }

  if (phase === "done" && showResult && scores) {
    const ph = PHENO_INFO[scores.phenotype];
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="font-semibold text-xl text-white">Tu perfil RESET-Q</h2>
          <p className={`text-sm font-medium ${ph.color}`}>{ph.title}</p>
          <p className="text-rest-text-muted text-xs leading-relaxed max-w-md mx-auto">{ph.desc}</p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-rest-text-muted text-xs">Puntuación global</span>
            <span className={`font-bold ${bc(scores.global)}`}>{scores.global}/64</span>
          </div>
          <div className="w-full h-2 bg-rest-bg rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${bb(scores.global)}`} style={{ width: `${(scores.global / 64) * 100}%` }} />
          </div>
          <p className={`text-xs mt-2 ${bc(scores.global)}`}>{scores.band}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {([
            { k: "H", l: "Hiperactivación", s: scores.scoreH },
            { k: "A", l: "Autonómico", s: scores.scoreA },
            { k: "R", l: "Ritmicidad", s: scores.scoreR },
            { k: "I", l: "Insomnio", s: scores.scoreI },
          ]).map((d) => (
            <div key={d.k} className="p-3 rounded-xl bg-white/[0.03]">
              <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-1">{d.l}</p>
              <p className="text-lg font-bold text-white">{d.s}<span className="text-[10px] text-rest-text-muted">/16</span></p>
              <div className="w-full h-1 bg-rest-bg rounded-full mt-1.5">
                <div className={`h-full rounded-full ${d.s >= 11 ? "bg-rest-danger" : d.s >= 6 ? "bg-amber-400" : "bg-rest-accent"}`} style={{ width: `${(d.s / 16) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        {scores.phenotype === "SAFETY" && (
          <div className="p-4 rounded-xl bg-rest-danger/10 border border-rest-danger/20">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-rest-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              <p className="text-sm text-rest-text-secondary"><span className="font-semibold text-rest-danger">Derivación médica sugerida.</span> Tus respuestas indican posibles signos de apnea del sueño. Consulta con un profesional antes de iniciar cualquier protocolo.</p>
            </div>
          </div>
        )}
        <p className="text-rest-text-muted text-[10px] text-center leading-relaxed px-4">RESET-Q está en fase de validación. Los rangos son orientativos. No constituye un diagnóstico ni reemplaza una evaluación clínica profesional.</p>
      </div>
    );
  }

  return null;
}
