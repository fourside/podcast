import * as fs from "fs";
import * as path from "path";
import { buildSync } from "esbuild";

const OUT_DIR = "./dist";

export function getClientSideJs(entryPointPath: string): string {
  const buildResult = buildSync({
    bundle: true,
    target: "es2020",
    platform: "browser",
    entryPoints: [entryPointPath],
    outdir: OUT_DIR,
    sourcemap: true,
    treeShaking: true,
  });
  if (buildResult.errors.length > 0) {
    buildResult.errors.forEach(console.error);
    throw new Error("Failed to build client-side JS");
  }
  const baseName = path.parse(entryPointPath).name;
  return fs.readFileSync(path.join(__dirname, `../${OUT_DIR}/${baseName}.js`), "utf8");
}
