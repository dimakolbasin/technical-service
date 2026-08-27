import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = "dist";
const i18n = {
  languages: ["ru", "en", "ka"].map((locale) =>
    JSON.parse(readFileSync(`src/content/locales/${locale}.json`, "utf8")),
  ),
};

function files(dir = root) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [relative(root, path)];
  });
}

function outputPath(path) {
  if (path === "/") return "index.html";
  const clean = path.replace(/^\//, "").replace(/[?#].*$/, "");
  return clean.endsWith("/") ? `${clean}index.html` : clean;
}

const expectedHtml = [
  "404.html",
  ...i18n.languages.flatMap((language) =>
    Object.values(language.paths).map(outputPath),
  ),
].sort();
const actualHtml = files()
  .filter((file) => file.endsWith(".html"))
  .sort();

if (JSON.stringify(expectedHtml) !== JSON.stringify(actualHtml)) {
  throw new Error(
    `HTML routes differ: expected ${expectedHtml.length}, got ${actualHtml.length}`,
  );
}

const missing = new Set();
for (const file of actualHtml) {
  const html = readFileSync(join(root, file), "utf8");
  for (const [, value] of html.matchAll(/\s(?:href|src)=["']([^"']+)["']/gi)) {
    if (!value.startsWith("/") || value.startsWith("//")) continue;
    const target = outputPath(value);
    if (!existsSync(join(root, target))) missing.add(`${file} -> ${value}`);
  }
}

if (missing.size)
  throw new Error(`Broken local references:\n${[...missing].join("\n")}`);

const cssBytes = statSync(join(root, "assets/styles.css")).size;
if (cssBytes > 32_570)
  throw new Error(`CSS budget exceeded: ${cssBytes} > 32570 bytes`);

let maxInlineJs = 0;
for (const file of actualHtml) {
  const html = readFileSync(join(root, file), "utf8");
  const bytes = [
    ...html.matchAll(
      /<script\b(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].reduce((sum, match) => sum + Buffer.byteLength(match[1]), 0);
  maxInlineJs = Math.max(maxInlineJs, bytes);
}

const localJsBytes = files()
  .filter((file) => file.endsWith(".js"))
  .reduce((sum, file) => sum + statSync(join(root, file)).size, 0);
if (localJsBytes + maxInlineJs > 3_800) {
  throw new Error(
    `JavaScript budget exceeded: ${localJsBytes + maxInlineJs} > 3800 bytes`,
  );
}

console.log(
  `Verified ${actualHtml.length} HTML routes, local links, CSS ${cssBytes} B, JS ≤ ${localJsBytes + maxInlineJs} B`,
);
