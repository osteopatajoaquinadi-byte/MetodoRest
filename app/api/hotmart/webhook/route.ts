import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, updateUser } from "../../../lib/supabase";
import bcrypt from "bcryptjs";
import { generatePassword, sendAccessEmail, sendUpgradeEmail } from "../../../lib/acceso";

const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;

// IDs de producto de Hotmart:
//   - Ebook "¿Duermes bien?" (ID 8460398): da acceso solo al ebook.
//   - Metodo completo (L105253165X) y Upgrade desde ebook (ID 8522819):
//     dan acceso completo. Cualquier producto que NO sea el ebook da completo.
// Cuando un usuario que ya tiene ebook compra el upgrade (o el completo),
// el flujo mas abajo detecta que ya existe y le sube el nivel a completo.
const EBOOK_PRODUCT_IDS = (process.env.HOTMART_EBOOK_PRODUCT_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);

function resolveNivel(productId: string | undefined): "ebook" | "completo" {
  if (productId && EBOOK_PRODUCT_IDS.includes(String(productId))) return "ebook";
  return "completo";
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
      // El usuario ya existe. Si la nueva compra le da MÁS acceso que el que
      // tiene (compró el completo teniendo solo ebook), le subimos el nivel.
      // Nunca bajamos el nivel: quien ya tiene completo, se queda con completo
      // aunque después compre solo el ebook.
      const nivelActual = existing.nivel_acceso === "ebook" ? "ebook" : "completo";
      if (nivelActual === "ebook" && nivel === "completo") {
        try {
          await updateUser(existing.id, { nivel_acceso: "completo" });
          console.log("[hotmart] nivel actualizado a completo:", email);
          await sendUpgradeEmail(email);
          return NextResponse.json({ ok: true, message: "Nivel actualizado a completo" });
        } catch (err) {
          console.error("[hotmart] error actualizando nivel:", err instanceof Error ? err.message : err);
          return NextResponse.json({ error: "Error actualizando nivel" }, { status: 500 });
        }
      }
      console.log("[hotmart] usuario ya existe, sin cambio de nivel:", email, "actual:", nivelActual, "compra:", nivel);
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
