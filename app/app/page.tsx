"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  getProfile,
  getCurrentDay,
  getCurrentWeek,
  getDailyHabits,
  setDailyHabits,
  isEvaluationDue,
  getEvaluationWeekDue,
  getStreakDays,
  getWeekCompletedDays,
} from "../lib/storage";
import { getHabitsForWeek, weekTips } from "../lib/habits";

function AmbientMusic() {
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ oscL: OscillatorNode; oscR: OscillatorNode; gain: GainNode } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rest-ambient-music");
    if (saved === "on") setPlaying(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("rest-ambient-music", playing ? "on" : "off");
  }, [playing]);

  useEffect(() => {
    if (!playing) {
      if (nodesRef.current) {
        nodesRef.current.gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current!.currentTime + 0.5);
        const nodes = nodesRef.current;
        const ctx = audioCtxRef.current;
        setTimeout(() => {
          try { nodes.oscL.stop(); } catch {}
          try { nodes.oscR.stop(); } catch {}
          try { ctx?.close(); } catch {}
        }, 600);
        nodesRef.current = null;
        audioCtxRef.current = null;
      }
      return;
    }
    const ctx = new AudioContext();
    const merger = ctx.createChannelMerger(2);
    const gain = ctx.createGain();
    gain.gain.value = 0.06;

    const oscL = ctx.createOscillator();
    oscL.type = "sine";
    oscL.frequency.value = 174;
    const gainL = ctx.createGain();
    gainL.gain.value = 1;
    oscL.connect(gainL);
    gainL.connect(merger, 0, 0);

    const oscR = ctx.createOscillator();
    oscR.type = "sine";
    oscR.frequency.value = 178;
    const gainR = ctx.createGain();
    gainR.gain.value = 1;
    oscR.connect(gainR);
    gainR.connect(merger, 0, 1);

    merger.connect(gain);
    gain.connect(ctx.destination);
    oscL.start();
    oscR.start();

    audioCtxRef.current = ctx;
    nodesRef.current = { oscL, oscR, gain };

    return () => {
      try { oscL.stop(); } catch {}
      try { oscR.stop(); } catch {}
      try { ctx.close(); } catch {}
    };
  }, [playing]);

  return (
    <>
      {playing && expanded && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer"
          onClick={() => setExpanded(false)}
        >
          <style>{`
            @keyframes pendulum {
              0%, 100% { transform: rotate(-25deg); }
              50% { transform: rotate(25deg); }
            }
          `}</style>
          <svg viewBox="0 0 200 320" className="w-52 h-80 sm:w-64 sm:h-96">
            <g style={{ transformOrigin: "100px 20px", animation: "pendulum 4s cubic-bezier(0.4,0,0.6,1) infinite" }}>
              <line x1="100" y1="20" x2="100" y2="240" stroke="rgba(0,229,160,0.2)" strokeWidth="1.5" />
              <circle cx="100" cy="245" r="18" fill="rgba(0,229,160,0.15)" stroke="rgba(0,229,160,0.4)" strokeWidth="1.5" />
              <circle cx="100" cy="245" r="8" fill="rgba(0,229,160,0.6)">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="245" r="30" fill="none" stroke="rgba(0,229,160,0.08)" strokeWidth="1">
                <animate attributeName="r" values="28;35;28" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.15;0.05;0.15" dur="4s" repeatCount="indefinite" />
              </circle>
            </g>
            <circle cx="100" cy="20" r="3" fill="rgba(0,229,160,0.3)" />
          </svg>
          <p className="text-rest-text-muted text-xs mt-6 tracking-widest uppercase">Frecuencia theta · 4 Hz</p>
          <p className="text-rest-text-muted/50 text-[10px] mt-2">Toca para cerrar</p>
        </div>
      )}

      <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex items-center gap-2">
        {playing && (
          <button
            onClick={() => setExpanded(true)}
            className="w-10 h-10 rounded-full bg-rest-accent/10 flex items-center justify-center hover:bg-rest-accent/20 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            title="Ver péndulo"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <style>{`
                @keyframes mini-pendulum {
                  0%, 100% { transform: rotate(-20deg); }
                  50% { transform: rotate(20deg); }
                }
              `}</style>
              <g style={{ transformOrigin: "12px 4px", animation: "mini-pendulum 3s ease-in-out infinite" }}>
                <line x1="12" y1="4" x2="12" y2="17" stroke="rgba(0,229,160,0.4)" strokeWidth="1" />
                <circle cx="12" cy="18" r="3" fill="rgba(0,229,160,0.6)" stroke="rgba(0,229,160,0.3)" strokeWidth="0.5" />
              </g>
              <circle cx="12" cy="4" r="1.5" fill="rgba(0,229,160,0.4)" />
            </svg>
          </button>
        )}

        <button
          onClick={() => setPlaying(!playing)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
            playing
              ? "bg-rest-accent/20 text-rest-accent shadow-[0_0_16px_rgba(0,229,160,0.2),inset_0_0_0_1px_rgba(0,229,160,0.25)]"
              : "bg-rest-card-solid/80 text-rest-text-muted hover:text-rest-accent shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          }`}
          title={playing ? "Desactivar frecuencia ambiental" : "Activar frecuencia ambiental"}
        >
          {playing ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}

function ChangePasswordCard() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    const profile = getProfile();
    if (!profile?.email) return;
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: profile.email }),
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="p-5 rounded-2xl glass-card">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-rest-accent/10 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <div className="flex-1">
          {sent ? (
            <>
              <p className="font-semibold text-sm text-white">Enlace enviado</p>
              <p className="text-rest-text-muted text-xs mt-1">Revisa tu correo para configurar tu nueva contraseña.</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-sm text-white">¿Quieres cambiar tu contraseña?</p>
              <p className="text-rest-text-muted text-xs mt-1">Te enviaremos un correo con un enlace para configurar una nueva.</p>
              <button
                onClick={handleSend}
                disabled={loading}
                className="mt-3 px-4 py-2 text-xs font-medium rounded-lg bg-rest-accent/10 text-rest-accent hover:bg-rest-accent/20 transition-colors disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar enlace al correo"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AppDashboard() {
  const [userName, setUserName] = useState("");
  const [currentDay, setCurrentDay] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [evalDue, setEvalDue] = useState(false);
  const [evalWeek, setEvalWeek] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [weekCompleted, setWeekCompleted] = useState(0);
  const [daySaved, setDaySaved] = useState(false);

  const todayKey = new Date().toISOString().split("T")[0];
  const weekHabits = getHabitsForWeek(currentWeek);
  const tip = weekTips[currentWeek] ?? weekTips[1];

  useEffect(() => {
    const profile = getProfile();
    if (profile) setUserName(profile.name.split(" ")[0]);
    setCurrentDay(getCurrentDay());
    setCurrentWeek(getCurrentWeek());
    setEvalDue(isEvaluationDue());
    setEvalWeek(getEvaluationWeekDue());
    setStreak(getStreakDays());
    setWeekCompleted(getWeekCompletedDays());

    const saved = getDailyHabits(todayKey);
    if (saved) {
      setChecked(saved.habits);
      if (saved.completedCount === saved.totalCount && saved.totalCount > 0) {
        setDaySaved(true);
      }
    }
  }, [todayKey]);

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = weekHabits.length > 0 ? Math.round((completedCount / weekHabits.length) * 100) : 0;
  const globalProgress = Math.min(100, Math.round(((currentDay - 1) / 21) * 100));

  const toggleHabit = (habitId: string) => {
    const newChecked = { ...checked, [habitId]: !checked[habitId] };
    setChecked(newChecked);
    const count = Object.values(newChecked).filter(Boolean).length;
    setDailyHabits({
      date: todayKey,
      habits: newChecked,
      completedCount: count,
      totalCount: weekHabits.length,
    });

    const userId = localStorage.getItem("rest-user-id");
    if (userId) {
      fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date: todayKey,
          weekNumber: currentWeek,
          habits: newChecked,
          completedCount: count,
          totalCount: weekHabits.length,
        }),
      }).catch(() => {});
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AmbientMusic />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Buenas noches{userName ? `, ${userName}` : ""}
        </h1>
        <p className="text-rest-text-muted mt-1">Día {currentDay} de tu plan R.E.S.T. — Semana {currentWeek}</p>
      </div>

      {/* Evaluation banner */}
      {evalDue && (
        <Link href="/app/mide-tu-sueno" className="block group">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/15 to-cyan-500/10 shadow-[0_0_20px_rgba(0,229,160,0.1)] hover:shadow-[0_0_30px_rgba(0,229,160,0.2)] transition-all hover:scale-[1.01]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rest-accent/20 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Semana {evalWeek}: Es momento de reevaluar tu sueño</p>
                <p className="text-rest-text-muted text-xs mt-0.5">Compara tu progreso con tu medición basal</p>
              </div>
              <svg className="w-5 h-5 text-rest-accent group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      )}

      {/* Progress card */}
      <div className="p-6 rounded-2xl glass-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-lg text-white">Tu progreso</h2>
            <p className="text-rest-text-muted text-xs">Plan de 21 días</p>
          </div>
          <span className="text-2xl font-bold text-rest-accent">{globalProgress}%</span>
        </div>
        <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-[#00E5A0] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,229,160,0.5)]" style={{ width: `${globalProgress}%` }} />
        </div>
        <div className="flex justify-between mt-3 text-xs text-rest-text-muted">
          <span className={currentWeek >= 1 ? "text-rest-accent" : ""}>Semana 1</span>
          <span className={currentWeek >= 2 ? "text-rest-accent" : ""}>Semana 2</span>
          <span className={currentWeek >= 3 ? "text-rest-accent" : ""}>Semana 3</span>
        </div>
      </div>

      {/* Quick action — Ebook only */}
      <div>
        <h2 className="font-semibold mb-3 text-white">Acceso rápido</h2>
        <Link
          href="/app/ebook"
          className="group flex items-center gap-4 p-5 rounded-xl glass-card hover:!bg-[rgba(0,229,160,0.15)] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,229,160,0.15)] transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rest-accent to-emerald-400 flex items-center justify-center opacity-80 group-hover:opacity-100 transition">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-white">Leer ebook</p>
            <p className="text-rest-text-muted text-xs mt-0.5">Continuar lectura del Método R.E.S.T.</p>
          </div>
        </Link>
      </div>

      {/* Habit stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl glass-card text-center">
          <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-1">Racha</p>
          <p className="text-xl font-bold text-rest-accent">{streak}</p>
          <p className="text-rest-text-muted text-[10px]">días</p>
        </div>
        <div className="p-4 rounded-xl glass-card text-center">
          <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-1">Esta semana</p>
          <p className="text-xl font-bold text-white">{weekCompleted}<span className="text-sm text-rest-text-muted">/7</span></p>
          <p className="text-rest-text-muted text-[10px]">días completos</p>
        </div>
        <div className="p-4 rounded-xl glass-card text-center">
          <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-1">Hoy</p>
          <p className="text-xl font-bold text-white">{completedCount}<span className="text-sm text-rest-text-muted">/{weekHabits.length}</span></p>
          <p className="text-rest-text-muted text-[10px]">hábitos</p>
        </div>
      </div>

      {/* Today's checklist */}
      <div className="p-6 rounded-2xl glass-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-lg text-white">Hoy — Semana {currentWeek}</h2>
            <p className="text-rest-text-muted text-xs mt-0.5">{completedCount} de {weekHabits.length} completados</p>
          </div>
          <div className="flex items-center gap-3">
            {progress > 0 && (
              <span className="text-sm font-bold text-rest-accent">{progress}%</span>
            )}
            <Link href="/app/plan-21-dias" className="text-rest-accent text-sm hover:underline">Ver plan</Link>
          </div>
        </div>

        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-[#00E5A0] rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(0,229,160,0.5)]" style={{ width: `${progress}%` }} />
        </div>

        <div className="space-y-2">
          {weekHabits.map((habit) => {
            const isDone = checked[habit.id] || false;
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  isDone ? "habit-item-checked" : "hover:bg-rest-accent/[0.04]"
                }`}
              >
                <div className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
                  isDone
                    ? "habit-checkbox-checked"
                    : "habit-checkbox-unchecked"
                }`}>
                  {isDone && (
                    <svg className="w-3 h-3 text-rest-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <span className={`text-sm ${isDone ? "line-through text-rest-text-muted" : "text-rest-text-secondary"}`}>
                    {habit.text}
                  </span>
                </div>
                <span className="text-[10px] text-rest-text-muted/50 px-2 py-0.5 rounded bg-white/[0.03]">{habit.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish day button */}
      {completedCount > 0 && (
        <button
          onClick={() => {
            setDaySaved(true);
            setDailyHabits({
              date: todayKey,
              habits: checked,
              completedCount,
              totalCount: weekHabits.length,
            });
            const userId = localStorage.getItem("rest-user-id");
            if (userId) {
              fetch("/api/habits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId,
                  date: todayKey,
                  weekNumber: currentWeek,
                  habits: checked,
                  completedCount,
                  totalCount: weekHabits.length,
                }),
              }).catch(() => {});
            }
            setStreak(getStreakDays());
            setWeekCompleted(getWeekCompletedDays());
          }}
          disabled={daySaved}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            daySaved
              ? "bg-rest-accent/10 text-rest-accent shadow-[inset_0_0_0_1px_rgba(0,229,160,0.2)] cursor-default"
              : "bg-rest-accent hover:bg-[#00B880] text-rest-bg shadow-[0_0_20px_rgba(0,229,160,0.3)] hover:shadow-[0_0_30px_rgba(0,229,160,0.4)] hover:scale-[1.02]"
          }`}
        >
          {daySaved ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Día {currentDay} completado — {completedCount}/{weekHabits.length} hábitos
            </span>
          ) : (
            `Terminé día ${currentDay}`
          )}
        </button>
      )}

      {/* Ritual de cierre */}
      <Link href="/app/ritual" className="block group">
        <div className="p-4 rounded-xl bg-rest-luna/[0.06] hover:bg-rest-luna/10 transition-all hover:scale-[1.01] shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center text-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-rest-luna/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-rest-luna" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="font-medium text-sm text-white">Ritual de cierre</p>
          <p className="text-rest-text-muted text-xs">Cierra el día en 2 min</p>
        </div>
      </Link>

      {/* Cambiar contraseña */}
      <ChangePasswordCard />

      {/* Tip of the week */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/10 to-rest-accent/5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-rest-accent/20 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm mb-1 text-white">{tip.title}</p>
            <p className="text-rest-text-muted text-sm leading-relaxed">{tip.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
