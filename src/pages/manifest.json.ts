import type { APIRoute } from "astro";
import { site } from "../lib/site";
import { SITE_THEME_COLOR } from "../lib/site/constants";

const MANIFEST_HEADERS = {
  "Content-Type": "application/manifest+json",
} as const;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      id: "/",
      name: site.name,
      short_name: site.name,
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: SITE_THEME_COLOR,
      theme_color: SITE_THEME_COLOR,
      icons: [
        {
          src: "/assets/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/assets/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
      ],
      screenshots: [
        {
          src: "/assets/images/hero-appliances-desktop.webp",
          sizes: "754x380",
          type: "image/webp",
          form_factor: "wide",
        },
        {
          src: "/assets/images/hero-appliances-mobile.webp",
          sizes: "848x427",
          type: "image/webp",
        },
      ],
    }),
    { headers: MANIFEST_HEADERS },
  );
