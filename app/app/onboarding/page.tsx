"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  setProfile,
  setOnboardingStatus,
  setBasalEvaluation,
  setProgramStart,
  type ResetQResult,
  type SSSResult,
} from "../../lib/storage";
import ResetQScale, { type ResetQScores } from "../../components/questionnaires/ResetQScale";
import SSSScale from "../../components/questionnaires/SSSScale";

type Step = "profile" | "intro" | "resetq" | "sss" | "results";

const sleepGoals = [
  "Mejorar la calidad del sueño",
  "Reducir el insomnio",
  "Regular mi ritmo circadiano",
  "Dejar de despertarme de noche",
  "Sentirme con más energía al despertar",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("profile");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [sleepGoal, setSleepGoal] = useState("");

  const resetqRef = useRef<ResetQResult | null>(null);
  const sssRef = useRef<SSSResult | null>(null);
  const [resetqDone, setResetqDone] = useState(false);
  const [sssDone, setSssDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const steps: Step[] = ["profile", "intro", "resetq", "sss", "results"];
  const currentIndex = steps.indexOf(step);
  const progress = (currentIndex / (steps.length - 1)) * 100;
  const canAdvanceProfile = name.trim() && age.trim() && email.trim();

  const handleResetQComplete = (scores: ResetQScores) => {
    resetqRef.current = { ...scores, date: new Date().toISOString() };
    setResetqDone(true);
  };

  const handleFinish = async () => {
    setSaving(true);
    const now = new Date().toISOString();
    const userId = localStorage.getItem("rest-user-id");

    setBasalEvaluation({
      resetq: resetqRef.current!,
      sss: sssRef.current!,
      completedAt: now,
    });

    setOnboardingStatus({ profileCompleted: true, basalCompleted: true, completedAt: now });
    setProgramStart(now.split("T")[0]);

    if (userId) {
      setProfile({
        id: userId, name: name.trim(), age: Number(age), email: email.trim(),
        gender: gender || undefined, sleepGoal: sleepGoal || undefined,
        onboardingCompletedAt: now, createdAt: now,
      });
      try {
        await fetch("/api/user", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            fields: {
              Nombre: name.trim(), Edad: Number(age),
              "Género": gender ? gender.charAt(0).toUpperCase() + gender.slice(1).replace("-", " ") : undefined,
              "Objetivo Sueño": sleepGoal || undefined,
              perfil_completado: true, basal_completado: true,
              onboarding_completado: true, fecha_onboarding: now, fecha_inicio_programa: now,
            },
          }),
        });
        await fetch("/api/evaluations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, tipo: "Basal", resetq: resetqRef.current, sss: sssRef.current }),
        });
      } catch { /* localStorage fallback */ }
    } else {
      setProfile({
        id: crypto.randomUUID(), name: name.trim(), age: Number(age), email: email.trim(),
        gender: gender || undefined, sleepGoal: sleepGoal || undefined,
        onboardingCompletedAt: now, createdAt: now,
      });
    }
    router.replace("/app");
  };

  const bc = (g: number) => g <= 15 ? "text-rest-accent" : g <= 29 ? "text-amber-400" : g <= 45 ? "text-orange-400" : "text-rest-danger";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-rest-text-muted">
          <span>Paso {currentIndex + 1} de {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-[#00E5A0] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,229,160,0.5)]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* PROFILE */}
      {step === "profile" && (
        <div className="p-6 rounded-2xl glass-card space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Bienvenido al Método R.E.S.T.</h1>
            <p className="text-rest-text-muted mt-1">Cuéntanos sobre ti para personalizar tu experiencia</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-rest-text-muted block mb-1">Nombre *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="w-full bg-rest-bg rounded-lg px-3 py-2.5 text-sm text-white shadow-[inset_0_0_0_1px_rgba(0,229,160,0.08)] focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.25)] focus:outline-none placeholder:text-rest-text-muted/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-rest-text-muted block mb-1">Edad *</label>
                <input type="number" min={10} max={100} value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" className="w-full bg-rest-bg rounded-lg px-3 py-2.5 text-sm text-white shadow-[inset_0_0_0_1px_rgba(0,229,160,0.08)] focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.25)] focus:outline-none placeholder:text-rest-text-muted/50" />
              </div>
              <div>
                <label className="text-xs text-rest-text-muted block mb-1">Género</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-rest-bg rounded-lg px-3 py-2.5 text-sm text-white shadow-[inset_0_0_0_1px_rgba(0,229,160,0.08)] focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.25)] focus:outline-none">
                  <option value="">Prefiero no decir</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="no-binario">No binario</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-rest-text-muted block mb-1">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full bg-rest-bg rounded-lg px-3 py-2.5 text-sm text-white shadow-[inset_0_0_0_1px_rgba(0,229,160,0.08)] focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.25)] focus:outline-none placeholder:text-rest-text-muted/50" />
            </div>
            <div>
              <label className="text-xs text-rest-text-muted block mb-1">¿Cuál es tu principal objetivo?</label>
              <div className="space-y-2">{sleepGoals.map((g) => (
                <button key={g} onClick={() => setSleepGoal(g)} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${sleepGoal === g ? "bg-rest-accent/15 text-rest-accent shadow-[0_0_8px_rgba(0,229,160,0.15)]" : "bg-white/[0.04] text-rest-text-secondary hover:bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"}`}>{g}</button>
              ))}</div>
            </div>
          </div>
          <button onClick={() => setStep("intro")} disabled={!canAdvanceProfile} className="w-full py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-30 disabled:cursor-not-allowed">Continuar</button>
        </div>
      )}

      {/* INTRO */}
      {step === "intro" && (
        <div className="p-6 rounded-2xl glass-card space-y-5">
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rest-accent/15 flex items-center justify-center">
              <svg className="w-8 h-8 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Medición basal</h1>
            <p className="text-rest-text-secondary text-sm leading-relaxed max-w-md mx-auto">
              Antes de comenzar tu plan de 21 días, necesitamos medir el estado actual de tu sistema nervioso y tu sueño.
              Esto establece una <span className="text-rest-accent font-medium">línea base</span> para medir tu progreso.
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-rest-text-muted pt-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-rest-accent/15 flex items-center justify-center text-rest-accent font-bold text-[10px]">1</div>
                <span>RESET-Q</span>
              </div>
              <div className="w-4 h-px bg-rest-text-muted/30" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-rest-accent/15 flex items-center justify-center text-rest-accent font-bold text-[10px]">2</div>
                <span>SSS</span>
              </div>
            </div>
          </div>
          <button onClick={() => setStep("resetq")} className="w-full py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)]">Comenzar evaluación</button>
        </div>
      )}

      {/* RESET-Q */}
      {step === "resetq" && (
        <div className="p-6 rounded-2xl glass-card">
          <ResetQScale onComplete={handleResetQComplete} showResult={false} />
          {resetqDone && (
            <button onClick={() => setStep("sss")} className="w-full mt-6 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)]">Siguiente — SSS</button>
          )}
        </div>
      )}

      {/* SSS */}
      {step === "sss" && (
        <div className="p-6 rounded-2xl glass-card">
          <SSSScale onComplete={(score) => { sssRef.current = { score, date: new Date().toISOString() }; setSssDone(true); }} />
          <button onClick={() => setStep("results")} disabled={!sssDone} className="w-full mt-6 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-30 disabled:cursor-not-allowed">Ver mis resultados</button>
        </div>
      )}

      {/* RESULTS */}
      {step === "results" && resetqRef.current && sssRef.current && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-card text-center space-y-3">
            <h1 className="text-2xl font-bold text-white">Tu línea base, {name.split(" ")[0]}</h1>
            <p className="text-rest-text-muted text-sm">Estos son tus resultados iniciales. Los compararemos al finalizar la semana 3.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl glass-card col-span-2">
              <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-2">RESET-Q Global</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">{resetqRef.current.global}<span className="text-sm text-rest-text-muted">/64</span></p>
                <span className={`text-xs font-medium ${bc(resetqRef.current.global)}`}>{resetqRef.current.band}</span>
              </div>
              <p className={`text-xs mt-1 ${bc(resetqRef.current.global)}`}>Fenotipo: {resetqRef.current.phenotype}</p>
            </div>
            {([
              { l: "Hiperactivación", s: resetqRef.current.scoreH },
              { l: "Autonómico", s: resetqRef.current.scoreA },
              { l: "Ritmicidad", s: resetqRef.current.scoreR },
              { l: "Insomnio", s: resetqRef.current.scoreI },
            ]).map((d) => (
              <div key={d.l} className="p-4 rounded-xl glass-card">
                <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-2">{d.l}</p>
                <p className="text-2xl font-bold text-white">{d.s}<span className="text-sm text-rest-text-muted">/16</span></p>
                <p className={`text-xs mt-1 ${d.s >= 11 ? "text-rest-danger" : d.s >= 6 ? "text-amber-400" : "text-rest-accent"}`}>
                  {d.s >= 11 ? "Alto" : d.s >= 6 ? "Moderado" : "Normal"}
                </p>
              </div>
            ))}
            <div className="p-4 rounded-xl glass-card">
              <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-2">Somnolencia (SSS)</p>
              <p className="text-2xl font-bold text-white">{sssRef.current.score}<span className="text-sm text-rest-text-muted">/7</span></p>
              <p className={`text-xs mt-1 ${(sssRef.current.score) >= 5 ? "text-rest-danger" : (sssRef.current.score) >= 4 ? "text-rest-warning" : "text-rest-accent"}`}>
                {(sssRef.current.score) >= 5 ? "Significativa" : (sssRef.current.score) >= 4 ? "Relevante" : "Normal"}
              </p>
            </div>
            <div className="p-4 rounded-xl glass-card">
              <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-2">Respiratorio (B)</p>
              <p className="text-2xl font-bold text-white">{resetqRef.current.scoreB}<span className="text-sm text-rest-text-muted">/5</span></p>
              <p className={`text-xs mt-1 ${resetqRef.current.scoreB >= 3 ? "text-rest-danger" : resetqRef.current.scoreB >= 2 ? "text-rest-warning" : "text-rest-accent"}`}>
                {resetqRef.current.scoreB >= 3 ? "Derivación médica" : resetqRef.current.scoreB >= 2 ? "Advertencia" : "Sin alarma"}
              </p>
            </div>
          </div>

          {resetqRef.current.phenotype === "SAFETY" && (
            <div className="p-4 rounded-xl bg-rest-danger/10 border border-rest-danger/20">
              <p className="text-sm text-rest-text-secondary"><span className="font-semibold text-rest-danger">Importante:</span> Tus respuestas sugieren posibles signos de apnea del sueño. Te recomendamos consultar con un médico. Puedes continuar con el método, pero la evaluación médica es prioritaria.</p>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/10 to-rest-accent/5">
            <p className="text-sm text-rest-text-secondary leading-relaxed">
              <span className="font-medium text-white">Tu plan de 21 días comienza hoy.</span> Al finalizar la semana 3 repetiremos RESET-Q y SSS para medir tu progreso.
            </p>
          </div>

          <button onClick={handleFinish} disabled={saving} className="w-full py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] hover:shadow-[0_0_24px_rgba(0,229,160,0.4)] hover:scale-[1.03] disabled:opacity-60">
            {saving ? "Guardando..." : "Comenzar mi plan R.E.S.T."}
          </button>
        </div>
      )}
    </div>
  );
}
