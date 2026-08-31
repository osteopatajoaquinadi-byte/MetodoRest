"use client";

import { useState, useEffect, useRef } from "react";
import {
  getBasalEvaluation,
  getPeriodicEvaluations,
  addPeriodicEvaluation,
  isEvaluationDue,
  getEvaluationWeekDue,
  getCurrentDay,
  type ResetQResult,
  type SSSResult,
} from "../../lib/storage";
import ResetQScale, { type ResetQScores } from "../../components/questionnaires/ResetQScale";
import SSSScale from "../../components/questionnaires/SSSScale";

type WizardStep = "resetq" | "sss" | "done";

export default function MideTuSuenoPage() {
  const [basal, setBasal] = useState(getBasalEvaluation());
  const [periodic, setPeriodic] = useState(getPeriodicEvaluations());
  const [evalDue, setEvalDue] = useState(false);
  const [weekDue, setWeekDue] = useState<number | null>(null);
  const [wizardActive, setWizardActive] = useState(false);
  const [wizardLabel, setWizardLabel] = useState("");
  const [wizardWeek, setWizardWeek] = useState<number | null>(null);
  const [wizardStep, setWizardStep] = useState<WizardStep>("resetq");
  const [currentDay, setCurrentDay] = useState(1);

  const resetqRef = useRef<ResetQResult | null>(null);
  const sssRef = useRef<SSSResult | null>(null);
  const [resetqDone, setResetqDone] = useState(false);
  const [sssDone, setSssDone] = useState(false);

  useEffect(() => {
    setBasal(getBasalEvaluation());
    setPeriodic(getPeriodicEvaluations());
    setEvalDue(isEvaluationDue());
    setWeekDue(getEvaluationWeekDue());
    setCurrentDay(getCurrentDay());
  }, []);

  const startWizard = (label: string, weekNumber: number | null) => {
    setWizardLabel(label);
    setWizardWeek(weekNumber);
    setWizardActive(true);
    setWizardStep("resetq");
    resetqRef.current = null;
    sssRef.current = null;
    setResetqDone(false);
    setSssDone(false);
  };

  const handleFinishEvaluation = async () => {
    const now = new Date().toISOString();
    const weekNum = wizardWeek ?? Math.ceil(currentDay / 7);
    addPeriodicEvaluation({
      id: crypto.randomUUID(),
      weekNumber: weekNum,
      resetq: resetqRef.current!,
      sss: sssRef.current!,
      completedAt: now,
    });
    setPeriodic(getPeriodicEvaluations());
    setEvalDue(isEvaluationDue());
    setWeekDue(getEvaluationWeekDue());
    setWizardActive(false);

    const userId = localStorage.getItem("rest-user-id");
    if (userId) {
      fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          tipo: wizardWeek === 3 ? "Semana 3" : `Libre (Día ${currentDay})`,
          resetq: resetqRef.current,
          sss: sssRef.current,
        }),
      }).catch(() => {});
    }
  };

  const allEvals = [
    ...(basal ? [{ label: "Medición basal", date: basal.completedAt, resetq: basal.resetq, sss: basal.sss, type: "basal" as const }] : []),
    ...periodic.map((e) => ({
      label: e.weekNumber === 3 ? "Final semana 3 (obligatoria)" : `Evaluación libre — Semana ${e.weekNumber}`,
      date: e.completedAt,
      resetq: e.resetq,
      sss: e.sss,
      type: "periodic" as const,
    })),
  ];

  const latest = allEvals.length > 0 ? allEvals[allEvals.length - 1] : null;
  const basalRQ = basal?.resetq ?? null;

  const getTrend = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff === 0) return { color: "text-rest-text-muted", icon: "→", text: "igual" };
    return diff < 0
      ? { color: "text-rest-accent", icon: "↓", text: `${Math.abs(diff)} menos` }
      : { color: "text-red-400", icon: "↑", text: `+${diff}` };
  };

  const bc = (g: number) => g <= 15 ? "text-rest-accent" : g <= 29 ? "text-amber-400" : g <= 45 ? "text-orange-400" : "text-rest-danger";

  /* ── Wizard active ── */
  if (wizardActive) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <button onClick={() => setWizardActive(false)} className="text-rest-text-muted text-sm hover:text-white transition mb-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Volver
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{wizardLabel}</h1>
          <p className="text-rest-text-muted mt-1">Completa RESET-Q y SSS para registrar tu estado</p>
          <div className="flex gap-2 mt-4">
            {(["resetq", "sss"] as WizardStep[]).map((s, idx) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${
                wizardStep === s ? "bg-rest-accent shadow-[0_0_6px_rgba(0,229,160,0.4)]"
                  : idx < ["resetq", "sss"].indexOf(wizardStep) ? "bg-rest-accent/40" : "bg-white/10"
              }`} />
            ))}
          </div>
        </div>

        {wizardStep === "resetq" && (
          <div className="p-6 rounded-2xl glass-card">
            <ResetQScale onComplete={(scores) => {
              resetqRef.current = { ...scores, date: new Date().toISOString() };
              setResetqDone(true);
            }} showResult={false} />
            {resetqDone && (
              <button onClick={() => setWizardStep("sss")} className="w-full mt-6 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)]">
                Siguiente — SSS
              </button>
            )}
          </div>
        )}

        {wizardStep === "sss" && (
          <div className="p-6 rounded-2xl glass-card">
            <SSSScale onComplete={(score) => {
              sssRef.current = { score, date: new Date().toISOString() };
              setSssDone(true);
            }} />
            <button onClick={handleFinishEvaluation} disabled={!sssDone}
              className="w-full mt-6 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-30 disabled:cursor-not-allowed">
              Guardar evaluación
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── Main view ── */
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Mide tu sueño</h1>
        <p className="text-rest-text-muted mt-1">RESET-Q + SSS para evaluar tu sistema nervioso y somnolencia</p>
      </div>

      {evalDue && (
        <button onClick={() => startWizard(`Evaluación obligatoria — Final semana ${weekDue}`, weekDue)}
          className="w-full p-5 rounded-2xl bg-gradient-to-r from-rest-accent/15 to-cyan-500/10 shadow-[0_0_20px_rgba(0,229,160,0.1)] hover:shadow-[0_0_30px_rgba(0,229,160,0.2)] transition-all hover:scale-[1.01] text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rest-accent/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">Evaluación obligatoria pendiente</p>
              <p className="text-rest-text-muted text-xs mt-0.5">Completaste la semana 3 — compara tu progreso vs la medición basal</p>
            </div>
            <svg className="w-5 h-5 text-rest-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </button>
      )}

      {/* Current RESET-Q summary */}
      {latest && basalRQ && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-5 rounded-2xl glass-card text-center">
            <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-2">RESET-Q actual</p>
            <p className="text-3xl font-bold text-white">{latest.resetq.global}<span className="text-sm text-rest-text-muted">/64</span></p>
            <p className={`text-xs mt-1 ${bc(latest.resetq.global)}`}>{latest.resetq.phenotype}</p>
          </div>
          <div className="p-5 rounded-2xl glass-card text-center">
            <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-2">vs Basal</p>
            <p className="text-3xl font-bold text-white">{basalRQ.global}<span className="text-sm text-rest-text-muted">/64</span></p>
            {allEvals.length > 1 && (() => {
              const trend = getTrend(latest.resetq.global, basalRQ.global);
              return <p className={`text-xs mt-1 ${trend.color}`}>{trend.icon} {trend.text}</p>;
            })()}
          </div>
        </div>
      )}

      <button onClick={() => startWizard("Nueva evaluación libre", null)}
        className="w-full py-3 bg-white/[0.04] hover:bg-rest-accent/10 rounded-xl transition-all flex items-center justify-center gap-2 text-rest-text-secondary hover:text-rest-accent group">
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        <span className="font-medium text-sm">Nueva evaluación</span>
      </button>

      {/* History */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg text-white">Historial de evaluaciones</h2>
        {allEvals.length === 0 && (
          <div className="p-6 rounded-2xl glass-card text-center"><p className="text-rest-text-muted text-sm">Aún no tienes evaluaciones registradas</p></div>
        )}
        {[...allEvals].reverse().map((ev, idx) => (
          <div key={idx} className="p-5 rounded-2xl glass-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-sm text-white">{ev.label}</p>
                <p className="text-rest-text-muted text-xs mt-0.5">{new Date(ev.date).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              {ev.type === "basal" && <span className="text-[10px] px-2 py-1 rounded-full bg-rest-accent/10 text-rest-accent font-medium">Línea base</span>}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-rest-text-muted text-[10px] mb-1">RESET-Q</p>
                <p className="text-lg font-bold text-white">{ev.resetq.global}<span className="text-[10px] text-rest-text-muted">/64</span></p>
                <p className={`text-[10px] ${bc(ev.resetq.global)}`}>{ev.resetq.phenotype}</p>
              </div>
              <div className="text-center">
                <p className="text-rest-text-muted text-[10px] mb-1">SSS</p>
                <p className="text-lg font-bold text-white">{ev.sss.score}<span className="text-[10px] text-rest-text-muted">/7</span></p>
              </div>
              <div className="text-center">
                <p className="text-rest-text-muted text-[10px] mb-1">Banda</p>
                <p className={`text-xs font-medium ${bc(ev.resetq.global)}`}>{ev.resetq.band}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/10 to-rest-accent/5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-rest-accent/20 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="font-semibold text-sm mb-1 text-white">¿Cuándo evaluar?</p>
            <p className="text-rest-text-muted text-sm leading-relaxed">
              Las evaluaciones <strong className="text-white">obligatorias</strong> son al inicio (medición basal) y al finalizar la semana 3.
              Puedes tomarlas <strong className="text-white">las veces que quieras</strong> para monitorear tu progreso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
