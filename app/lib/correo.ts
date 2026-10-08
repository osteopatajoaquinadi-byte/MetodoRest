import type { Resend } from "resend";

/* Remitente de todos los correos de la plataforma.
   Se envía desde sakrosresearch.cl. Mientras ese dominio no esté verificado
   en Resend, Resend rechaza el envío y se reintenta desde metodorest.cl,
   así ningún correo se pierde durante el cambio. */

const NOMBRE = "Sakros Research";
export const REMITENTE = `${NOMBRE} <no-reply@sakrosresearch.cl>`;
const REMITENTE_RESPALDO = `${NOMBRE} <no-reply@metodorest.cl>`;

type Correo = Parameters<Resend["emails"]["send"]>[0];

export async function enviarCorreo(resend: Resend, correo: Correo) {
  const r = await resend.emails.send({ ...correo, from: REMITENTE });
  if (r.error && /domain|verif/i.test(r.error.message)) {
    return resend.emails.send({ ...correo, from: REMITENTE_RESPALDO });
  }
  return r;
}
