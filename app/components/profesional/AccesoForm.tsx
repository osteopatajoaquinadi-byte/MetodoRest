"use client";

import { useState } from "react";

export default function AccesoForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profesional/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "No pudimos iniciar tu sesión.");
        setLoading(false);
        return;
      }
      window.location.href = next;
    } catch {
      setError("No pudimos conectarnos. Revisa tu conexión e intenta de nuevo.");
      setLoading(false);
    }
  };

  const inputClase =
    "w-full px-4 py-3 bg-white/[0.03] rounded-xl text-rest-text placeholder:text-rest-text-muted ring-1 ring-white/10 focus:outline-none focus:ring-rest-accent/50 transition";

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl glass-card space-y-4">
      <label className="block">
        <span className="block text-sm font-medium text-rest-text-secondary mb-2">Email</span>
        <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClase} />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-rest-text-secondary mb-2">Contraseña</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputClase}
        />
      </label>
      {error && (
        <p role="alert" className="text-center text-sm text-rest-danger">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-rest-accent hover:bg-rest-accent-dark text-rest-bg font-semibold rounded-xl transition-all disabled:opacity-60"
      >
        {loading ? "Verificando…" : "Entrar"}
      </button>
      <p className="text-center text-xs text-rest-text-muted leading-relaxed">
        Usa la misma cuenta de la plataforma Método REST. ¿Olvidaste tu contraseña?{" "}
        <a href="/recuperar" className="link-inline">
          Recupérala aquí
        </a>
        .
      </p>
    </form>
  );
}
