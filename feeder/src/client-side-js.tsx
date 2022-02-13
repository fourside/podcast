import * as fs from "fs";
import * as path from "path";
import { Env } from "./env";

export function getClientSideJs(): string {
  if (Env.getEnv() !== "production") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const esbuildModule = require("./esbuild");
    const srcPath = path.join(__dirname, "./components/client.tsx");
    const buildResult = esbuildModule.esbuild(srcPath);
    if (buildResult.errors.length > 0) {
      buildResult.errors.forEach(console.error);
      throw new Error("Failed to build client-side JS");
    }
  }
  const distPath = path.resolve("./dist/client.js");
  return fs.readFileSync(distPath, "utf8");
}
