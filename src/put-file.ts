import { getLogger } from "./logger.ts";
import { putMp3 } from "./r2-client.ts";

export async function main(args: string[]) {
  const logger = getLogger("common");
  const filePath = args[0];
  if (filePath === undefined) {
    logger.error("path the file path");
    Deno.exit(-1);
  }

  await putMp3(filePath);
}

if (import.meta.main) {
  await main(Deno.args);
}
