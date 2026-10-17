"use client";

import { useState } from "react";

export default function SalirProfesional() {
  const [saliendo, setSaliendo] = useState(false);
  return (
    <button
      type="button"
      disabled={saliendo}
      onClick={async () => {
        setSaliendo(true);
        await fetch("/api/profesional/auth", { method: "DELETE" });
        window.location.href = "/profesional/acceso";
      }}
      className="min-h-[44px] px-2 sm:px-3 text-sm text-rest-text-secondary hover:text-rest-text transition disabled:opacity-60"
    >
      {saliendo ? "Saliendo…" : "Salir"}
    </button>
  );
}
