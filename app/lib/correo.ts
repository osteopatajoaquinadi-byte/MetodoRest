import type { Resend } from "resend";

/* Remitente de todos los correos de la plataforma.
   sakros.cl está verificado en Resend; el "responder" de cada correo
   se define en cada envío. */

export const REMITENTE = "Sakros Research <no-reply@sakros.cl>";

type Correo = Parameters<Resend["emails"]["send"]>[0];

export function enviarCorreo(resend: Resend, correo: Correo) {
  return resend.emails.send({ ...correo, from: REMITENTE });
}
