import { Env } from "../env.ts";
import { getLogger, setupLog } from "../logger.ts";
import { sendTimefreeErrorMessageToSlack } from "../slack-client.ts";
import { createSqsClient, receiveMessage } from "./sqs.ts";

export async function main(_: string[]) {
  setupLog(Env.isProduction ? "INFO" : "DEBUG");

  const sqs = createSqsClient({
    awsAccessKeyId: Env.aws.accessKeyId,
    awsSecretKey: Env.aws.secretAccessKey,
  });

  try {
    await receiveMessage(sqs, Env.aws.sqsUrl);
    await receiveMessage(sqs, Env.aws.deadLetterSqsUrl);
  } catch (error) {
    const logger = getLogger("queue");
    logger.error(error);
    try {
      await sendTimefreeErrorMessageToSlack(Env.webhookUrl, error.message);
    } catch (slackError) {
      logger.error("Send slack failed.", slackError);
    }
    Deno.exit(-1);
  }
}

if (import.meta.main) {
  await main(Deno.args);
}
