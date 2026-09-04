"use client";

import { useState } from "react";

const LIKERT = [
  { value: 0, label: "Nunca" },
  { value: 1, label: "Rara vez" },
  { value: 2, label: "A veces" },
  { value: 3, label: "Frecuente" },
  { value: 4, label: "Siempre" },
];

const DOMAINS = {
  H: {
    label: "Cuando cierras los ojos",
    items: [
      "Al acostarme, mi mente sigue trabajando aunque mi cuerpo esté cansado.",
      "Si me despierto en la madrugada, empiezo a pensar y no puedo volver a dormir con facilidad.",
      "Después de un día intenso necesito más de 30 minutos para que mi cuerpo se \"apague\".",
      "Aunque duerma horas suficientes, me despierto sintiendo que no descansé.",
    ],
  },
  A: {
    label: "Lo que siente tu cuerpo",
    items: [
      "Noto tensión persistente en mandíbula, cuello u hombros al despertar.",
      "Tengo palpitaciones, opresión en el pecho o sensación de falta de aire sin causa aparente.",
      "Al levantarme rápido siento mareo, aturdimiento o visión borrosa breve.",
      "Mis manos o pies están frecuentemente fríos, incluso en ambientes templados.",
    ],
  },
  R: {
    label: "Tu energía durante el día",
    items: [
      "Necesito café o azúcar en las primeras dos horas del día para funcionar.",
      "Mi energía cae bruscamente entre las 14:00 y 16:00 hs.",
      "Después de un momento estresante tardo horas en volver a sentirme calmado.",
      "En fines de semana o vacaciones tiendo a enfermarme o sentir agotamiento profundo.",
    ],
  },
  I: {
    label: "Tu noche",
    items: [
      "Tardo más de 30 minutos en quedarme dormido/a.",
      "Me despierto varias veces durante la noche.",
      "Me despierto antes de lo que quisiera y no puedo volver a dormir.",
      "Al levantarme siento que el sueño no fue reparador.",
    ],
  },
};

const B_ITEMS = [
  "¿Roncas fuerte (se escucha desde otra habitación)?",
  "¿Alguien te dijo que dejas de respirar o haces pausas al dormir?",
  "¿Te despiertas con dolor de cabeza o la boca muy seca?",
  "¿Tienes hipertensión diagnosticada o en tratamiento?",
];

const PHENO: Record<string, { title: string; desc: string; hook: string }> = {
  "SR-1": {
    title: "Tu mente no se apaga",
    desc: "Tu cuerpo se acuesta cansado, pero tu sistema nervioso sigue en alerta. Das vueltas pensando cuando deberías estar descansando.",
    hook: "El Método R.E.S.T. está diseñado para desactivar ese estado de alerta y enseñarle a tu cuerpo a soltar por la noche.",
  },
  "SR-2": {
    title: "Tu cuerpo está tenso",
    desc: "La tensión, las palpitaciones y el frío en manos o pies son señales de un cuerpo que no logra bajar la guardia, ni siquiera al dormir.",
    hook: "El Método R.E.S.T. trabaja la regulación de tu cuerpo para que pueda entrar en modo descanso de verdad.",
  },
  "SR-3": {
    title: "Tu energía está desregulada",
    desc: "Tus subidas y bajadas de energía, la dependencia del café y el agotamiento del fin de semana muestran un ritmo interno alterado.",
    hook: "El Método R.E.S.T. reordena tu ritmo circadiano para que recuperes energía estable y un sueño que repara.",
  },
  "SR-4": {
    title: "Desgaste silencioso",
    desc: "Aunque no lo notes tanto en la noche, tu cuerpo muestra señales de desgaste acumulado que terminan afectando tu descanso.",
    hook: "El Método R.E.S.T. aborda ese desgaste antes de que se convierta en insomnio crónico.",
  },
  "SR-5": {
    title: "Tu descanso está bastante bien",
    desc: "No aparecen señales importantes de desregulación. Lo tuyo es mantener y optimizar lo que ya funciona.",
    hook: "El Método R.E.S.T. te ayuda a proteger y afinar tu descanso para que siga siendo reparador.",
  },
  SAFETY: {
    title: "Conviene una revisión médica",
    desc: "Algunas de tus respuestas sugieren posibles signos de un trastorno respiratorio del sueño (como apnea). Esto merece atención de un profesional de salud.",
    hook: "Te recomendamos consultar con un médico antes de iniciar cualquier programa. El Método R.E.S.T. puede acompañarte, pero la evaluación médica es prioritaria.",
  },
};

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

type Phase = "intro" | "H" | "A" | "R" | "I" | "B" | "email" | "result";
const STEPS: Phase[] = ["H", "A", "R", "I", "B"];

