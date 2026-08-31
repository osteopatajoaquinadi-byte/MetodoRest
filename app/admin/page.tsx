"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserData {
  id: string;
  name: string;
  email: string;
  status: string;
  joinedAt: string;
  isiBasal: number | null;
  isiLatest: number | null;
  isiCategory: string;
  evaluationsCount: number;
  habitDays: number;
  habitCompletedDays: number;
}

interface AdminData {
  stats: { totalUsers: number; activeUsers: number; pendingUsers: number; avgIsi: number };
  users: UserData[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return r.json();
      })
      .then((d) => { if (d) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-rest-text-muted">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Cargando datos de Airtable...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center text-rest-text-muted">
        Error al cargar datos. Verifica la conexión con Airtable.
      </div>
    );
  }

  const { stats, users } = data;

  const recentUsers = [...users]
    .filter((u) => u.joinedAt)
    .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
    .slice(0, 5);

  const statCards = [
    { label: "Usuarios totales", value: stats.totalUsers, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { label: "Activos", value: stats.activeUsers, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Pendientes onboarding", value: stats.pendingUsers, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "ISI promedio", value: stats.avgIsi, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-rest-text-secondary mt-1">Datos en tiempo real desde Airtable</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-rest-card border border-rest-accent/[0.04]">
            <div className="w-10 h-10 rounded-xl bg-rest-accent/10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
              </svg>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-rest-text-muted text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Hotmart placeholder */}
      <div className="p-6 rounded-2xl bg-rest-card border border-rest-accent/[0.04] border-dashed">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rest-warning/10 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-rest-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Integración Hotmart</h3>
            <p className="text-rest-text-secondary text-sm">Pendiente — los usuarios se crean manualmente en Airtable hasta que se configure el webhook.</p>
          </div>
        </div>
      </div>

      {/* Recent users */}
      <div className="p-6 rounded-2xl bg-rest-card border border-rest-accent/[0.04]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold">Usuarios recientes</h2>
            <p className="text-rest-text-muted text-xs mt-0.5">Últimos registros</p>
          </div>
          <Link href="/admin/usuarios" className="text-rest-accent text-sm hover:underline">Ver todos</Link>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rest-accent/[0.04]">
                <th className="text-left py-3 text-rest-text-muted font-medium text-xs">Usuario</th>
                <th className="text-left py-3 text-rest-text-muted font-medium text-xs">Registro</th>
                <th className="text-left py-3 text-rest-text-muted font-medium text-xs">ISI</th>
                <th className="text-left py-3 text-rest-text-muted font-medium text-xs">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-rest-accent/[0.04] last:border-0">
                  <td className="py-3">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-rest-text-muted text-xs">{u.email}</p>
                  </td>
                  <td className="py-3 text-rest-text-secondary text-xs">
                    {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString("es-CL") : "—"}
                  </td>
                  <td className="py-3">
                    {u.isiLatest !== null ? (
                      <span className={`font-medium ${u.isiLatest <= 7 ? "text-rest-accent" : u.isiLatest <= 14 ? "text-rest-warning" : "text-rest-danger"}`}>
                        {u.isiLatest}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      u.status === "Activo" ? "bg-rest-accent/10 text-rest-accent"
                      : u.status === "Pendiente" ? "bg-rest-warning/10 text-rest-warning"
                      : "bg-rest-danger/10 text-rest-danger"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-rest-text-muted">Sin usuarios registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-3">
          {recentUsers.map((u) => (
            <div key={u.id} className="p-3 rounded-xl bg-rest-bg border border-rest-accent/[0.04]">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-sm">{u.name}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  u.status === "Activo" ? "bg-rest-accent/10 text-rest-accent"
                  : u.status === "Pendiente" ? "bg-rest-warning/10 text-rest-warning"
                  : "bg-rest-danger/10 text-rest-danger"
                }`}>{u.status}</span>
              </div>
              <p className="text-rest-text-muted text-xs">{u.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
