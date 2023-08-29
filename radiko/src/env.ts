export const Env = Object.freeze({
  webhookUrl: Deno.env.get("SLACK_WEBHOOK_URL") ||
    unreachable("SLACK_WEBHOOK_URL"),
  isProduction: Deno.env.get("IS_PRODUCTION") === "true",
});

function unreachable(name: string): never {
  throw new Error(`${name} is not set.`);
}
