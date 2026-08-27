import { readFile, writeFile } from "node:fs/promises";
import { transform } from "esbuild";

const CSS_PATH = "dist/assets/styles.css";
const source = await readFile(CSS_PATH, "utf8");
const { code } = await transform(source, {
  loader: "css",
  minify: true,
});

await writeFile(CSS_PATH, code);
