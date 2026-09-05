"use client";

import Link from "next/link";
import { useState } from "react";
import HeroBackground from "../components/HeroBackground";
import { setProfile, setOnboardingStatus, setProgramStart, setBasalEvaluation, addPeriodicEvaluation, setDailyHabits, setNivelAcceso } from "../lib/storage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      const user = await res.json();
      const f = user.fields;

      localStorage.setItem("rest-user-id", user.id);

      setNivelAcceso(f.nivel_acceso === "ebook" ? "ebook" : "completo");

      setProfile({
        id: user.id,
        name: f.nombre || "",
        age: f.edad || 0,
        email: f.email,
        gender: f.genero || undefined,
        sleepGoal: f.objetivo_sueno || undefined,
        nivelAcceso: f.nivel_acceso === "ebook" ? "ebook" : "completo",
        onboardingCompletedAt: f.fecha_onboarding || "",
        createdAt: f.fecha_registro || new Date().toISOString(),
      });

      if (f.onboarding_completado && f.basal_completado) {
        setOnboardingStatus({ profileCompleted: true, basalCompleted: true, completedAt: f.fecha_onboarding });
        if (f.fecha_inicio_programa) {
          setProgramStart(f.fecha_inicio_programa);
        }

        const [evalsRes, habitsRes] = await Promise.all([
          fetch(`/api/evaluations?userId=${user.id}`),
          fetch(`/api/habits?userId=${user.id}`),
        ]);

        if (evalsRes.ok) {
          const evals = await evalsRes.json();
          const basal = evals.find((ev: Record<string, unknown>) => ev.tipo === "Basal");
          if (basal) {
            const items = (basal.resetq_items || {}) as Record<string, unknown>;
            setBasalEvaluation({
              resetq: {
                h: (items.h || []) as number[], a: (items.a || []) as number[],
                r: (items.r || []) as number[], i: (items.i || []) as number[],
                b: (items.b || []) as boolean[],
                scoreH: (basal.resetq_score_h || 0) as number, scoreA: (basal.resetq_score_a || 0) as number,
                scoreR: (basal.resetq_score_r || 0) as number, scoreI: (basal.resetq_score_i || 0) as number,
                scoreB: (basal.resetq_score_b || 0) as number, global: (basal.resetq_global || 0) as number,
                phenotype: (basal.resetq_phenotype || "") as string, band: (basal.resetq_band || "") as string,
                date: (basal.fecha || "") as string,
              },
              sss: { score: (basal.sss_score || 0) as number, date: (basal.fecha || "") as string },
              completedAt: (basal.fecha || "") as string,
            });
          }
          const periodicEvals = evals.filter((ev: Record<string, unknown>) => ev.tipo !== "Basal");
          for (const ev of periodicEvals) {
            const weekMatch = (ev.tipo as string)?.match(/\d+/);
            const eitems = (ev.resetq_items || {}) as Record<string, unknown>;
            addPeriodicEvaluation({
              id: (ev.id || crypto.randomUUID()) as string,
              weekNumber: weekMatch ? parseInt(weekMatch[0]) : 0,
              resetq: {
                h: (eitems.h || []) as number[], a: (eitems.a || []) as number[],
                r: (eitems.r || []) as number[], i: (eitems.i || []) as number[],
                b: (eitems.b || []) as boolean[],
                scoreH: (ev.resetq_score_h || 0) as number, scoreA: (ev.resetq_score_a || 0) as number,
                scoreR: (ev.resetq_score_r || 0) as number, scoreI: (ev.resetq_score_i || 0) as number,
                scoreB: (ev.resetq_score_b || 0) as number, global: (ev.resetq_global || 0) as number,
                phenotype: (ev.resetq_phenotype || "") as string, band: (ev.resetq_band || "") as string,
                date: (ev.fecha || "") as string,
              },
              sss: { score: (ev.sss_score || 0) as number, date: (ev.fecha || "") as string },
              completedAt: (ev.fecha || "") as string,
            });
          }
        }

        if (habitsRes.ok) {
          const habits = await habitsRes.json();
          for (const h of habits) {
            if (h.fecha && h.habitos_detalle) {
              try {
                setDailyHabits({
                  date: h.fecha,
                  habits: typeof h.habitos_detalle === "string" ? JSON.parse(h.habitos_detalle) : h.habitos_detalle,
                  completedCount: h.completados || 0,
                  totalCount: h.total || 0,
                });
              } catch {}
            }
          }
        }

        window.location.href = "/app";
      } else {
        setOnboardingStatus({ profileCompleted: !!f["Perfil Completado"], basalCompleted: false });
        window.location.href = "/app/onboarding";
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-rest-bg relative overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 flex-1 flex items-start justify-center p-4 pt-6 sm:pt-10">
        <div className="w-full max-w-md">

          <div className="relative z-10">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-6">
                <img src="/logo.svg" alt="Método R.E.S.T." className="h-16 mx-auto" />
              </Link>
              <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-bold mb-2">
                Bienvenido de vuelta
              </h1>
              <p className="text-rest-text-secondary text-sm">
                Ingresa con el email de tu compra en Hotmart
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl glass-card">
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-rest-text-secondary mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-3 bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(0,229,160,0.06)] rounded-xl text-rest-text placeholder:text-rest-text-muted focus:outline-none focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.4)] focus:ring-1 focus:ring-rest-accent/30 transition"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="block text-sm font-medium text-rest-text-secondary mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  required
                  className="w-full px-4 py-3 bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(0,229,160,0.06)] rounded-xl text-rest-text placeholder:text-rest-text-muted focus:outline-none focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.4)] focus:ring-1 focus:ring-rest-accent/30 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-full transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] hover:shadow-[0_0_24px_rgba(0,229,160,0.4)] hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verificando acceso...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>

              {error && (
                <p className="mt-3 text-center text-sm text-rest-danger">{error}</p>
              )}

              <div className="mt-4 text-center">
                <Link href="/recuperar" className="text-rest-accent text-sm hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-rest-text-muted text-sm">
                ¿Aún no tienes acceso?{" "}
                <Link href="/#precio" className="text-rest-accent hover:underline">
                  Comprar el método
                </Link>
              </p>
            </div>

            {/* Hotmart info */}
            <div className="mt-8 p-4 rounded-xl glass-card">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-rest-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-rest-text-muted text-xs leading-relaxed">
                  Tu acceso está vinculado a la compra realizada en Hotmart. Si tienes problemas para ingresar,
                  revisa tu email de confirmación o escríbenos a soporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
