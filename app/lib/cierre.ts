/* ═══════════════════════════════════════════════════════════════
   Cierre del día 21
   Compara la evaluación final con la medición basal y decide qué
   ofrecer: seguir con la plataforma, continuar con un profesional
   de la Red Método REST o repetir los 21 días.
   Puntos de corte provisionales.
   ═══════════════════════════════════════════════════════════════ */

import type { DailyHabitRecord } from "./storage";

/** RESET-Q global (0–64) igual o menor: regulación preservada. */
export const UMBRAL_LOGRADO = 15;
/** Puntos que debe bajar el RESET-Q global respecto de la basal para contar como mejora. */
export const UMBRAL_MEJORA = 5;
/** Porcentaje del plan cumplido para considerar que la persona hizo el método. */
export const UMBRAL_ADHERENCIA = 70;
/** Un día cuenta como cumplido si marcó al menos esta fracción de sus hábitos diarios. */
const FRACCION_DIA_CUMPLIDO = 0.5;
const DIAS_CICLO = 21;

export type ResultadoCierre = "logrado" | "parcial" | "sin_cambio_adherente" | "sin_cambio_no_adherente";

export type OpcionContinuar = "red_presencial" | "rest_acompanado" | "profesional_asociado";

export const OPCIONES: Record<OpcionContinuar, { titulo: string; detalle: string }> = {
  red_presencial: {
    titulo: "Consulta presencial en la Red Método REST",
    detalle: "Un osteópata de la red cerca de ti, para tratar con las manos lo que todavía está alterado.",
  },
  rest_acompanado: {
    titulo: "REST Acompañado",
    detalle: "Consulta online de osteopatía y PNI, y seguimiento por WhatsApp con respuesta una vez al día.",
  },
  profesional_asociado: {
    titulo: "Hora con tu profesional asociado",
    detalle: "Si empezaste con un profesional de la red, retomas con él o ella. Si no, con Joaquín, online o presencial.",
  },
};

export interface Adherencia {
  checklist: number; // % del checklist semanal marcado
  diaria: number; // % de días del ciclo con hábitos diarios cumplidos
  total: number; // el mayor de los dos
}

export function calcularAdherencia(
  checklist: Record<string, boolean>,
  checklistTotal: number,
  habitos: Record<string, DailyHabitRecord>,
  inicioCiclo: string | null,
): Adherencia {
  const marcados = Object.entries(checklist).filter(([k, v]) => v && /^[123]-\d+$/.test(k)).length;
  const pctChecklist = checklistTotal > 0 ? Math.min(100, Math.round((marcados / checklistTotal) * 100)) : 0;

  let diasCumplidos = 0;
  if (inicioCiclo) {
    const inicio = new Date(inicioCiclo);
    if (!Number.isNaN(inicio.getTime())) {
      for (let i = 0; i < DIAS_CICLO; i++) {
        const d = new Date(inicio);
        d.setDate(inicio.getDate() + i);
        const r = habitos[d.toISOString().split("T")[0]];
        if (r && r.totalCount > 0 && r.completedCount / r.totalCount >= FRACCION_DIA_CUMPLIDO) diasCumplidos++;
      }
    }
  }
  const pctDiaria = Math.round((diasCumplidos / DIAS_CICLO) * 100);
  return { checklist: pctChecklist, diaria: pctDiaria, total: Math.max(pctChecklist, pctDiaria) };
}

export function clasificarCierre(basal: number | null, final: number, adherencia: number): ResultadoCierre {
  if (final <= UMBRAL_LOGRADO) return "logrado";
  // Sin medición basal no se puede medir el cambio: se trata como mejora parcial
  // para que igual se pregunte por signos persistentes.
  if (basal === null || basal - final >= UMBRAL_MEJORA) return "parcial";
  return adherencia >= UMBRAL_ADHERENCIA ? "sin_cambio_adherente" : "sin_cambio_no_adherente";
}

/* ── Estado del cierre en el navegador (respuestas y solicitud) ── */

export interface EstadoCierre {
  inicioCiclo: string;
  signosFisicos?: boolean;
  signosDigestivos?: boolean;
  alarmaDigestiva?: boolean;
  quiereProfesional?: boolean; // eligió hablar con un profesional aunque no tenga signos
  solicitud?: { opcion: OpcionContinuar; en: string };
}

const KEY_CIERRE = "rest-cierre-21";

export function getEstadoCierre(inicioCiclo: string): EstadoCierre {
  if (typeof window === "undefined") return { inicioCiclo };
  try {
    const raw = localStorage.getItem(KEY_CIERRE);
    const e = raw ? (JSON.parse(raw) as EstadoCierre) : null;
    return e && e.inicioCiclo === inicioCiclo ? e : { inicioCiclo };
  } catch {
    return { inicioCiclo };
  }
}

export function setEstadoCierre(e: EstadoCierre): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_CIERRE, JSON.stringify(e));
  } catch {
    /* quota */
  }
}
