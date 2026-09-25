import fs from "node:fs";
import path from "node:path";

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string; // markdown del cuerpo (sin H1, meta, keyword ni firma)
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Mapa de artículos relacionados (del prompt SEO, Paso 20)
export const RELATED: Record<string, string[]> = {
  "insomnio-por-estres": ["despertar-3am", "cansado-pero-no-puedo-dormir", "sistema-nervioso-y-sueno"],
  "despertar-3am": ["insomnio-por-estres", "despertar-cansado", "respiracion-para-dormir"],
  "cansado-pero-no-puedo-dormir": ["insomnio-por-estres", "como-dormir-sin-pastillas", "melatonina-no-me-funciona"],
  "como-dormir-sin-pastillas": ["cansado-pero-no-puedo-dormir", "melatonina-no-me-funciona", "respiracion-para-dormir"],
  "sistema-nervioso-y-sueno": ["insomnio-por-estres", "despertar-cansado", "ejercicio-fuerza-y-sueno"],
  "ejercicio-fuerza-y-sueno": ["como-dormir-sin-pastillas", "respiracion-para-dormir", "cansado-pero-no-puedo-dormir"],
  "respiracion-para-dormir": ["como-dormir-sin-pastillas", "sistema-nervioso-y-sueno", "despertar-3am"],
  "despertar-cansado": ["despertar-3am", "sistema-nervioso-y-sueno", "insomnio-por-estres"],
  "melatonina-no-me-funciona": ["como-dormir-sin-pastillas", "sistema-nervioso-y-sueno", "insomnio-por-estres"],
};

// Orden de aparición en el índice (P1 primero, luego P2), según el prompt
export const ORDER: string[] = [
  "insomnio-por-estres",
  "despertar-3am",
  "cansado-pero-no-puedo-dormir",
  "como-dormir-sin-pastillas",
  "melatonina-no-me-funciona",
  "sistema-nervioso-y-sueno",
  "ejercicio-fuerza-y-sueno",
  "respiracion-para-dormir",
  "despertar-cansado",
];

function parse(raw: string): { title: string; description: string; body: string } {
  const lines = raw.split("\n");
  let title = "";
  let description = "";
  const h1 = lines.find((l) => l.startsWith("# "));
  if (h1) title = h1.replace(/^#\s+/, "").trim();
  const metaLine = lines.find((l) => /\*\*Meta description:\*\*/i.test(l));
  if (metaLine) description = metaLine.replace(/.*\*\*Meta description:\*\*/i, "").trim();

  // El cuerpo empieza después del primer separador "---" y termina antes de la
  // firma final ("*Artículo escrito por...").
  const firstSep = raw.indexOf("\n---\n");
  let body = firstSep >= 0 ? raw.slice(firstSep + 5) : raw;
  const firma = body.indexOf("*Artículo escrito por");
  if (firma >= 0) {
    // recortar también el separador "---" que antecede a la firma
    const before = body.slice(0, firma);
    const lastSep = before.lastIndexOf("\n---");
    body = lastSep >= 0 ? before.slice(0, lastSep) : before;
  }
  return { title, description, body: body.trim() };
}

export function getSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getArticle(slug: string): Article | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const { title, description, body } = parse(raw);
  return { slug, title, description, body };
}

export function getAllArticles(): Article[] {
  const slugs = getSlugs();
  const ordered = ORDER.filter((s) => slugs.includes(s));
  const rest = slugs.filter((s) => !ORDER.includes(s));
  return [...ordered, ...rest]
    .map((s) => getArticle(s))
    .filter((a): a is Article => a !== null);
}
