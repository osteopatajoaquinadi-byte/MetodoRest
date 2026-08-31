import { NextRequest, NextResponse } from "next/server";
import { findUserByResetToken, updateUser } from "../../../lib/supabase";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://metodorest.cl";

export async function POST(req: NextRequest) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const { token, password } = body;
  if (!token || !password) return NextResponse.json({ error: "Token y contraseña requeridos" }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });

  const user = await findUserByResetToken(token);
  if (!user) return NextResponse.json({ error: "Enlace inválido o expirado" }, { status: 400 });
  if (!user.reset_expiry || new Date(user.reset_expiry) < new Date()) return NextResponse.json({ error: "El enlace ha expirado. Solicita uno nuevo." }, { status: 400 });

  const hash = await bcrypt.hash(password, 10);
  await updateUser(user.id, { password_hash: hash, reset_token: null, reset_expiry: null });

  if (resend && user.email) {
    try {
      await resend.emails.send({
        from: "Método R.E.S.T. <no-reply@metodorest.cl>", replyTo: "metodorest@gmail.com", to: user.email,
        subject: "Tu contraseña fue actualizada — Método R.E.S.T.",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#060E0E;color:#E8F0F0;border-radius:16px"><img src="${BASE_URL}/logo.svg" alt="Método R.E.S.T." style="height:48px;margin-bottom:24px" /><h2 style="color:#00E5A0;margin:0 0 16px">Contraseña actualizada</h2><p style="color:#A0B0B0;line-height:1.6">Tu contraseña ha sido cambiada exitosamente.</p><div style="margin:20px 0;padding:16px;background:#0A1E1E;border-radius:12px;border:1px solid rgba(0,229,160,0.15)"><p style="color:#607070;font-size:13px;margin:0 0 8px">Email: <strong style="color:#E8F0F0">${user.email}</strong></p><p style="color:#607070;font-size:13px;margin:0">Nueva contraseña: <strong style="color:#00E5A0">${password}</strong></p></div><a href="${BASE_URL}/login" style="display:inline-block;margin:16px 0 0;padding:12px 28px;background:#00E5A0;color:#060E0E;text-decoration:none;border-radius:12px;font-weight:600;font-size:14px">Ir a iniciar sesión</a></div>`,
      });
    } catch { /* silent */ }
  }
  return NextResponse.json({ ok: true });
}
