// Eventos de Google Analytics. No hace nada si GA no está cargado.
export function track(evento: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", evento, params);
}

// Clasifica los links de compra y de contacto para el evento "clic_oferta".
export function productoDeLink(href: string): string | null {
  if (href.includes("L105253165X")) return "metodo";
  if (href.includes("N107478696O")) return "ebook";
  if (href.includes("P107616181R")) return "upgrade";
  if (href.includes("ig.me/m/osteojuaco")) return "acompanado";
  return null;
}
