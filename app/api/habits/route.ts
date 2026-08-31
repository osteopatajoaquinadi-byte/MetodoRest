import { NextRequest, NextResponse } from "next/server";
import { upsertDailyHabit, getHabitsByUser } from "../../lib/supabase";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const from = req.nextUrl.searchParams.get("from") ?? undefined;
  if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  try {
    const records = await getHabitsByUser(userId, from);
    return NextResponse.json(records);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const { userId, date, weekNumber, habits, completedCount, totalCount } = body;
  if (!userId || !date) return NextResponse.json({ error: "userId y date requeridos" }, { status: 400 });

  try {
    const result = await upsertDailyHabit({
      user_id: userId, fecha: date, semana_programa: weekNumber ?? 1,
      habitos_detalle: habits, completados: completedCount, total: totalCount,
      porcentaje: totalCount > 0 ? completedCount / totalCount : 0,
    });
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 502 });
  }
}
