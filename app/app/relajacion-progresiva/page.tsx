"use client";

import { useState, useRef, useEffect } from "react";

const muscleGroups = [
  { name: "Manos y antebrazos", instruction: "Cierra los puños con fuerza durante 5-7 segundos. Luego suelta y siente la diferencia durante 20-30 segundos.", duration: "~1 min" },
  { name: "Bíceps", instruction: "Flexiona ambos brazos llevando las manos hacia los hombros. Tensa los bíceps 5-7 segundos, luego relaja.", duration: "~1 min" },
  { name: "Frente y cuero cabelludo", instruction: "Levanta las cejas lo más alto posible. Mantén 5-7 segundos. Suelta y siente la frente relajarse.", duration: "~1 min" },
  { name: "Ojos y nariz", instruction: "Cierra los ojos con fuerza y arruga la nariz. Mantén 5-7 segundos. Relaja y nota la suavidad.", duration: "~1 min" },
  { name: "Mandíbula y boca", instruction: "Aprieta los dientes y estira las comisuras. Mantén 5-7 segundos. Abre ligeramente la boca al relajar.", duration: "~1 min" },
  { name: "Cuello", instruction: "Inclina la cabeza hacia atrás suavemente, presionando contra la almohada o respaldo. Mantén 5-7 segundos. Vuelve al centro.", duration: "~1 min" },
  { name: "Hombros y trapecios", instruction: "Sube los hombros hacia las orejas lo más alto posible. Mantén 5-7 segundos. Déjalos caer de golpe.", duration: "~1 min" },
  { name: "Pecho y espalda", instruction: "Inhala profundo y arquea ligeramente la espalda, juntando los omóplatos. Mantén 5-7 segundos. Exhala y relaja.", duration: "~1 min" },
  { name: "Abdomen", instruction: "Contrae el abdomen como si fueras a recibir un golpe. Mantén 5-7 segundos. Suelta completamente.", duration: "~1 min" },
  { name: "Muslos", instruction: "Extiende las piernas y tensa los muslos presionando las rodillas hacia abajo. Mantén 5-7 segundos. Relaja.", duration: "~1 min" },
  { name: "Pantorrillas", instruction: "Apunta los dedos de los pies hacia la cabeza (dorsiflexión). Mantén 5-7 segundos. Suelta.", duration: "~1 min" },
  { name: "Pies", instruction: "Curva los dedos de los pies hacia abajo con fuerza. Mantén 5-7 segundos. Relaja completamente.", duration: "~1 min" },
];

