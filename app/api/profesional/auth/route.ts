import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { PRO_COOKIE, PRO_SESSION_DAYS, createProToken, proAccessConfigured } from "../../../lib/profesional-session";

// Acceso profesional: misma cuenta de la plataforma, habilitada con mr_users.es_profesional = true.
export async function POST(req: NextRequest) {
  if (!proAccessConfigured()) {
    return NextResponse.json({ error: "El acceso profesional todavía no está configurado." }, { status: 503 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
  }

  // Import diferido: el cliente de Supabase exige variables de entorno al cargarse.
  const { findUserByEmail } = await import("../../../lib/supabase");

  try {
    const user = await findUserByEmail(email);
    const valid =
      !!user &&
      typeof user.password_hash === "string" &&
      user.password_hash.startsWith("$2") &&
      (await bcrypt.compare(password, user.password_hash));
    if (!user || !valid) {
      return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 });
    }
    if (user.es_profesional !== true) {
      return NextResponse.json(
        { error: "Tu cuenta no tiene acceso profesional. Si eres parte de la Red Método REST, escríbenos a metodorest@gmail.com." },
        { status: 403 },
      );
    }

    const token = createProToken(String(user.id), user.nombre || user.email);
    if (!token) {
      return NextResponse.json({ error: "El acceso profesional todavía no está configurado." }, { status: 503 });
    }
    const cookieStore = await cookies();
    cookieStore.set(PRO_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: PRO_SESSION_DAYS * 24 * 60 * 60,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No pudimos verificar tu cuenta. Intenta de nuevo." }, { status: 502 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(PRO_COOKIE);
  return NextResponse.json({ ok: true });
}
