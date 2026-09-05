import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "../../../lib/supabase";
import { Resend } from "resend";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://metodorest.cl";

// IDs de producto de Hotmart. El ebook da acceso solo al ebook;
// cualquier otro producto (el metodo completo) da acceso completo.
const EBOOK_PRODUCT_IDS = (process.env.HOTMART_EBOOK_PRODUCT_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);

function generatePassword(): string { return crypto.randomBytes(4).toString("hex"); }

function resolveNivel(productId: string | undefined): "ebook" | "completo" {
  if (productId && EBOOK_PRODUCT_IDS.includes(String(productId))) return "ebook";
  return "completo";
}

export async function POST(req: NextRequest) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  if (HOTMART_TOKEN) {
    const hottok = body.hottok || req.headers.get("x-hotmart-hottok");
    if (hottok !== HOTMART_TOKEN) return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const event = body.event || body.status;
  if (event === "PURCHASE_APPROVED" || event === "approved") {
    const buyer = body.data?.buyer || body.buyer || {};
    const email = buyer.email;
    const name = buyer.name || "";
    if (!email) return NextResponse.json({ error: "Email del comprador no encontrado" }, { status: 400 });

    const productId = body.data?.product?.id || body.data?.product?.ucode || body.product?.id;
    const nivel = resolveNivel(productId);

    const existing = await findUserByEmail(email);
    if (existing) return NextResponse.json({ ok: true, message: "Usuario ya existe" });

    const password = generatePassword();
    const hash = await bcrypt.hash(password, 10);
    await createUser({ email, nombre: name, password_hash: hash, nivel_acceso: nivel });

    if (resend) {
      try {
        await resend.emails.send({
          from: "Método R.E.S.T. <no-reply@metodorest.cl>", replyTo: "metodorest@gmail.com", to: email,
          subject: "Tu acceso al Método R.E.S.T. está listo",
          html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#060E0E;color:#E8F0F0;border-radius:16px"><img src="${BASE_URL}/logo.svg" alt="Método R.E.S.T." style="height:48px;margin-bottom:24px" /><h2 style="color:#00E5A0;margin:0 0 16px">¡Bienvenido/a al Método R.E.S.T.!</h2><p style="color:#A0B0B0;line-height:1.6">Tu compra fue confirmada. Aquí están tus datos de acceso:</p><div style="margin:24px 0;padding:20px;background:#0A1E1E;border-radius:12px;border:1px solid rgba(0,229,160,0.15)"><p style="margin:0 0 8px;color:#607070;font-size:13px">Email</p><p style="margin:0 0 16px;color:#E8F0F0;font-weight:600">${email}</p><p style="margin:0 0 8px;color:#607070;font-size:13px">Contraseña temporal</p><p style="margin:0;color:#00E5A0;font-weight:600;font-size:18px;letter-spacing:2px">${password}</p></div><a href="${BASE_URL}/login" style="display:inline-block;margin:16px 0;padding:14px 32px;background:#00E5A0;color:#060E0E;text-decoration:none;border-radius:12px;font-weight:600">Ingresar a la plataforma</a><p style="color:#607070;font-size:13px;margin-top:16px">Te recomendamos cambiar tu contraseña después del primer inicio de sesión.</p></div>`,
        });
      } catch { /* silent */ }
    }
    return NextResponse.json({ ok: true, message: "Usuario creado" });
  }
  return NextResponse.json({ ok: true, message: "Evento ignorado" });
}
