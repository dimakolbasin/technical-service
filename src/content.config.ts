import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { contentSchema } from "./lib/content/schemas";

const CONTENT_PAGES_BASE = "./src/content/pages";
const CONTENT_PATTERN = "**/*.json";

const pages = defineCollection({
  loader: glob({ pattern: CONTENT_PATTERN, base: CONTENT_PAGES_BASE }),
  schema: contentSchema,
});

export const collections = { pages };
