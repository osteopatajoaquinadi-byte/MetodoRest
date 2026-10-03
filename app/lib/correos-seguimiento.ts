// Correos posteriores al RESET-Q: recomendación según nivel (va dentro del correo
// del resultado), consejo útil (día 2) y oferta con plazo (día 5, 72 horas).

import { ACOMPANADO_URL, HOTMART, conCupon, type Nivel } from "./oferta";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://metodorest.cl";
const DESCUENTO = "20%";
const PLAZO_HORAS = 72;

const boton = (href: string, texto: string) =>
  `<a href="${href}" style="display:inline-block;padding:14px 32px;background:#00E5A0;color:#060E0E;text-decoration:none;border-radius:12px;font-weight:600">${texto}</a>`;

const enlaceSecundario = (href: string, texto: string) =>
  `<p style="margin:14px 0 0"><a href="${href}" style="color:#00E5A0;font-size:14px">${texto}</a></p>`;

const pie = `<p style="color:#506070;font-size:11px;line-height:1.5;margin-top:28px">Recibes este correo porque hiciste el test RESET-Q en metodorest.cl. Si no quieres recibir más correos, responde con la palabra BAJA.</p>`;

export function plantilla(contenido: string): string {
  return `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#060E0E;color:#E0E6EB;border-radius:16px">
    <img src="${BASE_URL}/logo.svg" alt="Método R.E.S.T." style="height:44px;margin-bottom:24px" />
    ${contenido}
    ${pie}
  </div>`;
}

// Bloque de recomendación del correo del resultado.
export function recomendacionHTML(nivel: Nivel): string {
  const p = (t: string) => `<p style="color:#E0E6EB;font-size:15px;line-height:1.6;margin:0 0 20px">${t}</p>`;
  switch (nivel) {
    case "alto":
      return (
        p("Tus respuestas muestran que hoy tu descanso te está costando bastante. En estos casos suele ayudar no hacerlo solo: el <strong>Método R.E.S.T. acompañado</strong> incluye una sesión online conmigo y 21 días de seguimiento por WhatsApp, con respuesta diaria en horario laboral.") +
        p("Si te interesa, escríbeme la palabra <strong>SUEÑO</strong> por Instagram y te cuento cómo funciona.") +
        boton(ACOMPANADO_URL, "Escribir SUEÑO por Instagram") +
        enlaceSecundario(HOTMART.metodo, "Prefiero hacer el Método por mi cuenta · $39.990")
      );
    case "moderado":
      return (
        p("Tu patrón responde bien a un plan guiado. El Método R.E.S.T. tiene un plan de 21 días diseñado para trabajar exactamente lo que aparece en tu resultado.") +
        boton(HOTMART.metodo, "Acceder al Método · $39.990") +
        enlaceSecundario(HOTMART.ebook, "O empezar solo con el ebook · $14.990")
      );
    case "leve":
      return (
        p("Partes desde una buena base. Si quieres afinar tu descanso por tu cuenta, el ebook del Método R.E.S.T. es el mejor punto de partida.") +
        boton(HOTMART.ebook, "Obtener el ebook · $14.990") +
        enlaceSecundario(`${BASE_URL}/#precio`, "Ver todas las opciones")
      );
    case "medico":
      return (
        p("Lo primero es que un médico revise las señales respiratorias que marcaste. El Método R.E.S.T. puede complementar ese proceso cuando ya estés en control.") +
        boton(`${BASE_URL}/#precio`, "Conocer el Método R.E.S.T.")
      );
  }
}

