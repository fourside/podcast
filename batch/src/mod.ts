import { parseArgs } from "./cli.ts";

export async function main(args: string[]) {
  const result = parseArgs(args);
  if (result.exit) {
    Deno.exit(result.exitCode);
  }
  await console.log("hey");
}

if (import.meta.main) {
  await main(Deno.args);
}
