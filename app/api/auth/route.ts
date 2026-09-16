import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, updateUser, getUserById } from "../../lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const { action, email, password, profile } = body;

  try {
    if (action === "login") {
      if (!email || !password) return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
      const user = await findUserByEmail(email);
      if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
      const isValid = user.password_hash.startsWith("$2") ? await bcrypt.compare(password, user.password_hash) : user.password_hash === password;
      if (!isValid) return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
      if (!user.password_hash.startsWith("$2")) {
        const hash = await bcrypt.hash(password, 10);
        await updateUser(user.id, { password_hash: hash });
      }
      return NextResponse.json({ id: user.id, fields: user });
    }

    if (action === "register") {
      if (!email || !password) return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
      const existing = await findUserByEmail(email);
      if (existing) return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });
      const hash = await bcrypt.hash(password, 10);
      const user = await createUser({
        email, nombre: profile?.name || "", edad: profile?.age || 0,
        genero: profile?.gender || undefined, objetivo_sueno: profile?.sleepGoal || undefined,
        password_hash: hash, perfil_completado: !!profile,
      });
      return NextResponse.json({ id: user.id, fields: user }, { status: 201 });
    }

    if (action === "complete-onboarding") {
      const userId = body.userId;
      if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });
      await updateUser(userId, {
        onboarding_completado: true, basal_completado: true,
        fecha_onboarding: new Date().toISOString(), fecha_inicio_programa: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true });
    }

    if (action === "change-password") {
      const { userId, currentPassword, newPassword } = body;
      if (!userId || !currentPassword || !newPassword) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
      if (newPassword.length < 6) return NextResponse.json({ error: "La nueva contraseña debe tener al menos 6 caracteres" }, { status: 400 });
      let user;
      try { user = await getUserById(userId); } catch { return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 }); }
      const valid = user.password_hash.startsWith("$2") ? await bcrypt.compare(currentPassword, user.password_hash) : user.password_hash === currentPassword;
      if (!valid) return NextResponse.json({ error: "La contraseña actual no es correcta" }, { status: 401 });
      const hash = await bcrypt.hash(newPassword, 10);
      await updateUser(userId, { password_hash: hash });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error interno" }, { status: 502 });
  }
}
