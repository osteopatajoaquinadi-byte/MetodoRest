"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });

    if (!res.ok) {
      setError("Contraseña incorrecta");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-rest-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Método R.E.S.T." className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Admin</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl glass-card">
          <div className="mb-4">
            <label htmlFor="secret" className="block text-sm font-medium text-rest-text-secondary mb-2">
              Contraseña de administrador
            </label>
            <input
              id="secret"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(0,229,160,0.06)] rounded-xl text-rest-text placeholder:text-rest-text-muted focus:outline-none focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.4)] focus:ring-1 focus:ring-rest-accent/30 transition"
            />
          </div>
          {error && <p className="mb-4 text-center text-sm text-rest-danger">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
