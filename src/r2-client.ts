import { basename } from "std/path";
import { PutObjectCommand, S3 } from "x/aws_sdk/s3-client";
import { Env } from "./env.ts";
import { getLogger } from "./logger.ts";
import { RecRadikoError } from "./rec-radiko-error.ts";

export async function putMp3(filePath: string): Promise<void> {
  const logger = getLogger("common");
  const client = new S3({
    endpoint: `https://${Env.cloudflare.accountId}.r2.cloudflarestorage.com`,
    region: "auto",
    credentials: {
      accessKeyId: Env.cloudflare.accessKeyId,
      secretAccessKey: Env.cloudflare.secretAccessKey,
    },
  });
  const file = await Deno.readFile(filePath);
  const fileName = basename(filePath);

  logger.debug("put to r2 start");
  const output = await client.send(
    new PutObjectCommand({
      Bucket: Env.cloudflare.bucketName,
      Key: fileName,
      Body: file,
      ContentType: "audio/mp3",
    }),
  );
  const statusCode = output.$metadata.httpStatusCode;
  if (statusCode !== undefined && statusCode >= 400) {
    logger.error("Failed to put R2", output);
    throw new RecRadikoError(`Failed to put R2: ${fileName}`);
  }
}
