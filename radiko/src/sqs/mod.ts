import { getLogger, setupLog } from "../logger.ts";
import { sendTimefreeErrorMessageToSlack } from "../slack-client.ts";
import { Env } from "./env.ts";
import { createSqsClient, receiveMessage } from "./sqs.ts";

export async function main(_: string[]) {
  setupLog(Env.isProduction ? "INFO" : "DEBUG");

  const sqs = createSqsClient({
    awsAccessKeyId: Env.awsAccessKeyId,
    awsSecretKey: Env.awsSecretAccessKey,
  });

  try {
    await receiveMessage(sqs, Env.queueUrl);
    await receiveMessage(sqs, Env.deadLetterQueueUrl);
  } catch (error) {
    const logger = getLogger("sqs");
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
