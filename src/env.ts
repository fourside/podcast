export const Env = Object.freeze({
  webhookUrl: Deno.env.get("SLACK_WEBHOOK_URL") ||
    unreachable("SLACK_WEBHOOK_URL"),
  isProduction: Deno.env.get("IS_PRODUCTION") === "true",
  cloudflare: {
    bucketName: Deno.env.get("CLOUDFLARE_BUCKET_NAME") ||
      unreachable("CLOUDFLARE_BUCKET_NAME"),
    accountId: Deno.env.get("CLOUDFLARE_ACCOUNT_ID") ||
      unreachable("CLOUDFLARE_ACCOUNT_ID"),
    accessKeyId: Deno.env.get("CLOUDFLARE_ACCESS_KEY_ID") ||
      unreachable("CLOUDFLARE_ACCESS_KEY_ID"),
    secretAccessKey: Deno.env.get("CLOUDFLARE_SECRET_ACCESS_KEY") ||
      unreachable("CLOUDFLARE_SECRET_ACCESS_KEY"),
  },
  queueUrl: Deno.env.get("QUEUE_URL") || unreachable("QUEUE_URL"),
  queueUsername: Deno.env.get("QUEUE_USERNAME") ||
    unreachable("QUEUE_USERNAME"),
  queuePassword: Deno.env.get("QUEUE_PASSWORD") ||
    unreachable("QUEUE_PASSWORD"),
});

function unreachable(name: string): never {
  throw new Error(`${name} is not set.`);
}
