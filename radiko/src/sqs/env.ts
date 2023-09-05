export const Env = Object.freeze({
  awsAccessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID") ||
    unreachable("AWS_ACCESS_KEY_ID"),
  awsSecretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY") ||
    unreachable("AWS_SECRET_ACCESS_KEY"),
  queueUrl: Deno.env.get("SQS_URL") || unreachable("SQS_URL"),
  deadLetterQueueUrl: Deno.env.get("DEAD_LETTER_SQS_URL") ||
    unreachable("DEAD_LETTER_SQS_URL"),
  webhookUrl: Deno.env.get("SLACK_WEBHOOK_URL") ||
    unreachable("SLACK_WEBHOOK_URL"),
  isProduction: Deno.env.get("IS_PRODUCTION") === "true",
});

function unreachable(name: string): never {
  throw new Error(`${name} is not set.`);
}
