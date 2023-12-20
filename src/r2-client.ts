import { basename } from "std/path";
import { Env } from "./env.ts";
import { getLogger } from "./logger.ts";
import { RecRadikoError } from "./rec-radiko-error.ts";

export async function putMp3(filePath: string): Promise<void> {
  const logger = getLogger("common");

  const fileName = basename(filePath);
  const command = new Deno.Command("aws", {
    args: [
      "s3",
      "cp",
      "--endpoint",
      `https://${Env.cloudflare.accountId}.r2.cloudflarestorage.com`,
      "--region",
      "auto",
      filePath,
      `s3://${Env.cloudflare.bucketName}/${fileName}`,
    ],
    stdout: "piped",
    stderr: "piped",
    env: {
      AWS_ACCESS_KEY_ID: Env.cloudflare.accessKeyId,
      AWS_SECRET_ACCESS_KEY: Env.cloudflare.secretAccessKey,
    },
  });

  const { success, stdout, stderr } = await command.output();
  if (success) {
    logger.info("success to upload to r2", new TextDecoder().decode(stdout));
  } else {
    const error = new TextDecoder().decode(stderr);
    throw new RecRadikoError(error);
  }
}
