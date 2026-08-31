import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, updateUser } from "../../../lib/supabase";
import { Resend } from "resend";
import crypto from "crypto";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://metodorest.cl";

export async function POST(req: NextRequest) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const { email } = body;
  if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });
  const user = await findUserByEmail(email);
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 3600000).toISOString();
  await updateUser(user.id, { reset_token: token, reset_expiry: expiry });

  if (resend) {
    try {
      await resend.emails.send({
        from: "Método R.E.S.T. <no-reply@metodorest.cl>", replyTo: "metodorest@gmail.com", to: email,
        subject: "Recupera tu contraseña — Método R.E.S.T.",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#060E0E;color:#E8F0F0;border-radius:16px"><img src="${BASE_URL}/logo.svg" alt="Método R.E.S.T." style="height:48px;margin-bottom:24px" /><h2 style="color:#00E5A0;margin:0 0 16px">Recuperar contraseña</h2><p style="color:#A0B0B0;line-height:1.6">Haz clic en el botón para crear una nueva contraseña:</p><a href="${BASE_URL}/recuperar?token=${token}" style="display:inline-block;margin:24px 0;padding:14px 32px;background:#00E5A0;color:#060E0E;text-decoration:none;border-radius:12px;font-weight:600">Restablecer contraseña</a><p style="color:#607070;font-size:13px">Este enlace expira en 1 hora.</p></div>`,
      });
    } catch { /* silent */ }
  }
  return NextResponse.json({ ok: true });
}
