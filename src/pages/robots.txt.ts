import type { APIRoute } from "astro";
import { site } from "../lib/site";

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nDisallow:\n\nSitemap: ${site.baseUrl}/sitemap.xml`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
