import type { APIRoute } from "astro";
import { uiLanguages } from "../lib/content";
import { site } from "../lib/site";

const SITEMAP_EXCLUDED_KEYS = new Set<string>(["privacy"]);
const SITEMAP_CHANGE_FREQ = "weekly";
const SITEMAP_PRIORITY = "0.8";
const SITEMAP_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
} as const;

export const GET: APIRoute = () => {
  const urls = [
    ...new Set(
      uiLanguages.flatMap((language) =>
        Object.entries(language.paths)
          .filter(([key, path]) => !SITEMAP_EXCLUDED_KEYS.has(key) && path)
          .map(([, path]) => site.baseUrl + path),
      ),
    ),
  ];
  const now = new Date().toISOString();
  const body = urls
    .map(
      (url) =>
        `  <url>\n    <loc>${url}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${SITEMAP_CHANGE_FREQ}</changefreq>\n    <priority>${SITEMAP_PRIORITY}</priority>\n  </url>`,
    )
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    {
      headers: SITEMAP_HEADERS,
    },
  );
};
