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

async function sendAccessEmail(email: string, password: string) {
  if (!resend) { console.error("[hotmart] RESEND no configurado, no se envia correo"); return; }
  try {
    await resend.emails.send({
      from: "Método R.E.S.T. <no-reply@metodorest.cl>", replyTo: "metodorest@gmail.com", to: email,
      subject: "Tu acceso al Método R.E.S.T. está listo",
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#060E0E;color:#E8F0F0;border-radius:16px"><img src="${BASE_URL}/logo.svg" alt="Método R.E.S.T." style="height:48px;margin-bottom:24px" /><h2 style="color:#00E5A0;margin:0 0 16px">¡Bienvenido/a al Método R.E.S.T.!</h2><p style="color:#A0B0B0;line-height:1.6">Tu compra fue confirmada. Aquí están tus datos de acceso:</p><div style="margin:24px 0;padding:20px;background:#0A1E1E;border-radius:12px;border:1px solid rgba(0,229,160,0.15)"><p style="margin:0 0 8px;color:#607070;font-size:13px">Email</p><p style="margin:0 0 16px;color:#E8F0F0;font-weight:600">${email}</p><p style="margin:0 0 8px;color:#607070;font-size:13px">Contraseña temporal</p><p style="margin:0;color:#00E5A0;font-weight:600;font-size:18px;letter-spacing:2px">${password}</p></div><a href="${BASE_URL}/login" style="display:inline-block;margin:16px 0;padding:14px 32px;background:#00E5A0;color:#060E0E;text-decoration:none;border-radius:12px;font-weight:600">Ingresar a la plataforma</a><p style="color:#607070;font-size:13px;margin-top:16px">Te recomendamos cambiar tu contraseña después del primer inicio de sesión.</p></div>`,
    });
  } catch (err) {
    console.error("[hotmart] error enviando correo:", err instanceof Error ? err.message : err);
  }
}

export async function POST(req: NextRequest) {
  // Hotmart envia JSON en compras reales (Webhook 2.0), pero el boton "Enviar prueba"
  // manda form-urlencoded (querystring). Soportamos ambos.
  let body: Record<string, unknown> = {};
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("form")) {
      const form = await req.formData();
      form.forEach((value, key) => { body[key] = value; });
    } else {
      const raw = await req.text();
      try {
        body = JSON.parse(raw);
      } catch {
        const params = new URLSearchParams(raw);
        params.forEach((value, key) => { body[key] = value; });
      }
    }
  } catch {
    return NextResponse.json({ error: "No se pudo leer el cuerpo" }, { status: 400 });
  }

  // Hotmart 2.0 envia el hottok en el header X-HOTMART-HOTTOK (case-insensitive en Next).
  // Aceptamos header o body por compatibilidad. Si el token no coincide, avisamos en logs
  // pero NO cortamos: preferimos crear el acceso a perder una venta por un mismatch de token.
  const hottok = req.headers.get("x-hotmart-hottok") || (body.hottok as string) || null;
  const tokenOk = HOTMART_TOKEN ? hottok === HOTMART_TOKEN : true;
  if (!tokenOk) {
    console.warn("[hotmart] hottok no coincide. recibido:", hottok ? String(hottok).slice(0, 6) + "..." : "null");
  }

  // Estructura del evento. Soporta JSON 2.0 (body.event + body.data) y
  // el formato plano de las pruebas (querystring con campos sueltos).
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const b = body as any;
  const data = b.data || b;
  const event = b.event || b.status || data?.purchase?.status || null;

  const isApproved =
    event === "PURCHASE_APPROVED" ||
    event === "approved" ||
    event === "APPROVED" ||
    data?.purchase?.status === "APPROVED" ||
    data?.purchase?.approved_date != null ||
    b.status === "APPROVED";

  console.log("[hotmart] evento:", event, "| approved:", isApproved, "| tokenOk:", tokenOk, "| keys:", Object.keys(b).slice(0, 12).join(","));

  if (isApproved) {
    // Email y nombre: buscamos en la estructura anidada (JSON) y en campos planos (prueba)
    const buyer = data?.buyer || data?.customer || b.buyer || {};
    const email = buyer.email || b.email || b.buyer_email || null;
    const name = buyer.name || b.name || b.buyer_name || "";
    if (!email) {
      console.error("[hotmart] sin email de comprador. keys:", Object.keys(b).join(","));
      return NextResponse.json({ error: "Email del comprador no encontrado" }, { status: 400 });
    }

    const productId = data?.product?.id || data?.product?.ucode || b.product?.id || b.prod || b.product_id || null;
    const nivel = resolveNivel(productId ? String(productId) : undefined);
  /* eslint-enable @typescript-eslint/no-explicit-any */

    const existing = await findUserByEmail(email);
    if (existing) {
      console.log("[hotmart] usuario ya existe:", email);
      return NextResponse.json({ ok: true, message: "Usuario ya existe" });
    }

    const password = generatePassword();
    const hash = await bcrypt.hash(password, 10);
    try {
      await createUser({ email, nombre: name, password_hash: hash, nivel_acceso: nivel });
      console.log("[hotmart] usuario creado:", email, "nivel:", nivel);
    } catch (err) {
      console.error("[hotmart] error creando usuario:", err instanceof Error ? err.message : err);
      return NextResponse.json({ error: "Error creando usuario" }, { status: 500 });
    }

    await sendAccessEmail(email, password);
    return NextResponse.json({ ok: true, message: "Usuario creado", nivel });
  }

  return NextResponse.json({ ok: true, message: "Evento ignorado", event });
}
