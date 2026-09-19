import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

// Busca si un email ya hizo el test RESET-Q en la landing (quedó en mr_leads).
// Devuelve la evaluación más reciente para poder usarla como basal sin repetir el test.
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ found: false });

  try {
    const { data, error } = await supabase
      .from("mr_leads")
      .select("phenotype, global_score, scores, created_at")
      .eq("email", email)
      .not("scores", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return NextResponse.json({ found: false });

    return NextResponse.json({
      found: true,
      phenotype: data.phenotype,
      global: data.global_score,
      scores: data.scores,
      date: data.created_at,
    });
  } catch {
    return NextResponse.json({ found: false });
  }
}
