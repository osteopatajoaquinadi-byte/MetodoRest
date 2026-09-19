// Interpretación por dominio del RESET-Q, en tono cálido con base clínica (chileno).
// Se usa en la landing (resumen) y en el correo de lead (desglose completo).

export interface DominioInterpretacion {
  key: string;
  label: string;
  max: number;
  nivel: (score: number) => "bajo" | "medio" | "alto";
  texto: (score: number) => string;
}

function nivelLikert(score: number): "bajo" | "medio" | "alto" {
  if (score <= 5) return "bajo";
  if (score <= 10) return "medio";
  return "alto";
}

export const DOMINIOS_INTERP: Record<"H" | "A" | "R" | "I", DominioInterpretacion> = {
  H: {
    key: "H",
    label: "Cuando cierras los ojos",
    max: 16,
    nivel: nivelLikert,
    texto: (s) => {
      if (s <= 5) return "Tu mente logra desconectarse al final del día. Cuando te acuestas, tu cabeza acompaña a tu cuerpo hacia el descanso. Eso es una base valiosa.";
      if (s <= 10) return "A veces tu mente sigue activa cuando tu cuerpo ya quiere descansar. Aparecen pensamientos, vueltas, cierta dificultad para apagar el día. No es grave, pero es una señal de que tu sistema tarda en cambiar de marcha.";
      return "Tu cuerpo se acuesta agotado, pero tu mente sigue encendida. Repasas pendientes, das vueltas, y aunque duermas las horas, despiertas sin sentir que descansaste. Es el patrón de \"cuerpo cansado, mente prendida\", y tiene solución.";
    },
  },
  A: {
    key: "A",
    label: "Lo que siente tu cuerpo",
    max: 16,
    nivel: nivelLikert,
    texto: (s) => {
      if (s <= 5) return "Tu cuerpo muestra pocas señales de tensión sostenida. Logra relajarse y bajar la guardia. Buena noticia.";
      if (s <= 10) return "Tu cuerpo carga algo de tensión que no termina de soltar: quizás en la mandíbula, el cuello, o esa sensación de estar un poco activado sin razón clara. Son señales de un sistema que no baja del todo.";
      return "Tu cuerpo no logra bajar la guardia. La tensión, las palpitaciones o el frío en manos y pies son señales de un sistema en modo defensa, incluso cuando debería estar en calma. No está en tu cabeza: tu cuerpo te está hablando.";
    },
  },
  R: {
    key: "R",
    label: "Tu energía durante el día",
    max: 16,
    nivel: nivelLikert,
    texto: (s) => {
      if (s <= 5) return "Tu energía durante el día se ve estable y bien sincronizada. Arrancas y te recuperas sin grandes altibajos.";
      if (s <= 10) return "Tu ritmo de energía tiene algunos altibajos: quizás dependes del café para arrancar, o sientes bajones marcados. Son señales de que tu reloj interno necesita un poco de orden.";
      return "Tu energía está desregulada. Te cuesta arrancar, te desplomas en la tarde, y cualquier estrés te deja dando vueltas por horas. Tu reloj interno viene funcionando en reserva, y se puede reordenar.";
    },
  },
  I: {
    key: "I",
    label: "Tu noche",
    max: 16,
    nivel: nivelLikert,
    texto: (s) => {
      if (s <= 5) return "No aparecen dificultades importantes para dormir. Concilias, mantienes el sueño y despiertas relativamente descansado.";
      if (s <= 10) return "Aparecen dificultades de sueño de a ratos: te cuesta conciliar algunas noches, o te despiertas y te cuesta volver. No es constante, pero está ahí.";
      return "Tu sueño está costando: para quedarte dormido, para mantenerte, o para sentir que descansaste. Estas dificultades son frecuentes, y son justamente el centro de lo que el método trabaja.";
    },
  },
};

// Dominio B (respiratorio) tiene su propia lógica: 0-1 sin señales, 2 advertencia, 3+ derivación
export function interpretacionB(scoreB: number): { nivel: "ok" | "warning" | "derivacion"; texto: string } {
  if (scoreB >= 3) return {
    nivel: "derivacion",
    texto: "Algunas de tus respuestas (como ronquidos fuertes o pausas al respirar) sugieren que vale la pena una revisión médica. El método puede acompañarte, pero si todavía no lo hiciste, agendar una consulta es la prioridad para cuidarte bien.",
  };
  if (scoreB === 2) return {
    nivel: "warning",
    texto: "Aparece alguna señal respiratoria que conviene tener en cuenta. No es para alarmarse, pero vale la pena comentarlo con un médico en tu próximo control.",
  };
  return {
    nivel: "ok",
    texto: "No aparecen señales de alarma respiratoria. Tu descanso no muestra indicios de problemas de respiración durante el sueño.",
  };
}

export function textoNivel(s: "bajo" | "medio" | "alto"): string {
  return s === "bajo" ? "Normal" : s === "medio" ? "Moderado" : "Alto";
}
