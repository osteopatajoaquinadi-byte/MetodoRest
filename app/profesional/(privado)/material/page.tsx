import type { Metadata } from "next";
import Link from "next/link";
import { getAllMaterial } from "../../../lib/profesional-material";

export const metadata: Metadata = { title: "Material" };

export default function MaterialPage() {
  const material = getAllMaterial();
  return (
    <div className="max-w-3xl">
      <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold text-white mb-2">Material de respaldo</h1>
      <p className="text-rest-text-secondary text-sm leading-relaxed mb-8">
        Cada recomendación lleva su nivel de evidencia:{" "}
        <span className="text-rest-accent font-semibold">[EVIDENCIA FIRME]</span>,{" "}
        <span className="text-white/70 font-semibold">[RAZONAMIENTO MECANICISTA]</span> o{" "}
        <span className="text-rest-text-muted font-semibold">[DEBATIDO]</span>, y sus fuentes.
      </p>
      <ol className="space-y-3">
        {material.map((m, i) => (
          <li key={m.slug}>
            <Link href={`/profesional/material/${m.slug}`} className="glass-card p-5 flex gap-4 items-start hover:ring-1 hover:ring-rest-accent/30 transition">
              <span className="font-[family-name:var(--font-space)] text-rest-accent text-sm font-semibold w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-white font-semibold">{m.title}</span>
                <span className="block text-rest-text-secondary text-sm mt-1 leading-relaxed">{m.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
