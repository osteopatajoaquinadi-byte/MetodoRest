// Ofertas y recomendación según el resultado del RESET-Q.
// Se usa en la pantalla de resultado (cliente) y en los correos de seguimiento (servidor).

export const HOTMART = {
  ebook: "https://pay.hotmart.com/N107478696O?off=1xspnyoc",
  metodo: "https://pay.hotmart.com/L105253165X?off=z03q3xpq",
};

// El acompañado se conversa por Instagram: al escribir "sueño", el asistente
// explica el programa, agenda la sesión y envía el pago solo si la persona acepta.
export const ACOMPANADO_URL = "https://ig.me/m/osteojuaco";

export type Nivel = "medico" | "leve" | "moderado" | "alto";

// Puntaje global sobre 64. SAFETY (señales respiratorias) va primero a revisión médica.
export function nivelResultado(phenotype: string, global: number): Nivel {
  if (phenotype === "SAFETY") return "medico";
  if (global >= 43) return "alto";
  if (global >= 22) return "moderado";
  return "leve";
}

// Agrega el cupón de Hotmart a un link de pago.
export function conCupon(url: string, cupon: string): string {
  return `${url}&offDiscount=${encodeURIComponent(cupon)}`;
}
