import { NextResponse } from "next/server";
import { supabase, getConfigStatus } from "../../lib/supabase";

export async function GET() {
  const config = getConfigStatus();
  let dbTest: { ok: boolean; error: string | null; userCount: number | null } = { ok: false, error: null, userCount: null };

  try {
    const { count, error } = await supabase.from("mr_users").select("*", { count: "exact", head: true });
    if (error) {
      dbTest = { ok: false, error: error.message, userCount: null };
    } else {
      dbTest = { ok: true, error: null, userCount: count ?? 0 };
    }
  } catch (err) {
    dbTest = { ok: false, error: err instanceof Error ? err.message : "unknown", userCount: null };
  }

  return NextResponse.json({ config, dbTest });
}
