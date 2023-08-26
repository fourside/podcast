import { sendTimefreeErrorMessageToSlack } from "../slack-client.ts";
import { Env } from "./env.ts";
import { processMessage } from "./message-process.ts";
import { createSqsClient, receiveMessage } from "./sqs.ts";

export async function main(_: string[]) {
  const sqs = createSqsClient({
    awsAccessKeyId: Env.awsAccessKeyId,
    awsSecretKey: Env.awsSecretAccessKey,
  });

  try {
    await receiveMessage(sqs, Env.queueUrl, processMessage);
    await receiveMessage(sqs, Env.deadLetterQueueUrl, processMessage);
  } catch (error) {
    console.error(error);
    try {
      await sendTimefreeErrorMessageToSlack(Env.webhookUrl, error.message);
    } catch (slackError) {
      console.error("Send slack failed.", slackError);
    }
    Deno.exit(-1);
  }
}

if (import.meta.main) {
  await main(Deno.args);
}
