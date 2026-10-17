// Checklist semanal del Plan 21 días: un pilar por semana.
// Lo usa la página del checklist y el cierre del día 21 (para medir adherencia).

export const CHECKLIST_KEY = "rest-checklist-semanal";

export type WeekKey = 1 | 2 | 3;

export const plan: Record<WeekKey, { title: string; focus: string; color: string; tasks: { text: string; category: string }[] }> = {
  1: {
    title: "Semana 1 — Ritmo Circadiano",
    focus: "Regular el ritmo circadiano: exposición a luz matinal, horarios estables y rutina nocturna de respiración.",
    color: "from-rest-accent to-emerald-400",
    tasks: [
      { text: "Despertar a la misma hora todos los días (±30 min)", category: "Ritmo" },
      { text: "Luz solar exterior 10-20 min en la primera hora", category: "Ritmo" },
      { text: "Bajar luces 2-3 horas antes de dormir", category: "Entorno" },
      { text: "Pantallas apagadas 60-90 min antes de dormir", category: "Entorno" },
      { text: "Dormitorio oscuro (antifaz si es necesario)", category: "Entorno" },
      { text: "Respiración 4-7-8 antes de dormir (5 min)", category: "Respiración" },
      { text: "Acostarse a la misma hora todos los días", category: "Ritmo" },
      { text: "Evitar cafeína después de las 15:00", category: "Alimentación" },
      { text: "Actividad física mínima 30 min (fuerza o caminata)", category: "Movimiento" },
    ],
  },
  2: {
    title: "Semana 2 — Alimentación",
    focus: "Mantener hábitos de semana 1 + mejorar alimentación nocturna: eliminar factores inflamatorios y estimulantes.",
    color: "from-teal-400 to-cyan-400",
    tasks: [
      { text: "Mantener horario fijo de sueño", category: "Ritmo" },
      { text: "Luz matinal diaria", category: "Ritmo" },
      { text: "Cena antiinflamatoria (ver plan nutricional)", category: "Alimentación" },
      { text: "Evitar ultraprocesados y azúcar", category: "Alimentación" },
      { text: "Incorporar fibra gradualmente", category: "Alimentación" },
      { text: "Una porción de fermentados al día", category: "Alimentación" },
      { text: "Evitar alcohol", category: "Alimentación" },
      { text: "Cenar al menos 2-3 horas antes de dormir", category: "Alimentación" },
      { text: "Respiración diafragmática 5 min antes de dormir", category: "Respiración" },
      { text: "30 plantas variadas en la semana", category: "Alimentación" },
    ],
  },
  3: {
    title: "Semana 3 — Consolidación",
    focus: "Consolidar pausas diurnas, respetar ritmos ultradianos y mantener consistencia de todos los hábitos.",
    color: "from-blue-400 to-indigo-400",
    tasks: [
      { text: "Mantener todos los hábitos de semanas 1 y 2", category: "General" },
      { text: "Trabajar en bloques de 90 min con pausas", category: "Timing" },
      { text: "Pausas activas: respiración o caminata breve", category: "Timing" },
      { text: "Dormir en múltiplos de 90 min (6h, 7.5h, 9h)", category: "Timing" },
      { text: "No forzar concentración — respetar ciclos", category: "Timing" },
      { text: "Revisar progreso y ajustar lo que necesites", category: "General" },
    ],
  },
};

export const CHECKLIST_TOTAL = Object.values(plan).reduce((acc, w) => acc + w.tasks.length, 0);
