"use client";

import { useState, useEffect, useRef } from "react";
import {
  getBasalEvaluation,
  getPeriodicEvaluations,
  addPeriodicEvaluation,
  isEvaluationDue,
  getEvaluationWeekDue,
  getISILabel,
  type EvaluacionResult,
  type SSSResult,
  type ISIResult,
  type CuestionarioResult,
} from "../../lib/storage";
import Evaluacion60s from "../../components/questionnaires/Evaluacion60s";
import SSSScale from "../../components/questionnaires/SSSScale";
import ISIScale from "../../components/questionnaires/ISIScale";
import CuestionarioAdaptado from "../../components/questionnaires/CuestionarioAdaptado";

type WizardStep = "eval60" | "sss" | "isi" | "cuestionario" | "done";

export default function EvaluacionesPage() {
  const [basal, setBasal] = useState(getBasalEvaluation());
  const [periodic, setPeriodic] = useState(getPeriodicEvaluations());
  const [evalDue, setEvalDue] = useState(false);
  const [weekDue, setWeekDue] = useState<number | null>(null);
  const [wizardActive, setWizardActive] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>("eval60");

  const evalRef = useRef<EvaluacionResult | null>(null);
  const sssRef = useRef<SSSResult | null>(null);
  const isiRef = useRef<ISIResult | null>(null);
  const cuestRef = useRef<CuestionarioResult | null>(null);
  const [evalDone2, setEvalDone2] = useState(false);
  const [sssDone2, setSssDone2] = useState(false);
  const [isiDone2, setIsiDone2] = useState(false);
  const [cuestDone2, setCuestDone2] = useState(false);

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
      evaluacion60s: evalRef.current!,
      sss: sssRef.current!,
      isi: isiRef.current!,
      cuestionario: cuestRef.current!,
      completedAt: now,
    });
    setPeriodic(getPeriodicEvaluations());
    setEvalDue(false);
    setWizardActive(false);
    setWizardStep("done");

    const userId = localStorage.getItem("rest-user-id");
    if (userId) {
      fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          tipo: weekDue === 2 ? "Semana 2" : "Semana 4",
          evaluacion60s: evalRef.current,
          sss: sssRef.current,
          isi: isiRef.current,
          cuestionario: cuestRef.current,
        }),
      }).catch(() => {});
    }
  };

  const sem2 = periodic.find((e) => e.weekNumber === 2);
  const sem4 = periodic.find((e) => e.weekNumber === 4);

  const metrics = [
    {
      label: "Eval. 60s",
      unit: "/6",
      basal: basal?.evaluacion60s.yesCount,
      sem2: sem2?.evaluacion60s.yesCount,
      sem4: sem4?.evaluacion60s.yesCount,
      inverse: true,
    },
    {
      label: "SSS",
      unit: "/7",
      basal: basal?.sss.score,
      sem2: sem2?.sss.score,
      sem4: sem4?.sss.score,
      inverse: true,
    },
    {
      label: "ISI",
      unit: "/28",
      basal: basal?.isi.total,
      sem2: sem2?.isi.total,
      sem4: sem4?.isi.total,
      inverse: true,
    },
    {
      label: "Síntomas",
      unit: "/20",
      basal: basal?.cuestionario.total,
      sem2: sem2?.cuestionario.total,
      sem4: sem4?.cuestionario.total,
      inverse: true,
    },
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

        {wizardStep === "eval60" && (
          <div className="p-6 rounded-2xl glass-card">
            <Evaluacion60s onComplete={(answers, yesCount) => {
              evalRef.current = { answers, yesCount, date: new Date().toISOString() };
              setEvalDone2(true);
            }} />
            <button
              onClick={() => setWizardStep("sss")}
              disabled={!evalDone2}
              className="w-full mt-6 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Siguiente — SSS
            </button>
          </div>
        )}

        {wizardStep === "sss" && (
          <div className="p-6 rounded-2xl glass-card">
            <SSSScale onComplete={(score) => {
              sssRef.current = { score, date: new Date().toISOString() };
              setSssDone2(true);
            }} />
            <button
              onClick={() => setWizardStep("isi")}
              disabled={!sssDone2}
              className="w-full mt-6 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Siguiente — ISI
            </button>
          </div>
        )}

        {wizardStep === "isi" && (
          <div className="p-6 rounded-2xl glass-card">
            <ISIScale onComplete={(answers, total, label) => {
              isiRef.current = { answers, total, label, date: new Date().toISOString() };
              setIsiDone2(true);
            }} />
            <button
              onClick={() => setWizardStep("cuestionario")}
              disabled={!isiDone2}
              className="w-full mt-6 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Siguiente — Cuestionario
            </button>
          </div>
        )}

        {wizardStep === "cuestionario" && (
          <div className="p-6 rounded-2xl glass-card">
            <CuestionarioAdaptado onComplete={(answers, total) => {
              cuestRef.current = { answers, total, date: new Date().toISOString() };
              setCuestDone2(true);
            }} />
            <button
              onClick={handleFinishEvaluation}
              disabled={!cuestDone2}
              className="w-full mt-6 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
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

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-4 rounded-xl glass-card ${basal ? "shadow-[inset_0_0_0_1px_rgba(0,229,160,0.15)]" : ""}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              basal ? "bg-rest-accent text-rest-bg" : "bg-white/10 text-rest-text-muted"
            }`}>
              {basal ? "✓" : "1"}
            </div>
            <p className="font-medium text-sm text-white">Medición basal</p>
          </div>
          {basal ? (
            <p className="text-rest-text-muted text-xs">{new Date(basal.completedAt).toLocaleDateString("es-CL")}</p>
          ) : (
            <p className="text-rest-text-muted text-xs">Pendiente</p>
          )}
        </div>

        <div className={`p-4 rounded-xl glass-card ${sem2 ? "shadow-[inset_0_0_0_1px_rgba(0,229,160,0.15)]" : ""}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              sem2 ? "bg-rest-accent text-rest-bg" : "bg-white/10 text-rest-text-muted"
            }`}>
              {sem2 ? "✓" : "2"}
            </div>
            <p className="font-medium text-sm text-white">Semana 2</p>
          </div>
          {sem2 ? (
            <p className="text-rest-text-muted text-xs">{new Date(sem2.completedAt).toLocaleDateString("es-CL")}</p>
          ) : (
            <p className="text-rest-text-muted text-xs">{evalDue && weekDue === 2 ? "Disponible ahora" : "Pendiente"}</p>
          )}
        </div>

        <div className={`p-4 rounded-xl glass-card ${sem4 ? "shadow-[inset_0_0_0_1px_rgba(0,229,160,0.15)]" : ""}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              sem4 ? "bg-rest-accent text-rest-bg" : "bg-white/10 text-rest-text-muted"
            }`}>
              {sem4 ? "✓" : "3"}
            </div>
            <p className="font-medium text-sm text-white">Semana 4</p>
          </div>
          {sem4 ? (
            <p className="text-rest-text-muted text-xs">{new Date(sem4.completedAt).toLocaleDateString("es-CL")}</p>
          ) : (
            <p className="text-rest-text-muted text-xs">{evalDue && weekDue === 4 ? "Disponible ahora" : "Pendiente"}</p>
          )}
        </div>
      </div>

      {/* Start evaluation button */}
      {evalDue && (
        <button
          onClick={() => { setWizardActive(true); setWizardStep("eval60"); }}
          className="w-full py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] hover:shadow-[0_0_24px_rgba(0,229,160,0.4)] hover:scale-[1.03]"
        >
          Comenzar evaluación — Semana {weekDue}
        </button>
      )}

      {/* Comparison table */}
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
                      <td className="text-center py-3 px-3">
                        <span className="text-lg font-bold text-white">{m.basal ?? "—"}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        {m.sem2 !== undefined ? (
                          <div>
                            <span className="text-lg font-bold text-white">{m.sem2}</span>
                            {trend2 && (
                              <p className={`text-[10px] mt-0.5 ${trend2.color}`}>{trend2.icon} {trend2.text}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-rest-text-muted">—</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-3">
                        {m.sem4 !== undefined ? (
                          <div>
                            <span className="text-lg font-bold text-white">{m.sem4}</span>
                            {trend4 && (
                              <p className={`text-[10px] mt-0.5 ${trend4.color}`}>{trend4.icon} {trend4.text}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-rest-text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Basal detail */}
      {basal && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/10 to-rest-accent/5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rest-accent/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1 text-white">Tu línea base</p>
              <p className="text-rest-text-muted text-sm leading-relaxed">
                ISI: {basal.isi.total}/28 ({getISILabel(basal.isi.total)}) · SSS: {basal.sss.score}/7 · Eval: {basal.evaluacion60s.yesCount}/6 · Síntomas: {basal.cuestionario.total}/20
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
