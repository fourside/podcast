import { PutObjectCommand, S3 } from "x/aws_sdk/s3-client";
import { Env } from "./env.ts";

export async function putMp3(filePath: string): Promise<void> {
  const client = new S3({
    endpoint: `https://${Env.cloudflare.accountId}.r2.cloudflarestorage.com`,
    region: "auto",
    credentials: {
      accessKeyId: Env.cloudflare.accessKeyId,
      secretAccessKey: Env.cloudflare.secretAccessKey,
    },
  });
  const file = await Deno.readFile(filePath);
  await client.send(
    new PutObjectCommand({
      Bucket: Env.cloudflare.bucketName,
      Key: filePath,
      Body: file,
      ContentType: "audio/mp3",
    }),
  );
}
