import { ApiFactory } from "x/aws_api/client";
import { SQS } from "x/aws_api/sqs";
import { receiveMessage } from "./sqs.ts";

const awsAccessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
if (!awsAccessKeyId) {
  throw new Error("AWS_ACCESS_KEY_ID is not set");
}
const awsSecretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
if (!awsSecretAccessKey) {
  throw new Error("AWS_SECRET_ACCESS_KEY is not set");
}
const sqs = new ApiFactory({
  credentials: {
    region: "ap-northeast-1",
    awsAccessKeyId,
    awsSecretKey: awsSecretAccessKey,
  },
}).makeNew(SQS);

const queueUrl =
  "https://sqs.ap-northeast-1.amazonaws.com/540093229923/radiko.fifo";

const result = await sqs.sendMessage({
  QueueUrl: queueUrl,
  MessageBody: "Hello Hello, World!!!!" + new Date().toISOString(),
  MessageGroupId: "RadikoQueue",
  MessageDeduplicationId: Math.random().toString(),
});
console.log("send", result);

await receiveMessage(sqs, queueUrl, async (messageBody) => {
  console.log(messageBody);
  return {
    shouldBeDeleted: true,
  };
});
