import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const args = process.argv.slice(2);

function htmlFiles(root, dir = root) {
  return readdirSync(dir)
    .flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory()
        ? htmlFiles(root, path)
        : path.endsWith(".html")
          ? [relative(root, path)]
          : [];
    })
    .sort();
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, "i"))?.[1] || "";
}

function normalizeText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tags(html, selector) {
  return [...html.matchAll(new RegExp(`<${selector}\\b[^>]*>`, "gi"))].map(
    (match) => match[0],
  );
}

function metadata(html) {
  const meta = tags(html, "meta")
    .map((tag) => [
      attr(tag, "name") || attr(tag, "property"),
      attr(tag, "content"),
    ])
    .filter(([key]) => key);
  const links = tags(html, "link")
    .filter((tag) => ["canonical", "alternate"].includes(attr(tag, "rel")))
    .map((tag) => [attr(tag, "rel"), attr(tag, "hreflang"), attr(tag, "href")]);
  return {
    lang: attr(html.match(/<html\b[^>]*>/i)?.[0] || "", "lang"),
    title: normalizeText(
      html.match(/<title\b[^>]*>[\s\S]*?<\/title>/i)?.[0] || "",
    ),
    meta,
    links,
  };
}

function domSignature(html) {
  return [...html.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi)]
    .filter(
      ([, tag]) => !["script", "link", "meta"].includes(tag.toLowerCase()),
    )
    .map(
      ([, tag, attrs]) =>
        `${tag.toLowerCase()}#${attr(`<x ${attrs}>`, "id")}.${attr(`<x ${attrs}>`, "class")}`,
    );
}

function links(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(
    ([, attrs, body]) => [
      attr(`<a ${attrs}>`, "href"),
      normalizeText(body),
      attr(`<a ${attrs}>`, "data-ga-contact-method"),
      attr(`<a ${attrs}>`, "data-ga-content-type"),
      attr(`<a ${attrs}>`, "data-ga-destination-key"),
      attr(`<a ${attrs}>`, "data-ga-location"),
    ],
  );
}

function images(html) {
  return tags(html, "img").map((tag) => [
    attr(tag, "src"),
    attr(tag, "alt"),
    attr(tag, "width"),
    attr(tag, "height"),
  ]);
}

function structuredData(html) {
  return [
    ...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map(([, json]) => JSON.parse(json));
}

function pageModel(html) {
  return {
    metadata: metadata(html),
    text: normalizeText(html),
    dom: domSignature(html),
    links: links(html),
    images: images(html),
    structuredData: structuredData(html),
  };
}

function digest(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function snapshot(root) {
  const files = htmlFiles(root);
  return {
    files,
    pages: Object.fromEntries(
      files.map((file) => {
        const model = pageModel(readFileSync(join(root, file), "utf8"));
        return [
          file,
          Object.fromEntries(
            Object.entries(model).map(([key, value]) => [key, digest(value)]),
          ),
        ];
      }),
    ),
  };
}

function firstDifference(a, b) {
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    if (JSON.stringify(a[index]) !== JSON.stringify(b[index]))
      return { index, baseline: a[index], candidate: b[index] };
  }
  return null;
}

if (args[0] === "--write-snapshot") {
  const [, root, output] = args;
  if (!root || !output)
    throw new Error("Usage: --write-snapshot <build-dir> <output-file>");
  writeFileSync(output, JSON.stringify(snapshot(root), null, 2) + "\n");
  console.log(`Baseline written for ${htmlFiles(root).length} HTML routes`);
  process.exit(0);
}

if (args[0] === "--verify-snapshot") {
  const [, input, root] = args;
  if (!input || !root)
    throw new Error("Usage: --verify-snapshot <snapshot-file> <build-dir>");
  const expected = JSON.parse(readFileSync(input, "utf8"));
  const actual = snapshot(root);
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    console.error("Build differs from the Eleventy semantic baseline");
    process.exit(1);
  }
  console.log(`Baseline confirmed for ${actual.files.length} HTML routes`);
  process.exit(0);
}

const [baselineDir, candidateDir] = args;
if (!baselineDir || !candidateDir) {
  throw new Error(
    "Usage: node scripts/compare-builds.mjs <baseline-dir> <candidate-dir>",
  );
}

const baselineFiles = htmlFiles(baselineDir);
const candidateFiles = htmlFiles(candidateDir);
if (JSON.stringify(baselineFiles) !== JSON.stringify(candidateFiles)) {
  console.error(
    "HTML route set differs",
    firstDifference(baselineFiles, candidateFiles),
  );
  process.exit(1);
}

const failures = [];
for (const file of baselineFiles) {
  const baseline = readFileSync(join(baselineDir, file), "utf8");
  const candidate = readFileSync(join(candidateDir, file), "utf8");
  const beforeModel = pageModel(baseline);
  const afterModel = pageModel(candidate);
  const checks = Object.fromEntries(
    Object.keys(beforeModel).map((key) => [
      key,
      [beforeModel[key], afterModel[key]],
    ]),
  );

  for (const [name, [before, after]] of Object.entries(checks)) {
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      failures.push({
        file,
        check: name,
        difference:
          Array.isArray(before) && Array.isArray(after)
            ? firstDifference(before, after)
            : { baseline: before, candidate: after },
      });
    }
  }
}

if (failures.length) {
  console.error(JSON.stringify(failures.slice(0, 30), null, 2));
  console.error(`${failures.length} parity checks failed`);
  process.exit(1);
}

console.log(`Parity confirmed for ${baselineFiles.length} HTML routes`);
