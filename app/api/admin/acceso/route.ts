import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser, updateUser } from "../../../lib/supabase";
import { generatePassword, sendAccessEmail, sendUpgradeEmail } from "../../../lib/acceso";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

// Acceso manual al Método completo, para ventas cobradas fuera de Hotmart
// (por ejemplo, un link de Mercado Pago). Hace lo mismo que el webhook de
// Hotmart: crea la cuenta y envía la contraseña, o sube a completo a quien
// solo tenía el ebook.
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin-session")?.value || req.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || auth !== ADMIN_SECRET) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  let body: { email?: string; nombre?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const nombre = (body.nombre || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      if (existing.nivel_acceso === "ebook") {
        await updateUser(existing.id, { nivel_acceso: "completo" });
        await sendUpgradeEmail(email);
        return NextResponse.json({ ok: true, estado: "actualizado", mensaje: "Ya tenía el ebook: se le subió a Método completo y se le avisó por correo." });
      }
      return NextResponse.json({ ok: true, estado: "ya_tenia", mensaje: "Esta persona ya tenía acceso completo. No se envió correo." });
    }

    const password = generatePassword();
    await createUser({ email, nombre, password_hash: await bcrypt.hash(password, 10), nivel_acceso: "completo" });
    const enviado = await sendAccessEmail(email, password);
    if (!enviado) {
      // Sin correo la persona no tiene cómo entrar: devolvemos la contraseña
      // para que el admin se la envíe por otro medio.
      return NextResponse.json({ ok: true, estado: "creado_sin_correo", password, mensaje: "Cuenta creada, pero el correo no se pudo enviar. Envíale estos datos por WhatsApp." });
    }
    return NextResponse.json({ ok: true, estado: "creado", mensaje: "Cuenta creada. Se le envió el correo con su contraseña." });
  } catch (err) {
    console.error("[admin/acceso]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "No se pudo dar el acceso. Intenta de nuevo." }, { status: 500 });
  }
}
