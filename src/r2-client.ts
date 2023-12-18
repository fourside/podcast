import { basename } from "std/path";
import { ApiFactory } from "x/aws_api/client";
import { S3 as alterS3 } from "x/aws_api/s3";
import { Env } from "./env.ts";
import { getLogger } from "./logger.ts";

export async function putMp3(filePath: string): Promise<void> {
  const logger = getLogger("common");
  const s3 = new ApiFactory({
    fixedEndpoint:
      `https://${Env.cloudflare.accountId}.r2.cloudflarestorage.com`,
    region: "auto",
    credentials: {
      awsAccessKeyId: Env.cloudflare.accessKeyId,
      awsSecretKey: Env.cloudflare.secretAccessKey,
    },
  }).makeNew(alterS3);

  const file = await Deno.readFile(filePath);
  const fileName = basename(filePath);

  logger.debug("put to r2 start");
  await s3.putObject({
    Bucket: Env.cloudflare.bucketName,
    Key: fileName,
    Body: file,
    ContentType: "audio/mp3",
  });
}
