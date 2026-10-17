import fs from "node:fs";
import path from "node:path";

export interface Material {
  slug: string;
  title: string;
  summary: string;
  body: string;
}

const DIR = path.join(process.cwd(), "content", "profesional");

// Orden de lectura recomendado en el índice.
export const ORDEN_MATERIAL: string[] = [
  "como-usar-la-ficha",
  "banderas-rojas",
  "fenotipos-de-sueno",
  "banderas-amarillas",
  "examen-manual",
  "suplementacion",
  "digestivo-gases-distension",
];

function parse(raw: string): { title: string; summary: string; body: string } {
  const lines = raw.split("\n");
  const h1 = lines.find((l) => l.startsWith("# "));
  const title = h1 ? h1.replace(/^#\s+/, "").trim() : "";
  const resumen = lines.find((l) => /^\*\*Resumen:\*\*/.test(l));
  const summary = resumen ? resumen.replace(/^\*\*Resumen:\*\*\s*/, "").trim() : "";
  const sep = raw.indexOf("\n---\n");
  const body = sep >= 0 ? raw.slice(sep + 5) : raw;
  return { title, summary, body: body.trim() };
}

export function getMaterialSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getMaterial(slug: string): Material | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return { slug, ...parse(fs.readFileSync(file, "utf-8")) };
}

export function getAllMaterial(): Material[] {
  const slugs = getMaterialSlugs();
  const ordered = ORDEN_MATERIAL.filter((s) => slugs.includes(s));
  const rest = slugs.filter((s) => !ORDEN_MATERIAL.includes(s)).sort();
  return [...ordered, ...rest].map((s) => getMaterial(s)).filter((m): m is Material => m !== null);
}
