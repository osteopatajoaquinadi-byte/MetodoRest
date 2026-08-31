export interface HabitDefinition {
  id: string;
  text: string;
  category: string;
  weeks: number[];
}

export const habits: HabitDefinition[] = [
  // Semana 1 — Ritmo Circadiano
  { id: "luz-solar", text: "Luz solar 10-20 min al despertar", category: "Ritmo", weeks: [1, 2, 3] },
  { id: "despertar-fijo", text: "Despertar a la misma hora (±30 min)", category: "Ritmo", weeks: [1, 2, 3] },
  { id: "acostarse-fijo", text: "Acostarse a la misma hora", category: "Ritmo", weeks: [1, 2, 3] },
  { id: "dormitorio-oscuro", text: "Dormitorio oscuro (antifaz si es necesario)", category: "Entorno", weeks: [1, 2, 3] },
  { id: "sin-pantallas", text: "Pantallas apagadas 60 min antes / Lentes blue-light", category: "Entorno", weeks: [1, 2, 3] },
  { id: "bajar-luces", text: "Bajar luces 2-3 horas antes de dormir", category: "Entorno", weeks: [1, 2, 3] },
  { id: "respiracion", text: "Respiración 4-7-8 / Diafragmática / Relajación progresiva", category: "Respiración", weeks: [1, 2, 3] },
  { id: "sin-cafeina", text: "Sin cafeína después de las 15:00", category: "Alimentación", weeks: [1, 2, 3] },
  { id: "ejercicio", text: "Actividad física mínimo 30 min", category: "Movimiento", weeks: [1, 2, 3] },

  // Semana 2 — Alimentación
  { id: "cena-temprana", text: "Cenar 2-3 horas antes de dormir", category: "Alimentación", weeks: [2, 3] },
  { id: "cena-antiinflamatoria", text: "Cena antiinflamatoria (ver plan nutricional)", category: "Alimentación", weeks: [2, 3] },
  { id: "sin-ultraprocesados", text: "Evitar ultraprocesados y azúcar", category: "Alimentación", weeks: [2, 3] },
  { id: "sin-alcohol", text: "Evitar alcohol", category: "Alimentación", weeks: [2, 3] },
  { id: "fermentados", text: "Una porción de fermentados al día", category: "Alimentación", weeks: [2, 3] },
  { id: "30-plantas", text: "30 plantas variadas en la semana", category: "Alimentación", weeks: [2, 3] },

  // Semana 3 — Consolidación
  { id: "bloques-90min", text: "Trabajar en bloques de 90 min con pausas", category: "Timing", weeks: [3] },
  { id: "pausas-activas", text: "Pausas activas: respiración o caminata", category: "Timing", weeks: [3] },
  { id: "dormir-multiplos", text: "Dormir en múltiplos de 90 min (6h, 7.5h, 9h)", category: "Timing", weeks: [3] },
];

export function getHabitsForWeek(week: number): HabitDefinition[] {
  return habits.filter((h) => h.weeks.includes(week));
}

export const weekTips: Record<number, { title: string; text: string }> = {
  1: {
    title: "Tip de la semana 1",
    text: "Enfócate en regular tu ritmo circadiano. La luz solar matutina y los horarios fijos son tu mejor herramienta esta semana.",
  },
  2: {
    title: "Tip de la semana 2",
    text: "Esta semana enfócate en tu alimentación nocturna. Evita carbohidratos refinados y cenas pesadas. La insulina alta disminuye la secreción de melatonina.",
  },
  3: {
    title: "Tip de la semana 3",
    text: "Consolida todos tus hábitos y respeta los ritmos ultradianos. Trabaja en bloques de 90 minutos y descansa entre ellos.",
  },
};
