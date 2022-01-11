import { sendTimefreeErrorMessageToSlack } from "../slack-client.ts";
import { processMessage } from "./message-process.ts";
import { createSqsClient, receiveMessage } from "./sqs.ts";

export async function main(_: string[]) {
  const awsAccessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
  if (!awsAccessKeyId) {
    throw new Error("AWS_ACCESS_KEY_ID is not set");
  }
  const awsSecretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
  if (!awsSecretAccessKey) {
    throw new Error("AWS_SECRET_ACCESS_KEY is not set");
  }

  const queueUrl = Deno.env.get("SQS_URL");
  if (!queueUrl) {
    throw new Error("SQS_URL is not set");
  }

  const deadLetterQueueUrl = Deno.env.get("DEAD_LETTER_SQS_URL");
  if (!deadLetterQueueUrl) {
    throw new Error("DEAD_LETTER_SQS_URL is not set");
  }

  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (webhookUrl === undefined) {
    throw new Error("SLACK_WEBHOOK_URL is not passed.");
  }

  const sqs = createSqsClient({
    awsAccessKeyId: awsAccessKeyId,
    awsSecretKey: awsSecretAccessKey,
  });

  try {
    await receiveMessage(sqs, queueUrl, processMessage);
    await receiveMessage(sqs, deadLetterQueueUrl, processMessage);
  } catch (error) {
    console.error(error);
    try {
      await sendTimefreeErrorMessageToSlack(webhookUrl, error.message);
    } catch (slackError) {
      console.error("Send slack failed.", slackError);
    }
    Deno.exit(-1);
  }
}

if (import.meta.main) {
  await main(Deno.args);
}
