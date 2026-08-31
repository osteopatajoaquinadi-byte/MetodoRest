import { NextRequest, NextResponse } from "next/server";
import { createEvaluation, getEvaluationsByUser } from "../../lib/supabase";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  try {
    const records = await getEvaluationsByUser(userId);
    return NextResponse.json(records);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const { userId, tipo, resetq, sss } = body;
  if (!userId || !tipo) return NextResponse.json({ error: "userId y tipo requeridos" }, { status: 400 });
  if (!resetq || !sss) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });

  try {
    const record = await createEvaluation({
      user_id: userId, tipo,
      resetq_items: { h: resetq.h, a: resetq.a, r: resetq.r, i: resetq.i, b: resetq.b },
      resetq_score_h: resetq.scoreH, resetq_score_a: resetq.scoreA,
      resetq_score_r: resetq.scoreR, resetq_score_i: resetq.scoreI,
      resetq_score_b: resetq.scoreB, resetq_global: resetq.global,
      resetq_phenotype: resetq.phenotype, resetq_band: resetq.band,
      sss_score: sss.score,
    });
    return NextResponse.json({ id: record.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 502 });
  }
}
