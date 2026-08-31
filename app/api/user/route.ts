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
  const mapped: Record<string, unknown> = {};
  if (fields.Nombre !== undefined) mapped.nombre = fields.Nombre;
  if (fields.Edad !== undefined) mapped.edad = fields.Edad;
  if (fields["Género"] !== undefined) mapped.genero = fields["Género"];
  if (fields["Objetivo Sueño"] !== undefined) mapped.objetivo_sueno = fields["Objetivo Sueño"];
  if (fields["Perfil Completado"] !== undefined) mapped.perfil_completado = fields["Perfil Completado"];
  if (fields["Basal Completado"] !== undefined) mapped.basal_completado = fields["Basal Completado"];
  if (fields["Onboarding Completado"] !== undefined) mapped.onboarding_completado = fields["Onboarding Completado"];
  if (fields["Fecha Onboarding"] !== undefined) mapped.fecha_onboarding = fields["Fecha Onboarding"];
  if (fields["Fecha Inicio Programa"] !== undefined) mapped.fecha_inicio_programa = fields["Fecha Inicio Programa"];
  const updated = await updateUser(userId, mapped);
  return NextResponse.json({ id: updated.id, fields: updated });
}
