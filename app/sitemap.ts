import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://metodorest.cl";
  // Solo páginas públicas que existen. Se irán agregando las nuevas (blog,
  // pilar, sobre-mi, etc.) a medida que se creen en las siguientes fases.
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/sueno-y-estres`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/test-sueno`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/sobre-mi`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/evidencia`, lastModified: new Date(), priority: 0.6 },
  ];
}
