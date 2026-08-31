"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import HeroBackground from "../components/HeroBackground";

function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl glass-card text-center">
        <div className="w-16 h-16 rounded-full bg-rest-accent/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Revisa tu correo</h2>
        <p className="text-rest-text-secondary text-sm leading-relaxed mb-6">
          Si existe una cuenta con <strong className="text-white">{email}</strong>, recibirás un enlace para restablecer tu contraseña.
        </p>
        <Link href="/login" className="text-rest-accent text-sm hover:underline">
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl glass-card">
      <div className="mb-5">
        <label htmlFor="email" className="block text-sm font-medium text-rest-text-secondary mb-2">
          Email de tu cuenta
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
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-full transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Enviando..." : "Enviar enlace de recuperación"}
      </button>
      <div className="mt-4 text-center">
        <Link href="/login" className="text-rest-accent text-sm hover:underline">
          Volver al inicio de sesión
        </Link>
      </div>
    </form>
  );
}

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("Mínimo 6 caracteres");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Error al restablecer");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl glass-card text-center">
        <div className="w-16 h-16 rounded-full bg-rest-accent/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Contraseña actualizada</h2>
        <p className="text-rest-text-secondary text-sm mb-6">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-full transition-all"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl glass-card">
      <div className="mb-5">
        <label htmlFor="password" className="block text-sm font-medium text-rest-text-secondary mb-2">
          Nueva contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
          className="w-full px-4 py-3 bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(0,229,160,0.06)] rounded-xl text-rest-text placeholder:text-rest-text-muted focus:outline-none focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.4)] focus:ring-1 focus:ring-rest-accent/30 transition"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="confirm" className="block text-sm font-medium text-rest-text-secondary mb-2">
          Confirmar contraseña
        </label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repite tu contraseña"
          required
          className="w-full px-4 py-3 bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(0,229,160,0.06)] rounded-xl text-rest-text placeholder:text-rest-text-muted focus:outline-none focus:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.4)] focus:ring-1 focus:ring-rest-accent/30 transition"
        />
      </div>
      {error && <p className="mb-4 text-center text-sm text-rest-danger">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-full transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Guardando..." : "Restablecer contraseña"}
      </button>
    </form>
  );
}

function RecuperarContent() {
  const searchParams = useSearchParams();
  const hasToken = searchParams.has("token");

  return (
    <div className="min-h-screen flex flex-col bg-rest-bg relative overflow-hidden">
      <HeroBackground />
      <div className="relative z-10 flex-1 flex items-start justify-center p-4 pt-6 sm:pt-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <img src="/logo.svg" alt="Método R.E.S.T." className="h-16 mx-auto" />
            </Link>
            <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-bold mb-2">
              {hasToken ? "Nueva contraseña" : "Recuperar acceso"}
            </h1>
            <p className="text-rest-text-secondary text-sm">
              {hasToken
                ? "Ingresa tu nueva contraseña"
                : "Te enviaremos un enlace para restablecer tu contraseña"}
            </p>
          </div>
          {hasToken ? <ResetForm /> : <ForgotForm />}
        </div>
      </div>
    </div>
  );
}

export default function RecuperarPage() {
  return (
    <Suspense>
      <RecuperarContent />
    </Suspense>
  );
}
