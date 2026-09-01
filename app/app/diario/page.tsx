"use client";

import { useState, useEffect, useRef } from "react";
import {
  getBasalEvaluation,
  getPeriodicEvaluations,
  addPeriodicEvaluation,
  isEvaluationDue,
  getEvaluationWeekDue,
  getResetQBandLabel,
  type ResetQResult,
  type SSSResult,
} from "../../lib/storage";
import ResetQScale, { type ResetQScores } from "../../components/questionnaires/ResetQScale";
import SSSScale from "../../components/questionnaires/SSSScale";

type WizardStep = "resetq" | "sss" | "done";

export default function EvaluacionesPage() {
  const [basal, setBasal] = useState(getBasalEvaluation());
  const [periodic, setPeriodic] = useState(getPeriodicEvaluations());
  const [evalDue, setEvalDue] = useState(false);
  const [weekDue, setWeekDue] = useState<number | null>(null);
  const [wizardActive, setWizardActive] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>("resetq");

  const resetqRef = useRef<ResetQResult | null>(null);
  const sssRef = useRef<SSSResult | null>(null);
  const [resetqDone, setResetqDone] = useState(false);
  const [sssDone, setSssDone] = useState(false);

  useEffect(() => {
    setBasal(getBasalEvaluation());
    setPeriodic(getPeriodicEvaluations());
    setEvalDue(isEvaluationDue());
    setWeekDue(getEvaluationWeekDue());
  }, []);

  const handleFinishEvaluation = async () => {
    const now = new Date().toISOString();
    addPeriodicEvaluation({
      id: crypto.randomUUID(),
      weekNumber: weekDue!,
      resetq: resetqRef.current!,
      sss: sssRef.current!,
      completedAt: now,
    });
    setPeriodic(getPeriodicEvaluations());
    setEvalDue(false);
    setWizardActive(false);

    const userId = localStorage.getItem("rest-user-id");
    if (userId) {
      fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, tipo: weekDue === 2 ? "Semana 2" : "Semana 4",
          resetq: resetqRef.current, sss: sssRef.current,
        }),
      }).catch(() => {});
    }
  };

  const sem2 = periodic.find((e) => e.weekNumber === 2);
  const sem4 = periodic.find((e) => e.weekNumber === 4);

  const bc = (g: number) => g <= 15 ? "text-rest-accent" : g <= 29 ? "text-amber-400" : g <= 45 ? "text-orange-400" : "text-rest-danger";

  const metrics = [
    { label: "RESET-Q", unit: "/64", basal: basal?.resetq.global, sem2: sem2?.resetq.global, sem4: sem4?.resetq.global, inverse: true },
    { label: "Dominio H", unit: "/16", basal: basal?.resetq.scoreH, sem2: sem2?.resetq.scoreH, sem4: sem4?.resetq.scoreH, inverse: true },
    { label: "Dominio A", unit: "/16", basal: basal?.resetq.scoreA, sem2: sem2?.resetq.scoreA, sem4: sem4?.resetq.scoreA, inverse: true },
    { label: "Dominio R", unit: "/16", basal: basal?.resetq.scoreR, sem2: sem2?.resetq.scoreR, sem4: sem4?.resetq.scoreR, inverse: true },
    { label: "Dominio I", unit: "/16", basal: basal?.resetq.scoreI, sem2: sem2?.resetq.scoreI, sem4: sem4?.resetq.scoreI, inverse: true },
    { label: "SSS", unit: "/7", basal: basal?.sss.score, sem2: sem2?.sss.score, sem4: sem4?.sss.score, inverse: true },
  ];

  const getTrend = (current: number | undefined, previous: number | undefined, inverse: boolean) => {
    if (current === undefined || previous === undefined) return null;
    const diff = current - previous;
    if (diff === 0) return { color: "text-rest-text-muted", icon: "→", text: "igual" };
    const improved = inverse ? diff < 0 : diff > 0;
    return improved
      ? { color: "text-rest-accent", icon: "↓", text: `${Math.abs(diff)} menos` }
      : { color: "text-rest-danger", icon: "↑", text: `+${Math.abs(diff)}` };
  };

  if (wizardActive) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Evaluación — Semana {weekDue}</h1>
          <p className="text-rest-text-muted mt-1">Compara con tu medición basal</p>
        </div>

        {wizardStep === "resetq" && (
          <div className="p-6 rounded-2xl glass-card">
            <ResetQScale onComplete={(scores: ResetQScores) => {
              resetqRef.current = { ...scores, date: new Date().toISOString() };
              setResetqDone(true);
            }} showResult={false} />
            {resetqDone && (
              <button onClick={() => setWizardStep("sss")}
                className="w-full mt-6 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)]">
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Evaluaciones clínicas</h1>
        <p className="text-rest-text-muted mt-1">Medición cada 2 semanas para medir tu progreso</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-4 rounded-xl glass-card ${basal ? "shadow-[inset_0_0_0_1px_rgba(0,229,160,0.15)]" : ""}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${basal ? "bg-rest-accent text-rest-bg" : "bg-white/10 text-rest-text-muted"}`}>
              {basal ? "✓" : "1"}
            </div>
            <p className="font-medium text-sm text-white">Medición basal</p>
          </div>
          {basal ? <p className="text-rest-text-muted text-xs">{new Date(basal.completedAt).toLocaleDateString("es-CL")}</p> : <p className="text-rest-text-muted text-xs">Pendiente</p>}
        </div>
        <div className={`p-4 rounded-xl glass-card ${sem2 ? "shadow-[inset_0_0_0_1px_rgba(0,229,160,0.15)]" : ""}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${sem2 ? "bg-rest-accent text-rest-bg" : "bg-white/10 text-rest-text-muted"}`}>
              {sem2 ? "✓" : "2"}
            </div>
            <p className="font-medium text-sm text-white">Semana 2</p>
          </div>
          {sem2 ? <p className="text-rest-text-muted text-xs">{new Date(sem2.completedAt).toLocaleDateString("es-CL")}</p> : <p className="text-rest-text-muted text-xs">{evalDue && weekDue === 2 ? "Disponible ahora" : "Pendiente"}</p>}
        </div>
        <div className={`p-4 rounded-xl glass-card ${sem4 ? "shadow-[inset_0_0_0_1px_rgba(0,229,160,0.15)]" : ""}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${sem4 ? "bg-rest-accent text-rest-bg" : "bg-white/10 text-rest-text-muted"}`}>
              {sem4 ? "✓" : "3"}
            </div>
            <p className="font-medium text-sm text-white">Semana 4</p>
          </div>
          {sem4 ? <p className="text-rest-text-muted text-xs">{new Date(sem4.completedAt).toLocaleDateString("es-CL")}</p> : <p className="text-rest-text-muted text-xs">{evalDue && weekDue === 4 ? "Disponible ahora" : "Pendiente"}</p>}
        </div>
      </div>

      {evalDue && (
        <button onClick={() => { setWizardActive(true); setWizardStep("resetq"); }}
          className="w-full py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] hover:shadow-[0_0_24px_rgba(0,229,160,0.4)] hover:scale-[1.03]">
          Comenzar evaluación — Semana {weekDue}
        </button>
      )}

      {basal && (
        <div className="p-6 rounded-2xl glass-card">
          <h2 className="font-semibold text-lg mb-4 text-white">Comparativa de progreso</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-rest-text-muted text-xs">
                  <th className="text-left py-2 pr-4">Métrica</th>
                  <th className="text-center py-2 px-3">Basal</th>
                  <th className="text-center py-2 px-3">Sem 2</th>
                  <th className="text-center py-2 px-3">Sem 4</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => {
                  const trend2 = getTrend(m.sem2, m.basal, m.inverse);
                  const trend4 = getTrend(m.sem4, m.sem2 ?? m.basal, m.inverse);
                  return (
                    <tr key={m.label} className="border-t border-white/[0.04]">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-white">{m.label}</p>
                        <p className="text-rest-text-muted text-[10px]">{m.unit}</p>
                      </td>
                      <td className="text-center py-3 px-3"><span className="text-lg font-bold text-white">{m.basal ?? "—"}</span></td>
                      <td className="text-center py-3 px-3">
                        {m.sem2 !== undefined ? (
                          <div>
                            <span className="text-lg font-bold text-white">{m.sem2}</span>
                            {trend2 && <p className={`text-[10px] mt-0.5 ${trend2.color}`}>{trend2.icon} {trend2.text}</p>}
                          </div>
                        ) : <span className="text-rest-text-muted">—</span>}
                      </td>
                      <td className="text-center py-3 px-3">
                        {m.sem4 !== undefined ? (
                          <div>
                            <span className="text-lg font-bold text-white">{m.sem4}</span>
                            {trend4 && <p className={`text-[10px] mt-0.5 ${trend4.color}`}>{trend4.icon} {trend4.text}</p>}
                          </div>
                        ) : <span className="text-rest-text-muted">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {basal && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/10 to-rest-accent/5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rest-accent/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1 text-white">Tu línea base</p>
              <p className="text-rest-text-muted text-sm leading-relaxed">
                RESET-Q: {basal.resetq.global}/64 ({basal.resetq.band}) · Fenotipo: {basal.resetq.phenotype} · SSS: {basal.sss.score}/7
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
