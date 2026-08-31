"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Phase = "inhale" | "hold" | "exhale";
type Exercise = "478" | "diafragmatica";

interface ExerciseConfig {
  name: string;
  subtitle: string;
  desc: string;
  phases: { phase: Phase; duration: number; label: string; color: string }[];
  instructions: string[];
}

// Duraciones ofrecidas (en segundos). 5 min es la sesion recomendada por defecto.
const DURATIONS = [180, 300, 600] as const;
const DEFAULT_DURATION = 300;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.max(0, seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const exercises: Record<Exercise, ExerciseConfig> = {
  "478": {
    name: "Respiración 4-7-8",
    subtitle: "El Sedante Natural",
    desc: "La exhalación prolongada (8s) favorece la activación parasimpática, enviando señales de calma al cerebro.",
    phases: [
      { phase: "inhale", duration: 4, label: "Inhala", color: "#00E5A0" },
      { phase: "hold", duration: 7, label: "Retén", color: "#22D3EE" },
      { phase: "exhale", duration: 8, label: "Exhala", color: "#60A5FA" },
    ],
    instructions: [
      "Busca una postura cómoda y relaja la lengua detrás de los dientes",
      "Mantén tu boca cerrada durante todo el ejercicio",
      "Inhala por NARIZ durante 4 segundos",
      "Aguanta la respiración 7 segundos",
      "Exhala por NARIZ lentamente durante 8 segundos",
      "Repite durante toda la sesión (5 minutos recomendados)",
    ],
  },
  diafragmatica: {
    name: "Respiración Diafragmática",
    subtitle: "Coherencia Cardíaca",
    desc: "Entrena a tu cuerpo para salir del modo alerta y volver al modo calma, donde la energía se estabiliza.",
    phases: [
      { phase: "inhale", duration: 5, label: "Inhala", color: "#00E5A0" },
      { phase: "exhale", duration: 5, label: "Exhala", color: "#60A5FA" },
    ],
    instructions: [
      "Acuéstate y posiciona una mano en el pecho y la otra en el abdomen",
      "Inhala por nariz (5s), inflando el abdomen",
      "Exhala por nariz/boca (5s), desinflando el abdomen",
      "El pecho debe moverse lo mínimo posible",
      "Mantén el ritmo durante toda la sesión (5 minutos recomendados)",
    ],
  },
};

function TriangleBreathing({ config, running, currentPhaseIndex, timeLeft }: {
  config: ExerciseConfig;
  running: boolean;
  currentPhaseIndex: number;
  timeLeft: number;
}) {
  const phase = config.phases[currentPhaseIndex];
  const phaseDuration = phase.duration;
  const elapsed = phaseDuration - timeLeft;
  const progress = running ? (phaseDuration > 1 ? Math.min(1, elapsed / (phaseDuration - 1)) : 1) : 0;

  const trianglePoints = [
    { x: 150, y: 30 },
    { x: 270, y: 260 },
    { x: 30, y: 260 },
  ];

  const getBallPosition = () => {
    if (!running) return { x: 30, y: 260 };
    const phaseIdx = currentPhaseIndex;
    const startPoint = trianglePoints[(phaseIdx + 2) % 3];
    const endPoint = trianglePoints[phaseIdx];
    return {
      x: startPoint.x + (endPoint.x - startPoint.x) * progress,
      y: startPoint.y + (endPoint.y - startPoint.y) * progress,
    };
  };

  const ball = getBallPosition();

  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <polygon
          points="150,30 270,260 30,260"
          fill="none"
          stroke="rgba(0,229,160,0.15)"
          strokeWidth="2"
        />

        <text x="150" y="18" textAnchor="middle" fill={currentPhaseIndex === 1 && running ? phase.color : "rgba(255,255,255,0.3)"} fontSize="11" fontWeight="600">
          Retener
        </text>
        <text x="268" y="278" textAnchor="middle" fill={currentPhaseIndex === 2 && running ? phase.color : "rgba(255,255,255,0.3)"} fontSize="11" fontWeight="600">
          Exhalar
        </text>
        <text x="32" y="278" textAnchor="middle" fill={currentPhaseIndex === 0 && running ? phase.color : "rgba(255,255,255,0.3)"} fontSize="11" fontWeight="600">
          Inhalar
        </text>

        <circle
          cx={ball.x}
          cy={ball.y}
          r="10"
          fill={running ? phase.color : "#00E5A0"}
          filter="url(#glow)"
          className="transition-all duration-1000 ease-linear"
        />
        <circle
          cx={ball.x}
          cy={ball.y}
          r="16"
          fill="none"
          stroke={running ? phase.color : "#00E5A0"}
          strokeWidth="1"
          strokeOpacity="0.3"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {running && (
          <>
            <p className="text-4xl font-bold tabular-nums" style={{ color: phase.color }}>{timeLeft}</p>
            <p className="text-sm font-medium mt-1" style={{ color: phase.color }}>{phase.label}</p>
          </>
        )}
      </div>
    </div>
  );
}

