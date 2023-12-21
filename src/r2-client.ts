import { basename } from "std/path";
import { ApiFactory } from "x/aws_api/client";
import { S3 } from "x/aws_api/s3";
import { managedUpload } from "x/aws_api/s3-upload";
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
  }).makeNew(S3);

  const fileName = basename(filePath);
  const file = await Deno.open(filePath, { read: true });

  await managedUpload(s3, {
    Bucket: Env.cloudflare.bucketName,
    Key: fileName,
    Body: file.readable,
  });

  logger.info(`send to r2: ${filePath}`);
}
