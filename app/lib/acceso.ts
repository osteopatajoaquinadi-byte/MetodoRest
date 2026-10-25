// Creación de cuentas y correos de acceso al Método R.E.S.T.
// Lo usan el webhook de Hotmart y el acceso manual desde el panel de admin
// (por ejemplo, ventas cobradas por Mercado Pago).
import { Resend } from "resend";
import crypto from "crypto";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://metodorest.cl";

export function generatePassword(): string { return crypto.randomBytes(4).toString("hex"); }

// Devuelve true si el correo se envió.
export async function sendAccessEmail(email: string, password: string): Promise<boolean> {
  if (!resend) { console.error("[hotmart] RESEND no configurado, no se envia correo"); return false; }
  try {
    await resend.emails.send({
      from: "Método R.E.S.T. <no-reply@metodorest.cl>", replyTo: "metodorest@gmail.com", to: email,
      subject: "Tu acceso al Método R.E.S.T. está listo",
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#060E0E;color:#E8F0F0;border-radius:16px"><img src="${BASE_URL}/logo.svg" alt="Método R.E.S.T." style="height:48px;margin-bottom:24px" /><h2 style="color:#00E5A0;margin:0 0 16px">¡Bienvenido/a al Método R.E.S.T.!</h2><p style="color:#A0B0B0;line-height:1.6">Tu compra fue confirmada. Aquí están tus datos de acceso:</p><div style="margin:24px 0;padding:20px;background:#0A1E1E;border-radius:12px;border:1px solid rgba(0,229,160,0.15)"><p style="margin:0 0 8px;color:#607070;font-size:13px">Email</p><p style="margin:0 0 16px;color:#E8F0F0;font-weight:600">${email}</p><p style="margin:0 0 8px;color:#607070;font-size:13px">Contraseña temporal</p><p style="margin:0;color:#00E5A0;font-weight:600;font-size:18px;letter-spacing:2px">${password}</p></div><a href="${BASE_URL}/login" style="display:inline-block;margin:16px 0;padding:14px 32px;background:#00E5A0;color:#060E0E;text-decoration:none;border-radius:12px;font-weight:600">Ingresar a la plataforma</a><p style="color:#607070;font-size:13px;margin-top:16px">Te recomendamos cambiar tu contraseña después del primer inicio de sesión.</p></div>`,
    });
    return true;
  } catch (err) {
    console.error("[hotmart] error enviando correo:", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function sendUpgradeEmail(email: string) {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: "Método R.E.S.T. <no-reply@metodorest.cl>", replyTo: "metodorest@gmail.com", to: email,
      subject: "Desbloqueaste el Método R.E.S.T. completo",
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#060E0E;color:#E8F0F0;border-radius:16px"><img src="${BASE_URL}/logo.svg" alt="Método R.E.S.T." style="height:48px;margin-bottom:24px" /><h2 style="color:#00E5A0;margin:0 0 16px">¡Ya tienes el método completo!</h2><p style="color:#A0B0B0;line-height:1.6">Tu compra fue confirmada. Ahora tienes acceso a todo el Método R.E.S.T.: las respiraciones guiadas, el plan de 21 días, el plan nutricional nocturno, la relajación progresiva y el seguimiento completo de tu progreso.</p><p style="color:#A0B0B0;line-height:1.6">Entra con el mismo email y contraseña que ya usabas.</p><a href="${BASE_URL}/login" style="display:inline-block;margin:16px 0;padding:14px 32px;background:#00E5A0;color:#060E0E;text-decoration:none;border-radius:12px;font-weight:600">Ir a la plataforma</a></div>`,
    });
  } catch (err) {
    console.error("[hotmart] error enviando correo upgrade:", err instanceof Error ? err.message : err);
  }
}
