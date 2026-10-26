import type { APIRoute } from "astro";
import { site } from "../lib/site";

// Явно разрешаем ИИ-краулерам читать сайт: нам важно попадать в ответы
// ChatGPT, Perplexity, Claude и Gemini (GEO). `User-agent: *` уже пускает
// всех, но явные группы страхуют от будущих дефолтов.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-Web",
  "Google-Extended",
  "Applebot-Extended",
];

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nDisallow:\n\n${AI_CRAWLERS.map(
      (bot) => `User-agent: ${bot}\nAllow: /\n`,
    ).join("\n")}Sitemap: ${site.baseUrl}/sitemap.xml`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