const CONSEJOS: Record<string, { asunto: string; titulo: string; pasos: string[] }> = {
  "SR-1": {
    asunto: "Un ejercicio para cuando tu mente no se apaga",
    titulo: "Descarga tu mente antes de acostarte",
    pasos: [
      "Una o dos horas antes de dormir, toma una hoja y escribe durante 10 minutos todo lo que tienes pendiente o dando vueltas.",
      "Al lado de cada pendiente anota el primer paso concreto y cuándo lo harás. No tienes que resolverlo hoy.",
      "Ya en la cama, respira lento: inhala en 4 tiempos y exhala en 6, durante 5 minutos. La exhalación larga le indica a tu sistema nervioso que puede bajar la guardia.",
    ],
  },
  "SR-2": {
    asunto: "Un ejercicio para soltar la tensión del cuerpo",
    titulo: "Relajación progresiva en 10 minutos",
    pasos: [
      "Acostado, aprieta los pies con fuerza durante 5 segundos y suelta de golpe. Quédate 15 segundos notando la diferencia.",
      "Sube por el cuerpo con el mismo ritmo: pantorrillas, muslos, glúteos, abdomen, manos, hombros, mandíbula y frente.",
      "Termina con 5 respiraciones lentas, exhalando más largo de lo que inhalas.",
    ],
  },
  "SR-3": {
    asunto: "Un hábito para ordenar tu energía",
    titulo: "Ordena tu reloj interno desde la mañana",
    pasos: [
      "Despiértate a la misma hora todos los días, incluso el fin de semana (con un margen de 30 minutos).",
      "Sal a la luz natural 10 a 15 minutos dentro de la primera hora después de despertar, sin lentes de sol.",
      "Deja el último café antes de las 14:00. La cafeína sigue actuando muchas horas después.",
    ],
  },
  "SR-4": {
    asunto: "Un hábito para frenar el desgaste",
    titulo: "Pausas de recuperación durante el día",
    pasos: [
      "Programa tres pausas de 2 minutos en tu día: media mañana, después de almuerzo y al terminar tu jornada.",
      "En cada pausa, aleja la vista de la pantalla y respira lento: inhala en 4 tiempos, exhala en 6.",
      "En la noche, cena liviano al menos 2 horas antes de acostarte.",
    ],
  },
  "SR-5": {
    asunto: "Cómo proteger lo que ya funciona",
    titulo: "Protege tu buen descanso",
    pasos: [
      "Mantén una hora fija para despertar: es el ancla de tu reloj interno.",
      "Busca luz natural en la mañana y baja las luces la última hora antes de dormir.",
      "Cuando tengas una semana de estrés, adelanta tu rutina de descanso en vez de recortarla.",
    ],
  },
  SAFETY: {
    asunto: "Mientras agendas tu revisión médica",
    titulo: "Cuida tu respiración durante el sueño",
    pasos: [
      "Agenda una consulta médica y cuéntale lo que marcaste en el test (ronquidos fuertes, pausas al respirar o despertar cansado).",
      "Evita el alcohol en las horas antes de dormir: relaja la vía aérea y empeora los ronquidos.",
      "Prueba dormir de lado en vez de boca arriba.",
    ],
  },
};

export function correoConsejo(phenotype: string): { subject: string; html: string } {
  const c = CONSEJOS[phenotype] || CONSEJOS["SR-3"];
  const pasos = c.pasos
    .map((t, i) => `<p style="color:#E0E6EB;font-size:15px;line-height:1.6;margin:0 0 14px"><strong style="color:#00E5A0">${i + 1}.</strong> ${t}</p>`)
    .join("");
  return {
    subject: c.asunto,
    html: plantilla(`
      <p style="color:#00E5A0;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">Un consejo para tu perfil</p>
      <h2 style="color:#fff;margin:0 0 16px;font-size:22px">${c.titulo}</h2>
      ${pasos}
      <p style="color:#9BAABD;font-size:14px;line-height:1.6;margin:18px 0 0">Pruébalo durante una semana. Los cambios en el descanso aparecen con la repetición, no en una sola noche.</p>
    `),
  };
}

// Fecha legible en Chile, ej. "lunes 6 de octubre a las 20:00".
function fechaChile(d: Date): string {
  const fecha = d.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Santiago" });
  const hora = d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Santiago" });
  return `${fecha} a las ${hora}`;
}

export function correoOferta(nivel: Nivel, cupon: string, enviaEn: Date): { subject: string; html: string } {
  const vence = new Date(enviaEn.getTime() + PLAZO_HORAS * 3600 * 1000);
  const extraAlto =
    nivel === "alto"
      ? `<p style="color:#9BAABD;font-size:14px;line-height:1.6;margin:22px 0 0">Si prefieres hacerlo acompañado, con una sesión online conmigo y 21 días de seguimiento por WhatsApp, escríbeme <a href="${ACOMPANADO_URL}" style="color:#00E5A0">SUEÑO por Instagram</a>.</p>`
      : "";
  return {
    subject: `${DESCUENTO} de descuento en el Método R.E.S.T. por ${PLAZO_HORAS} horas`,
    html: plantilla(`
      <p style="color:#00E5A0;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">Solo por ${PLAZO_HORAS} horas</p>
      <h2 style="color:#fff;margin:0 0 16px;font-size:22px">${DESCUENTO} de descuento en el Método R.E.S.T.</h2>
      <p style="color:#E0E6EB;font-size:15px;line-height:1.6;margin:0 0 14px">Hace unos días hiciste el test y viste qué está afectando tu descanso. El Método R.E.S.T. es el plan de 21 días para trabajarlo paso a paso: ebook, plataforma, respiraciones guiadas y seguimiento de tus hábitos.</p>
      <p style="color:#E0E6EB;font-size:15px;line-height:1.6;margin:0 0 22px">Con el código <strong style="color:#00E5A0">${cupon}</strong> tienes ${DESCUENTO} de descuento hasta el <strong>${fechaChile(vence)}</strong>. El botón ya lo aplica.</p>
      ${boton(conCupon(HOTMART.metodo, cupon), `Usar mi ${DESCUENTO} de descuento`)}
      ${extraAlto}
      <p style="color:#506070;font-size:12px;line-height:1.5;margin:22px 0 0">Si ya entraste al método, ignora este correo.</p>
    `),
  };
}
