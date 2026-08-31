"use client";

import { useState, useEffect } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  age: number;
  status: string;
  joinedAt: string;
  isiBasal: number | null;
  isiLatest: number | null;
  isiCategory: string;
  sssLatest: number | null;
  evaluationsCount: number;
  habitDays: number;
  habitCompletedDays: number;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Activo" | "Pendiente" | "Inactivo">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return r.json();
      })
      .then((d) => { if (d) setUsers(d.users); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    if (filter !== "all" && u.status !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColors: Record<string, { bg: string; text: string }> = {
    Activo: { bg: "bg-rest-accent/10", text: "text-rest-accent" },
    Pendiente: { bg: "bg-rest-warning/10", text: "text-rest-warning" },
    Inactivo: { bg: "bg-rest-danger/10", text: "text-rest-danger" },
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-rest-text-muted">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Cargando usuarios...
        </div>
      </div>
    );
  }

  const activeCount = users.filter((u) => u.status === "Activo").length;
  const pendingCount = users.filter((u) => u.status === "Pendiente").length;
  const inactiveCount = users.filter((u) => u.status === "Inactivo").length;
  const avgIsi = users.filter((u) => u.isiLatest !== null).length > 0
    ? Math.round(users.filter((u) => u.isiLatest !== null).reduce((a, u) => a + (u.isiLatest ?? 0), 0) / users.filter((u) => u.isiLatest !== null).length)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Usuarios</h1>
        <p className="text-rest-text-secondary mt-1">{users.length} usuarios registrados</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Activos", value: activeCount, color: "text-rest-accent" },
          { label: "Pendientes", value: pendingCount, color: "text-rest-warning" },
          { label: "Inactivos", value: inactiveCount, color: "text-rest-danger" },
          { label: "ISI promedio", value: avgIsi, color: "text-rest-warning" },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-rest-card border border-rest-accent/[0.04] text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-rest-text-muted text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rest-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-10 pr-4 py-2.5 bg-rest-card border border-rest-accent/[0.04] rounded-xl text-sm text-rest-text placeholder:text-rest-text-muted focus:outline-none focus:border-rest-accent/50 transition"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "Activo", "Pendiente", "Inactivo"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                filter === f ? "bg-rest-accent/10 text-rest-accent border border-rest-accent/20" : "bg-rest-card border border-rest-accent/[0.04] text-rest-text-secondary hover:text-rest-text"
              }`}
            >
              {f === "all" ? "Todos" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:block rounded-2xl bg-rest-card border border-rest-accent/[0.04] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rest-accent/[0.04] bg-rest-bg-alt">
              <th className="text-left py-3 px-4 text-rest-text-muted font-medium text-xs">Usuario</th>
              <th className="text-left py-3 px-4 text-rest-text-muted font-medium text-xs">Evaluaciones</th>
              <th className="text-left py-3 px-4 text-rest-text-muted font-medium text-xs">ISI</th>
              <th className="text-left py-3 px-4 text-rest-text-muted font-medium text-xs">Hábitos</th>
              <th className="text-left py-3 px-4 text-rest-text-muted font-medium text-xs">Registro</th>
              <th className="text-left py-3 px-4 text-rest-text-muted font-medium text-xs">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const st = statusColors[u.status] ?? statusColors.Activo;
              return (
                <tr key={u.id} className="border-b border-rest-accent/[0.04] last:border-0 hover:bg-rest-bg-alt/50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rest-accent/20 flex items-center justify-center">
                        <span className="text-rest-accent text-xs font-bold">{u.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-rest-text-muted text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-rest-text-secondary">{u.evaluationsCount}</td>
                  <td className="py-3 px-4">
                    {u.isiLatest !== null ? (
                      <span className={`font-medium ${u.isiLatest <= 7 ? "text-rest-accent" : u.isiLatest <= 14 ? "text-rest-warning" : "text-rest-danger"}`}>
                        {u.isiLatest}
                        {u.isiBasal !== null && u.isiBasal !== u.isiLatest && (
                          <span className="text-rest-text-muted text-xs ml-1">(basal: {u.isiBasal})</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-rest-text-muted">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-rest-text-secondary">
                    {u.habitDays > 0 ? `${u.habitCompletedDays}/${u.habitDays} días` : "—"}
                  </td>
                  <td className="py-3 px-4 text-rest-text-secondary text-xs">
                    {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString("es-CL") : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{u.status}</span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-rest-text-muted">No se encontraron usuarios</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-3">
        {filtered.map((u) => {
          const st = statusColors[u.status] ?? statusColors.Activo;
          return (
            <div key={u.id} className="p-4 rounded-xl bg-rest-card border border-rest-accent/[0.04]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rest-accent/20 flex items-center justify-center">
                    <span className="text-rest-accent text-xs font-bold">{u.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-rest-text-muted text-[10px]">{u.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{u.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-rest-bg">
                  <p className="text-xs text-rest-text-muted">ISI</p>
                  <p className={`text-sm font-medium ${u.isiLatest !== null ? (u.isiLatest <= 7 ? "text-rest-accent" : u.isiLatest <= 14 ? "text-rest-warning" : "text-rest-danger") : "text-rest-text-muted"}`}>
                    {u.isiLatest ?? "—"}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-rest-bg">
                  <p className="text-xs text-rest-text-muted">Evals</p>
                  <p className="text-sm font-medium">{u.evaluationsCount}</p>
                </div>
                <div className="p-2 rounded-lg bg-rest-bg">
                  <p className="text-xs text-rest-text-muted">Hábitos</p>
                  <p className="text-sm font-medium">{u.habitDays > 0 ? `${u.habitCompletedDays}d` : "—"}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
