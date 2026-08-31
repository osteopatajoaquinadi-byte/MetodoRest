import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllUsers, getAllEvaluations, getAllHabits } from "../../lib/supabase";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session")?.value;
  const headerAuth = req.headers.get("x-admin-secret");
  const auth = session || headerAuth;
  if (!ADMIN_SECRET || auth !== ADMIN_SECRET) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const [users, evaluations, habits] = await Promise.all([getAllUsers(), getAllEvaluations(), getAllHabits()]);

    const usersData = users.map((u) => {
      const userEvals = evaluations.filter((e) => e.user_id === u.id);
      const userHabits = habits.filter((h) => h.user_id === u.id);
      const basalEval = userEvals.find((e) => e.tipo === "Basal");
      const latestEval = userEvals.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
      const completedDays = userHabits.filter((h) => h.completados > 0 && h.completados === h.total).length;

      let status = "Activo";
      if (!u.onboarding_completado) status = "Pendiente";
      else if (u.estado === "Inactivo") status = "Inactivo";

      return {
        id: u.id, name: u.nombre || "Sin nombre", email: u.email || "", gender: u.genero || "",
        age: u.edad || 0, status, onboardingCompleted: !!u.onboarding_completado,
        basalCompleted: !!u.basal_completado, joinedAt: u.fecha_registro || "",
        programStart: u.fecha_inicio_programa || "",
        resetqBasal: basalEval?.resetq_global ?? null,
        resetqLatest: latestEval?.resetq_global ?? null,
        phenotype: latestEval?.resetq_phenotype ?? basalEval?.resetq_phenotype ?? "",
        sssLatest: latestEval?.sss_score ?? basalEval?.sss_score ?? null,
        evaluationsCount: userEvals.length, habitDays: userHabits.length, habitCompletedDays: completedDays,
      };
    });

    const totalUsers = usersData.length;
    const activeUsers = usersData.filter((u) => u.onboardingCompleted && u.status !== "Inactivo").length;
    const pendingUsers = usersData.filter((u) => u.status === "Pendiente").length;
    const withScores = usersData.filter((u) => u.resetqLatest !== null);
    const avgResetQ = withScores.length > 0 ? Math.round(withScores.reduce((a, u) => a + (u.resetqLatest ?? 0), 0) / withScores.length) : 0;

    return NextResponse.json({ stats: { totalUsers, activeUsers, pendingUsers, avgResetQ }, users: usersData });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 502 });
  }
}
