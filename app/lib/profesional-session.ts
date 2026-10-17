import { createHmac, timingSafeEqual } from "node:crypto";

/* Sesión del acceso profesional.
   Cookie firmada con HMAC-SHA256. La clave es PRO_SESSION_SECRET si existe;
   si no, se deriva de SUPABASE_SERVICE_ROLE_KEY (secreto de servidor que ya
   está en Vercel), así el acceso funciona sin configurar nada más.
   Solo guarda id, nombre y vencimiento: nada clínico. */

export const PRO_COOKIE = "rest-pro";
export const PRO_SESSION_DAYS = 7;

export interface ProSession {
  uid: string;
  nombre: string;
  exp: number; // epoch ms
}

function secret(): string | null {
  const s = process.env.PRO_SESSION_SECRET;
  if (s && s.length >= 32) return s;
  // Clave derivada: nunca expone la service role key, y rotarla cierra todas las sesiones.
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (service && service.length >= 32) {
    return createHmac("sha256", service).update("metodorest:acceso-profesional:v1").digest("base64url");
  }
  return null;
}

export function proAccessConfigured(): boolean {
  return secret() !== null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function createProToken(uid: string, nombre: string): string | null {
  const key = secret();
  if (!key) return null;
  const session: ProSession = { uid, nombre, exp: Date.now() + PRO_SESSION_DAYS * 24 * 60 * 60 * 1000 };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload, key)}`;
}

export function verifyProToken(token: string | undefined | null): ProSession | null {
  const key = secret();
  if (!key || !token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload, key);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as ProSession;
    if (typeof session.exp !== "number" || session.exp < Date.now()) return null;
    if (typeof session.uid !== "string" || typeof session.nombre !== "string") return null;
    return session;
  } catch {
    return null;
  }
}
