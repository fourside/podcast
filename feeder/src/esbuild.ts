import { BuildResult, buildSync } from "esbuild";
import { Env } from "./env";

export function esbuild(entryPointPath: string): BuildResult {
  const isProduction = Env.getEnv() === "production";
  const dist = Env.getDistDir();
  return buildSync({
    bundle: true,
    target: "es2020",
    platform: "browser",
    entryPoints: [entryPointPath],
    outdir: dist,
    sourcemap: false,
    treeShaking: true,
    jsx: "transform",
    minify: isProduction,
  });
}

if (require.main === module) {
  const entryPointPath = process.argv.slice(2)[0];
  esbuild(entryPointPath);
}