function BallBreathing({ config, running, currentPhaseIndex, timeLeft }: {
  config: ExerciseConfig;
  running: boolean;
  currentPhaseIndex: number;
  timeLeft: number;
}) {
  const phase = config.phases[currentPhaseIndex];
  const phaseDuration = phase.duration;
  const elapsed = phaseDuration - timeLeft;
  const progress = running ? (phaseDuration > 1 ? Math.min(1, elapsed / (phaseDuration - 1)) : 1) : 0;

  const isInhale = phase.phase === "inhale";
  const minScale = 0.4;
  const maxScale = 1;
  const scale = running
    ? isInhale
      ? minScale + (maxScale - minScale) * progress
      : maxScale - (maxScale - minScale) * progress
    : minScale;

  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
      <div
        className="absolute rounded-full shadow-[inset_0_0_0_1px_rgba(0,229,160,0.08)]"
        style={{ width: "85%", height: "85%" }}
      />

      <div
        className="rounded-full flex items-center justify-center transition-transform ease-linear"
        style={{
          width: "200px",
          height: "200px",
          transform: `scale(${scale})`,
          transitionDuration: "1000ms",
          background: `radial-gradient(circle at 40% 40%, ${phase.color}40, ${phase.color}15)`,
          border: `2px solid ${phase.color}50`,
          boxShadow: `0 0 ${running ? 30 : 10}px ${phase.color}30`,
        }}
      >
        <div className="text-center pointer-events-none">
          {running && (
            <>
              <p className="text-4xl font-bold tabular-nums" style={{ color: phase.color }}>{timeLeft}</p>
              <p className="text-sm font-medium mt-1" style={{ color: phase.color }}>{phase.label}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function useAmbientSound(playing: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!playing) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      return;
    }

    const audio = new Audio("/audio/ambient-music.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(() => {});
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [playing]);
}

// La guia hablada solo acompania los primeros ciclos: despues el usuario
// ya tiene el ritmo y la voz repetida se vuelve mecanica.
const GUIDED_CYCLES = 3;
// Las locuciones estan grabadas muy pausadas; acelerarlas suena mas natural.
const VOICE_RATE = 1.18;
// Volumen del chime que reemplaza a la voz: audible pero que no sobresalte
const CHIME_VOLUME = 0.35;

function useBreathingSound(running: boolean, phase: Phase, phaseDuration: number, cycle: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const stopAll = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };

    if (!running) {
      stopAll();
      return;
    }

    const guided = cycle <= GUIDED_CYCLES;

    // Primeros ciclos: voz que guia. Despues: solo un chime tenue que marca
    // el cambio de etapa, para no romper la relajacion.
    const srcMap: Record<Phase, string> = guided
      ? {
          inhale: "/audio/inhala.m4a",
          exhale: "/audio/exhala.m4a",
          hold: "/audio/manten.m4a",
        }
      : {
          // Un unico toque de cuenco marca cualquier cambio de etapa.
          inhale: "/audio/bell.m4a",
          exhale: "/audio/bell.m4a",
          hold: "/audio/bell.m4a",
        };

    const src = srcMap[phase];
    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);
    audio.volume = guided ? 0.5 : CHIME_VOLUME;
    if (guided) audio.playbackRate = VOICE_RATE;
    audio.play().catch(() => {});
    audioRef.current = audio;

    return stopAll;
  }, [running, phase, phaseDuration, cycle]);
}