export default function EvaluacionLanding() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, (number | null)[]>>({
    H: [null, null, null, null], A: [null, null, null, null],
    R: [null, null, null, null], I: [null, null, null, null],
  });
  const [bAns, setBAns] = useState<(boolean | null)[]>([null, null, null, null]);
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ phenotype: string; global: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const stepIdx = STEPS.indexOf(phase as Phase);

  const setLikert = (dom: string, idx: number, val: number) => {
    setAnswers((prev) => {
      const copy = { ...prev, [dom]: [...prev[dom]] };
      copy[dom][idx] = val;
      return copy;
    });
  };

  const domainComplete = (dom: string) => answers[dom]?.every((x) => x !== null);
  const bComplete = () => bAns.every((x) => x !== null);

  const finalize = () => {
    const sum = (arr: (number | null)[]) => arr.reduce((s: number, v) => s + (v || 0), 0);
    const sH = sum(answers.H), sA = sum(answers.A), sR = sum(answers.R), sI = sum(answers.I);
    const sB = bAns.filter(Boolean).length;
    const g = sH + sA + sR + sI;
    const phenotype = computePhenotype(sH, sA, sR, sI, sB, g);
    setResult({ phenotype, global: g });
    setPhase("result");
    // Guardado best-effort del lead (no bloquea la UI)
    if (email) {
      setSaving(true);
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phenotype, global: g, scores: { sH, sA, sR, sI, sB } }),
      }).catch(() => {}).finally(() => setSaving(false));
    }
  };

  const advance = () => {
    if (phase === "intro") { setPhase("H"); return; }
    if (phase === "B") { setPhase("email"); return; }
    if (phase === "email") { finalize(); return; }
    const next = STEPS[stepIdx + 1];
    if (next) setPhase(next);
  };

  /* Intro */
  if (phase === "intro") {
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="p-8 rounded-3xl glass-card">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rest-accent/15 flex items-center justify-center mb-5">
            <svg className="w-7 h-7 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <h3 className="font-[family-name:var(--font-space)] text-2xl sm:text-3xl font-semibold mb-3 text-white">
            ¿Por qué tu cuerpo no descansa?
          </h3>
          <p className="text-rest-text-secondary text-sm sm:text-base leading-relaxed mb-2">
            Responde 20 preguntas y descubre <span className="text-rest-accent">qué patrón específico</span> está detrás de tu mal dormir. Toma 3 minutos y es gratis.
          </p>
          <p className="text-rest-text-muted text-xs mb-6">
            No es un test genérico de sueño. Evalúa tu sistema nervioso, tu ritmo y tu descanso.
          </p>
          <button onClick={advance} className="w-full py-3.5 bg-rest-accent hover:bg-rest-accent-dark text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)]">
            Hacer mi evaluación gratis
          </button>
        </div>
      </div>
    );
  }

  /* Likert domains */
  if (phase === "H" || phase === "A" || phase === "R" || phase === "I") {
    const dom = DOMAINS[phase];
    const ans = answers[phase];
    return (
      <div className="max-w-xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl glass-card">
          <div className="flex gap-1.5 mb-5">
            {STEPS.map((s, idx) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${idx === stepIdx ? "bg-rest-accent" : idx < stepIdx ? "bg-rest-accent/40" : "bg-white/10"}`} />
            ))}
          </div>
          <h3 className="font-semibold text-lg text-white mb-1">{dom.label}</h3>
          <p className="text-rest-text-muted text-xs mb-5">Piensa en las últimas 2 semanas</p>
          <div className="space-y-5">
            {dom.items.map((q, idx) => (
              <div key={idx}>
                <p className="text-sm text-rest-text-secondary mb-2">{q}</p>
                <div className="flex gap-1.5">
                  {LIKERT.map((o) => (
                    <button key={o.value} onClick={() => setLikert(phase, idx, o.value)}
                      className={`flex-1 py-2 rounded-lg text-center transition ${ans[idx] === o.value ? "bg-rest-accent text-rest-bg font-bold scale-105 shadow-[0_0_12px_rgba(0,229,160,0.4)]" : "bg-white/[0.05] text-rest-text-secondary hover:bg-white/[0.1]"}`}>
                      <span className="block text-sm font-medium">{o.value}</span>
                      <span className="block text-[8px] leading-tight opacity-60 mt-0.5">{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={advance} disabled={!domainComplete(phase)}
            className="w-full mt-6 py-3 bg-rest-accent hover:bg-rest-accent-dark text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-30 disabled:cursor-not-allowed">
            Continuar
          </button>
        </div>
      </div>
    );
  }

  /* B domain */
  if (phase === "B") {
    return (
      <div className="max-w-xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl glass-card">
          <div className="flex gap-1.5 mb-5">
            {STEPS.map((s, idx) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${idx === stepIdx ? "bg-rest-accent" : "bg-rest-accent/40"}`} />
            ))}
          </div>
          <h3 className="font-semibold text-lg text-white mb-1">Un par de preguntas de seguridad</h3>
          <p className="text-rest-text-muted text-xs mb-5">Para descartar señales que requieren atención médica</p>
          <div className="space-y-3">
            {B_ITEMS.map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-rest-bg">
                <p className="text-sm text-rest-text-secondary mb-3">{q}</p>
                <div className="flex gap-3">
                  <button onClick={() => setBAns((p) => { const c = [...p]; c[idx] = true; return c; })}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${bAns[idx] === true ? "bg-rest-danger/20 text-rest-danger" : "bg-white/[0.05] text-rest-text-secondary hover:bg-white/[0.1]"}`}>Sí</button>
                  <button onClick={() => setBAns((p) => { const c = [...p]; c[idx] = false; return c; })}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${bAns[idx] === false ? "bg-rest-accent/20 text-rest-accent" : "bg-white/[0.05] text-rest-text-secondary hover:bg-white/[0.1]"}`}>No</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={advance} disabled={!bComplete()}
            className="w-full mt-6 py-3 bg-rest-accent hover:bg-rest-accent-dark text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-30 disabled:cursor-not-allowed">
            Casi listo
          </button>
        </div>
      </div>
    );
  }

  /* Email capture */
  if (phase === "email") {
    return (
      <div className="max-w-xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl glass-card text-center">
          <h3 className="font-semibold text-xl text-white mb-2">¿A dónde te enviamos tu resultado?</h3>
          <p className="text-rest-text-muted text-sm mb-6">Te mostramos tu perfil ahora y te enviamos una copia con recomendaciones. Sin spam.</p>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com"
            className="w-full bg-rest-bg rounded-xl px-4 py-3 text-sm text-white text-center shadow-[inset_0_0_0_1px_rgba(0,229,160,0.1)] focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.3)] focus:outline-none placeholder:text-rest-text-muted/50 mb-4" />
          <button onClick={advance}
            className="w-full py-3.5 bg-rest-accent hover:bg-rest-accent-dark text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)]">
            Ver mi resultado
          </button>
          <button onClick={finalize} className="w-full mt-3 py-2 text-rest-text-muted text-xs hover:text-rest-text-secondary transition">
            Prefiero verlo sin dejar mi email
          </button>
        </div>
      </div>
    );
  }

  /* Result */
  if (phase === "result" && result) {
    const info = PHENO[result.phenotype];
    const isSafety = result.phenotype === "SAFETY";
    return (
      <div className="max-w-xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl glass-card">
          <div className="text-center mb-6">
            <span className="text-rest-accent text-xs font-medium tracking-widest uppercase">Tu perfil</span>
            <h3 className="font-[family-name:var(--font-space)] text-2xl sm:text-3xl font-semibold mt-2 mb-3 text-white">{info.title}</h3>
            <p className="text-rest-text-secondary text-sm leading-relaxed">{info.desc}</p>
          </div>

          {!isSafety && (
            <div className="p-4 rounded-xl bg-rest-bg mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-rest-text-muted text-xs">Nivel de desregulación</span>
                <span className="text-rest-accent font-bold text-sm">{result.global}/64</span>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-rest-accent to-teal-400 transition-all" style={{ width: `${(result.global / 64) * 100}%` }} />
              </div>
            </div>
          )}

          <div className={`p-4 rounded-xl mb-6 ${isSafety ? "bg-rest-danger/10 border border-rest-danger/20" : "bg-rest-accent/10"}`}>
            <p className="text-sm text-rest-text-secondary leading-relaxed">{info.hook}</p>
          </div>

          {!isSafety && (
            <a href="#precio" className="block w-full py-3.5 bg-rest-accent hover:bg-rest-accent-dark text-rest-bg font-semibold rounded-xl transition-all text-center shadow-[0_0_16px_rgba(0,229,160,0.3)] hover:shadow-[0_0_24px_rgba(0,229,160,0.5)]">
              Ver cómo funciona el Método R.E.S.T.
            </a>
          )}

          <p className="text-rest-text-muted text-[10px] text-center leading-relaxed mt-4 px-2">
            RESET-Q está en fase de validación. Los resultados son orientativos y no constituyen un diagnóstico ni reemplazan una evaluación clínica profesional.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
