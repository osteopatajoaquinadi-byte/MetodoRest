import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, updateUser, getUserById } from "../../lib/supabase";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    try {
      const user = await getUserById(id);
      return NextResponse.json({ id: user.id, fields: user });
    } catch { return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 }); }
  }
  if (email) {
    const user = await findUserByEmail(email);
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    return NextResponse.json({ id: user.id, fields: user });
  }
  return NextResponse.json({ error: "email o id requerido" }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const { userId, fields } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  const allowed = ["nombre", "edad", "genero", "objetivo_sueno", "perfil_completado", "basal_completado", "onboarding_completado", "fecha_onboarding", "fecha_inicio_programa"];
  const mapped: Record<string, unknown> = {};
  for (const key of allowed) {
    if (fields[key] !== undefined) mapped[key] = fields[key];
  }
  if (fields.Nombre !== undefined) mapped.nombre = fields.Nombre;
  if (fields.Edad !== undefined) mapped.edad = fields.Edad;
  const updated = await updateUser(userId, mapped);
  return NextResponse.json({ id: updated.id, fields: updated });
}
