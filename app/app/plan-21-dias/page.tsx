"use client";

import { useState, useEffect } from "react";
import { plan, CHECKLIST_KEY, type WeekKey } from "../../lib/plan-21-dias";

export default function Plan21DiasPage() {
  const [week, setWeek] = useState<WeekKey>(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem(CHECKLIST_KEY);
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch {}
    }
  }, []);

  const weekData = plan[week];
  const totalTasks = weekData.tasks.length;
  const completedTasks = weekData.tasks.filter((_, i) => checked[`${week}-${i}`]).length;
  const weekProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      return next;
    });
  };

  const totalAll = Object.values(plan).reduce((acc, w) => acc + w.tasks.length, 0);
  const completedAll = Object.entries(checked).filter(([, v]) => v).length;
  const globalProgress = totalAll > 0 ? Math.round((completedAll / totalAll) * 100) : 0;

  const categoryColors: Record<string, string> = {
    Ritmo: "bg-rest-accent/10 text-rest-accent",
    Entorno: "bg-purple-500/10 text-purple-400",
    Respiración: "bg-cyan-500/10 text-cyan-400",
    Alimentación: "bg-amber-500/10 text-amber-400",
    Movimiento: "bg-rose-500/10 text-rose-400",
    Timing: "bg-blue-500/10 text-blue-400",
    Medición: "bg-indigo-500/10 text-indigo-400",
    General: "bg-rest-accent/10 text-rest-text-secondary",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Checklist Semanal</h1>
        <p className="text-rest-text-muted mt-1">Tu progreso semanal de hábitos — un pilar por semana</p>
      </div>

      {/* Global progress */}
      <div className="p-6 rounded-2xl glass-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-lg text-white">Progreso total</h2>
            <p className="text-rest-text-muted text-xs">{completedAll} de {totalAll} hábitos completados</p>
          </div>
          <span className="text-2xl font-bold text-rest-accent">{globalProgress}%</span>
        </div>
        <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-rest-accent rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,229,160,0.4)]" style={{ width: `${globalProgress}%` }} />
        </div>
      </div>

      {/* Week tabs */}
      <div className="grid grid-cols-3 gap-2">
        {([1, 2, 3] as WeekKey[]).map((w) => {
          const wData = plan[w];
          const wCompleted = wData.tasks.filter((_, i) => checked[`${w}-${i}`]).length;
          const wTotal = wData.tasks.length;
          const wPct = wTotal > 0 ? Math.round((wCompleted / wTotal) * 100) : 0;
          const isActive = week === w;

          return (
            <button
              key={w}
              onClick={() => setWeek(w)}
              className={`p-4 rounded-xl text-left transition-all ${
                isActive
                  ? "bg-rest-accent/10"
                  : "bg-white/[0.02] hover:bg-rest-accent/[0.05]"
              }`}
            >
              <p className={`font-semibold text-sm ${isActive ? "text-rest-accent" : ""}`}>Semana {w}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${isActive ? "bg-rest-accent shadow-[0_0_6px_rgba(0,229,160,0.4)]" : "bg-rest-text-muted"}`} style={{ width: `${wPct}%` }} />
                </div>
                <span className="text-xs text-rest-text-muted">{wPct}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Week content */}
      <div className="p-6 rounded-2xl glass-card">
        <div className="flex items-start gap-4 mb-6">
          <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${weekData.color} flex items-center justify-center`}>
            <span className="text-xl font-bold text-rest-bg">{week}</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">{weekData.title}</h2>
            <p className="text-rest-text-muted text-sm mt-1">{weekData.focus}</p>
          </div>
        </div>

        {/* Progress for this week */}
        <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-black/20">
          <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-rest-accent rounded-full transition-all duration-300 shadow-[0_0_6px_rgba(0,229,160,0.4)]" style={{ width: `${weekProgress}%` }} />
          </div>
          <span className="text-sm font-medium text-rest-accent">{completedTasks}/{totalTasks}</span>
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          {weekData.tasks.map((task, i) => {
            const key = `${week}-${i}`;
            const isDone = checked[key] || false;

            return (
              <button
                key={i}
                onClick={() => toggle(key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  isDone
                    ? "habit-item-checked"
                    : "bg-white/[0.02] hover:bg-rest-accent/[0.05]"
                }`}
              >
                <div className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
                  isDone ? "habit-checkbox-checked" : "habit-checkbox-unchecked"
                }`}>
                  {isDone && (
                    <svg className="w-3 h-3 text-rest-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`flex-1 text-sm ${isDone ? "line-through text-rest-text-muted" : "text-rest-text-secondary"}`}>
                  {task.text}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryColors[task.category] || categoryColors.General}`}>
                  {task.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/10 to-rest-accent/5">
        <p className="text-sm text-rest-text-secondary leading-relaxed">
          <span className="font-medium text-rest-text">No necesitas perfección.</span>{" "}
          Comienza con una o dos estrategias, sé constante y observa cómo tu cuerpo responde con un descanso más profundo y reparador.
          El método te entrega las herramientas, tú encuentras tu ritmo.
        </p>
      </div>
    </div>
  );
}
