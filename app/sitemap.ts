import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://metodorest.cl";
  // Solo páginas públicas que existen. Se irán agregando las nuevas (blog,
  // pilar, sobre-mi, etc.) a medida que se creen en las siguientes fases.
  return [
    { url: base, lastModified: new Date(), priority: 1 },
  ];
}