export default function RespiracionesPage() {
  const [selected, setSelected] = useState<Exercise>("478");
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [duration, setDuration] = useState<number>(DEFAULT_DURATION);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  // Ancla de reloj real: evita el drift acumulado de setInterval en sesiones largas
  const clockRef = useRef({ startedAt: 0, offset: 0 });

  const config = exercises[selected];
  const cycleSeconds = config.phases.reduce((sum, ph) => sum + ph.duration, 0);
  const totalCycles = Math.max(1, Math.round(duration / cycleSeconds));
  const sessionSeconds = totalCycles * cycleSeconds;

  useAmbientSound(running);
  useBreathingSound(running, config.phases[currentPhaseIndex]?.phase ?? "hold", config.phases[currentPhaseIndex]?.duration ?? 4, cycle);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    clockRef.current = { startedAt: 0, offset: 0 };
    setRunning(false);
    setStarted(false);
    setCurrentPhaseIndex(0);
    setTimeLeft(0);
    setCycle(1);
    setElapsed(0);
    setCompleted(false);
  }, []);

  const start = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    clockRef.current = { startedAt: Date.now(), offset: 0 };
    setCurrentPhaseIndex(0);
    setTimeLeft(config.phases[0].duration);
    setCycle(1);
    setElapsed(0);
    setCompleted(false);
    setStarted(true);
    setRunning(true);
  }, [config]);

  const pause = useCallback(() => {
    const c = clockRef.current;
    c.offset += (Date.now() - c.startedAt) / 1000;
    c.startedAt = 0;
    setRunning(false);
  }, []);

  const resume = useCallback(() => {
    clockRef.current.startedAt = Date.now();
    setRunning(true);
  }, []);

  useEffect(() => { reset(); }, [selected, duration, reset]);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const c = clockRef.current;
      const total = c.offset + (c.startedAt ? (Date.now() - c.startedAt) / 1000 : 0);

      if (total >= sessionSeconds) {
        if (timerRef.current) clearInterval(timerRef.current);
        setElapsed(sessionSeconds);
        setRunning(false);
        setCompleted(true);
        return;
      }

      // Posicion exacta dentro del ciclo, derivada del reloj (no acumula error)
      let inCycle = total % cycleSeconds;
      let phaseIndex = 0;
      for (let i = 0; i < config.phases.length; i++) {
        if (inCycle < config.phases[i].duration) {
          phaseIndex = i;
          break;
        }
        inCycle -= config.phases[i].duration;
        phaseIndex = i + 1;
      }
      if (phaseIndex >= config.phases.length) phaseIndex = config.phases.length - 1;

      setElapsed(Math.floor(total));
      setCurrentPhaseIndex(phaseIndex);
      setTimeLeft(Math.max(1, Math.ceil(config.phases[phaseIndex].duration - inCycle)));
      setCycle(Math.min(totalCycles, Math.floor(total / cycleSeconds) + 1));
    };
    tick();
    timerRef.current = setInterval(tick, 250);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, config, cycleSeconds, sessionSeconds, totalCycles]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Respiraciones</h1>
        <p className="text-rest-text-muted mt-1">Ejercicios para activar tu sistema nervioso parasimpático</p>
      </div>

      {/* Tabs */}
      <div className="relative flex p-1.5 rounded-2xl bg-rest-card backdrop-blur-xl">
        <div
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-black/40 shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out"
          style={{
            width: "calc((100% - 12px) / 2)",
            left: selected === "478" ? "6px" : "calc((100% - 12px) / 2 + 6px)",
          }}
        />
        {(["478", "diafragmatica"] as Exercise[]).map((ex) => (
          <button
            key={ex}
            onClick={() => setSelected(ex)}
            className={`relative z-10 flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors duration-200 ${
              selected === ex ? "text-white/80" : "text-rest-text-muted hover:text-rest-text-secondary"
            }`}
          >
            {exercises[ex].name}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="p-6 rounded-2xl glass-card">
        <h3 className="font-semibold text-lg mb-1 text-white">{config.name}</h3>
        <p className="text-rest-accent text-xs font-medium mb-3">{config.subtitle}</p>
        <p className="text-rest-text-muted text-sm leading-relaxed mb-4">{config.desc}</p>
        <ol className="space-y-2">
          {config.instructions.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-rest-accent/10 text-rest-accent text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-rest-text-secondary text-sm">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Animation */}
      <div className="p-8 rounded-2xl glass-card">
        {/* Duracion de la sesion */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-rest-text-muted text-xs mr-1">Duración</span>
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              disabled={started}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                duration === d
                  ? "bg-rest-accent/15 text-rest-accent ring-1 ring-rest-accent/30"
                  : "bg-black/25 text-rest-text-muted hover:text-rest-text-secondary"
              }`}
            >
              {d / 60} min
            </button>
          ))}
        </div>
        {selected === "478" ? (
          <TriangleBreathing config={config} running={running} currentPhaseIndex={currentPhaseIndex} timeLeft={timeLeft} />
        ) : (
          <BallBreathing config={config} running={running} currentPhaseIndex={currentPhaseIndex} timeLeft={timeLeft} />
        )}

        {/* Progreso de la sesion */}
        {started && (
          <div className="mt-5 max-w-sm mx-auto">
            <div className="flex items-center justify-between text-xs text-rest-text-muted mb-2">
              <span>Ciclo {cycle}/{totalCycles}</span>
              <span className="font-medium text-rest-accent tabular-nums">
                {formatTime(Math.max(0, sessionSeconds - elapsed))} restantes
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-rest-accent transition-[width] duration-300 ease-linear"
                style={{ width: `${Math.min(100, (elapsed / sessionSeconds) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Sound indicators */}
        {running && (
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-rest-accent/40 animate-pulse" />
                <span className="w-1 h-1.5 rounded-full bg-rest-accent/40 animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="w-1 h-2 rounded-full bg-rest-accent/40 animate-pulse" style={{ animationDelay: "300ms" }} />
                <span className="w-1 h-1.5 rounded-full bg-rest-accent/40 animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="w-1 h-1 rounded-full bg-rest-accent/40 animate-pulse" />
              </div>
              <span className="text-rest-text-muted text-[10px]">Sonido de respiración activo</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {completed ? (
            <button onClick={start} className="px-8 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] hover:shadow-[0_0_24px_rgba(0,229,160,0.4)] hover:scale-105">
              Repetir
            </button>
          ) : running ? (
            <>
              <button onClick={pause} className="px-6 py-3 bg-black/30 text-rest-accent font-semibold rounded-xl hover:bg-black/40 hover:scale-105 transition-all shadow-[0_2px_6px_rgba(0,0,0,0.3)] flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                Pausar
              </button>
              <button onClick={() => { reset(); }} className="px-6 py-3 hover:text-red-400 text-rest-text-secondary rounded-xl transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Reiniciar
              </button>
            </>
          ) : started ? (
            <button onClick={resume} className="px-8 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] hover:shadow-[0_0_24px_rgba(0,229,160,0.4)] hover:scale-105 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Reanudar
            </button>
          ) : (
            <button onClick={start} className="px-10 py-4 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(0,229,160,0.35)] hover:shadow-[0_0_30px_rgba(0,229,160,0.5)] hover:scale-105 flex items-center gap-3 text-base">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Comenzar
            </button>
          )}
        </div>

        {completed && (
          <div className="mt-6 text-center">
            <svg className="w-12 h-12 text-rest-accent mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-rest-accent font-medium">Sesión completada</p>
            <p className="text-rest-text-muted text-xs mt-1">
              {formatTime(sessionSeconds)} de {config.name.toLowerCase()} · {totalCycles} ciclos
            </p>
          </div>
        )}
      </div>

      {/* When to use */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/10 to-rest-accent/5">
        <p className="text-sm">
          <span className="font-medium text-rest-accent">Cuándo usar: </span>
          <span className="text-rest-text-secondary">
            Realiza este ejercicio antes de dormir, en un ambiente tranquilo y con las luces bajas.
            También puedes usarlo si te despiertas durante la noche.
          </span>
        </p>
      </div>
    </div>
  );
}
