"use client";

import Link from "next/link";
import { useState } from "react";
import HeroBackground from "../components/HeroBackground";
import { setProfile, setOnboardingStatus, setProgramStart, setBasalEvaluation, addPeriodicEvaluation, setDailyHabits } from "../lib/storage";

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

      setProfile({
        id: user.id,
        name: f.Nombre || "",
        age: f.Edad || 0,
        email: f.Email,
        gender: f["Género"] || undefined,
        sleepGoal: f["Objetivo Sueño"] || undefined,
        onboardingCompletedAt: f["Fecha Onboarding"] || "",
        createdAt: f["Fecha Registro"] || new Date().toISOString(),
      });

      if (f["Onboarding Completado"] && f["Basal Completado"]) {
        setOnboardingStatus({ profileCompleted: true, basalCompleted: true, completedAt: f["Fecha Onboarding"] });
        if (f["Fecha Inicio Programa"]) {
          setProgramStart(f["Fecha Inicio Programa"]);
        }

        const [evalsRes, habitsRes] = await Promise.all([
          fetch(`/api/evaluations?userId=${user.id}`),
          fetch(`/api/habits?userId=${user.id}`),
        ]);

        if (evalsRes.ok) {
          const evals = await evalsRes.json();
          const basal = evals.find((ev: Record<string, unknown>) => ev.Tipo === "Basal");
          if (basal) {
            setBasalEvaluation({
              evaluacion60s: { answers: JSON.parse(basal["Eval 60s Respuestas"] || "[]"), yesCount: basal["Eval 60s Puntaje"] || 0, date: basal.Fecha },
              sss: { score: basal["SSS Puntaje"] || 0, date: basal.Fecha },
              isi: { answers: JSON.parse(basal["ISI Respuestas"] || "[]"), total: basal["ISI Total"] || 0, label: basal["ISI Categoría"] || "", date: basal.Fecha },
              cuestionario: { answers: JSON.parse(basal["Cuestionario Respuestas"] || "[]"), total: basal["Cuestionario Total"] || 0, date: basal.Fecha },
              completedAt: basal.Fecha,
            });
          }
          const periodicEvals = evals.filter((ev: Record<string, unknown>) => ev.Tipo !== "Basal");
          for (const ev of periodicEvals) {
            const weekMatch = (ev.Tipo as string)?.match(/\d+/);
            addPeriodicEvaluation({
              id: ev["ID Evaluación"] || crypto.randomUUID(),
              weekNumber: weekMatch ? parseInt(weekMatch[0]) : 0,
              evaluacion60s: { answers: JSON.parse(ev["Eval 60s Respuestas"] || "[]"), yesCount: ev["Eval 60s Puntaje"] || 0, date: ev.Fecha },
              sss: { score: ev["SSS Puntaje"] || 0, date: ev.Fecha },
              isi: { answers: JSON.parse(ev["ISI Respuestas"] || "[]"), total: ev["ISI Total"] || 0, label: ev["ISI Categoría"] || "", date: ev.Fecha },
              cuestionario: { answers: JSON.parse(ev["Cuestionario Respuestas"] || "[]"), total: ev["Cuestionario Total"] || 0, date: ev.Fecha },
              completedAt: ev.Fecha,
            });
          }
        }

        if (habitsRes.ok) {
          const habits = await habitsRes.json();
          for (const h of habits) {
            if (h.Fecha && h["Hábitos Detalle"]) {
              try {
                setDailyHabits({
                  date: h.Fecha,
                  habits: JSON.parse(h["Hábitos Detalle"]),
                  completedCount: h.Completados || 0,
                  totalCount: h.Total || 0,
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
