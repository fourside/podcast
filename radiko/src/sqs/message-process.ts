import { authorize } from "../auth-client.ts";
import {
  addMinutes,
  formatTimefreeDateTime,
  getDateIfMidnightThenSubtracted,
  parseAsFromTime,
} from "../date.ts";
import { sqsLogger as logger } from "../logger.ts";
import { getOutputFilename } from "../output-filename.ts";
import { recordTimefree } from "../recorder.ts";
import { MessageBodySchema } from "./schema.ts";
import { ProcessMessageResult } from "./sqs.ts";

export async function processMessage(
  messageBodyString: string,
): Promise<ProcessMessageResult> {
  try {
    const messageBodyJson = JSON.parse(messageBodyString);
    const messageBody = MessageBodySchema.parse(messageBodyJson);

    const fromDate = parseAsFromTime(messageBody.fromTime);
    const toDate = addMinutes(fromDate, parseInt(messageBody.duration, 10));
    if (toDate.getTime() > Date.now()) {
      return {
        shouldBeDeleted: false,
      };
    }

    const authToken = await authorize();
    const recordDate = getDateIfMidnightThenSubtracted(fromDate);
    const fileName = getOutputFilename(messageBody.title, recordDate);

    const isAlreadyRecoded = await fileExists(fileName);
    if (isAlreadyRecoded) {
      logger.info(`already handled message: title: ${messageBody.title}`);
      return {
        shouldBeDeleted: true,
      };
    }

    await recordTimefree({
      station: messageBody.stationId,
      title: messageBody.title,
      artist: messageBody.personality,
      fromTime: formatTimefreeDateTime(fromDate),
      toTime: formatTimefreeDateTime(toDate),
      year: fromDate.getFullYear(),
      outputFileName: fileName,
    }, authToken);

    return {
      shouldBeDeleted: true,
    };
  } catch (error) {
    logger.error("process SQS message failed.", error);
    return {
      error: error.message,
      shouldBeDeleted: false,
    };
  }
}

async function fileExists(fileName: string): Promise<boolean> {
  const path = `/public/${fileName}`;
  try {
    const stat = await Deno.stat(path);
    return stat.isFile;
  } catch (_error) {
    return false;
  }
}
