import * as fs from "fs";
import * as path from "path";
import { Env } from "./env";

export function getClientSideJs(entryPointPath: string): string {
  if (Env.getEnv() !== "production") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const esbuildModule = require("./esbuild");
    const buildResult = esbuildModule.esbuild(entryPointPath);
    if (buildResult.errors.length > 0) {
      buildResult.errors.forEach(console.error);
      throw new Error("Failed to build client-side JS");
    }
  }
  const baseName = path.parse(entryPointPath).name;
  const dist = Env.getDistDir();
  return fs.readFileSync(`${dist}/${baseName}.js`, "utf8");
}
