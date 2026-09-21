import type { MetadataRoute } from "next";
import { getAllArticles } from "./lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://metodorest.cl";
  // Solo páginas públicas que existen. Se irán agregando las nuevas (blog,
  // pilar, sobre-mi, etc.) a medida que se creen en las siguientes fases.
  const articles = getAllArticles().map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/sueno-y-estres`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/test-sueno`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/sobre-mi`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/evidencia`, lastModified: new Date(), priority: 0.6 },
    { url: `${base}/blog`, lastModified: new Date(), priority: 0.7 },
    ...articles,
  ];
}
