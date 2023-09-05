import { ApiFactory } from "x/aws_api/client";
import { SQS } from "x/aws_api/sqs";
import { sqsLogger as logger } from "../logger.ts";
import { RecRadikoError } from "../rec-radiko-error.ts";
import { processMessage } from "./message-process.ts";

type Credentials = {
  awsAccessKeyId: string;
  awsSecretKey: string;
};

export function createSqsClient(credentials: Credentials): SQS {
  return new ApiFactory({
    credentials: {
      region: "ap-northeast-1",
      awsAccessKeyId: credentials.awsAccessKeyId,
      awsSecretKey: credentials.awsSecretKey,
    },
  }).makeNew(SQS);
}

export type ProcessMessageResult = {
  error?: Error;
  shouldBeDeleted: boolean;
};

export async function receiveMessage(
  sqs: SQS,
  queueUrl: string,
): Promise<void> {
  const messages = await sqs.receiveMessage({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 20,
  });
  for (const message of messages.Messages) {
    logger.info(message);
    if (message.Body === null || message.Body === undefined) {
      logger.warning("message.Body is empty.");
      continue;
    }
    const result = await processMessage(message.Body);
    if (result.shouldBeDeleted) {
      if (
        message.ReceiptHandle === null || message.ReceiptHandle === undefined
      ) {
        logger.error("message.ReceiptHandle is null or undefined", message);
        continue;
      }
      await sqs.deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      });
    }
    if (result.error !== undefined) {
      throw new RecRadikoError(result.error.message);
    }
  }
}