export default function RelajacionProgresivaPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setAudioProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const toggleComplete = (index: number) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const progress = muscleGroups.length > 0 ? Math.round((completed.size / muscleGroups.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Relajación progresiva</h1>
        <p className="text-rest-text-muted mt-1">Técnica de Jacobson — libera tensión muscular grupo por grupo</p>
      </div>

      {/* Intro */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/10 to-rest-accent/5">
        <p className="text-sm text-rest-text-secondary leading-relaxed">
          <span className="font-medium text-rest-text">La relajación progresiva de Jacobson</span>{" "}
          consiste en tensar deliberadamente cada grupo muscular durante 5-7 segundos y luego soltarlo.
          El contraste entre tensión y relajación enseña a tu cuerpo a reconocer y liberar la tensión acumulada.
          Ideal antes de dormir: reduce cortisol, activa el sistema parasimpático y prepara el cuerpo para el descanso.
        </p>
      </div>

      {/* Audio guiado */}
      <div className="p-5 rounded-2xl glass-card border border-rest-accent/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rest-accent/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M9 12H5l4-8v8z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm text-white">Audio guiado — Relajación Progresiva de Jacobson</p>
            <p className="text-rest-text-muted text-xs">10 minutos · Guía de voz para seguir paso a paso</p>
          </div>
        </div>
        <audio
          ref={audioRef}
          src="/audio/relajacion-progresiva.mp3"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!audioRef.current) return;
              if (isPlaying) { audioRef.current.pause(); }
              else { if (audioRef.current.currentTime < 240) audioRef.current.currentTime = 240; audioRef.current.play(); }
            }}
            className="shrink-0 w-12 h-12 rounded-full bg-rest-accent flex items-center justify-center hover:bg-rest-accent/80 transition shadow-[0_0_15px_rgba(0,229,160,0.3)]"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-rest-bg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-rest-bg ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div className="flex-1">
            <div
              className="h-2 bg-black/40 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                if (!audioRef.current || !duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
              }}
            >
              <div className="h-full bg-rest-accent rounded-full transition-[width] duration-200" style={{ width: `${audioProgress}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-rest-text-muted">{formatTime(currentTime)}</span>
              <span className="text-[10px] text-rest-text-muted">{duration ? formatTime(duration) : "—:——"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-5 rounded-2xl glass-card">
        <h2 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Cómo practicar
        </h2>
        <div className="space-y-2 text-sm text-rest-text-secondary">
          <p>1. Acuéstate boca arriba en un lugar cómodo y oscuro.</p>
          <p>2. Cierra los ojos y haz 3 respiraciones profundas.</p>
          <p>3. Sigue cada grupo muscular en orden, de arriba hacia abajo.</p>
          <p>4. <span className="text-rest-accent font-medium">Tensa 5-7 segundos</span> → <span className="text-rest-text font-medium">Relaja 20-30 segundos</span>.</p>
          <p>5. Nota la diferencia entre tensión y relajación en cada zona.</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 p-4 rounded-xl glass-card">
        <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-[#00E5A0] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(0,229,160,0.5)]" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm font-medium text-rest-accent">{completed.size}/{muscleGroups.length}</span>
      </div>

      {/* Guía de voz integrada */}
      <div className="p-5 rounded-2xl glass-card">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-rest-accent/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm text-white">Guía paso a paso</p>
            <p className="text-rest-text-muted text-xs">Selecciona cada grupo muscular y sigue las instrucciones de voz</p>
          </div>
        </div>
        <p className="text-rest-text-secondary text-sm leading-relaxed">
          Toca cada grupo muscular de la lista para ver las instrucciones detalladas.
          Tensa durante <span className="text-rest-accent font-medium">5-7 segundos</span>, luego relaja durante <span className="text-white font-medium">20-30 segundos</span>.
          Marca cada grupo como completado antes de pasar al siguiente.
        </p>
      </div>

      {/* Muscle groups */}
      <div>
        <h2 className="font-semibold text-lg mb-4 text-white">Grupos musculares</h2>
        <div className="space-y-2">
          {muscleGroups.map((group, i) => {
            const isActive = activeStep === i;
            const isDone = completed.has(i);

            return (
              <button
                key={i}
                onClick={() => setActiveStep(isActive ? null : i)}
                className={`w-full text-left rounded-xl transition-all ${
                  isActive ? "bg-rest-accent/10 shadow-[0_0_12px_rgba(0,229,160,0.1),inset_0_0_0_1px_rgba(0,229,160,0.15)]" : "glass-card hover:bg-rest-accent/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3 p-4">
                  <div
                    onClick={(e) => { e.stopPropagation(); toggleComplete(i); }}
                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition ${
                      isDone ? "habit-checkbox-checked" : "border-2 habit-checkbox-unchecked"
                    }`}
                  >
                    {isDone ? (
                      <svg className="w-4 h-4 text-rest-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold text-rest-text-muted">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${isDone ? "line-through text-rest-text-muted" : "text-white"}`}>
                      {group.name}
                    </p>
                  </div>
                  <span className="text-[10px] text-rest-text-muted">{group.duration}</span>
                  <svg className={`w-4 h-4 text-rest-text-muted transition-transform ${isActive ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {isActive && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="p-4 rounded-lg bg-black/20 ml-10">
                      <p className="text-sm text-rest-text-secondary leading-relaxed">{group.instruction}</p>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/10 to-rest-accent/5">
        <p className="text-sm text-rest-text-secondary leading-relaxed">
          <span className="font-medium text-rest-text">Consejo:</span>{" "}
          Con la práctica, podrás relajar grupos musculares sin necesidad de tensarlos primero.
          Empieza con la versión completa (12 grupos, ~15 min) y progresa hacia la versión abreviada (4 grupos, ~5 min).
        </p>
      </div>
    </div>
  );
}
