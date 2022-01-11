import { ProcessMessageResult } from "./sqs.ts";
import { MessageBodySchema } from "./schema.ts";
import {
  addMinutes,
  formatTimefreeDateTime,
  getDateIfMidnightThenSubtracted,
  parseAsFromTime,
} from "../date.ts";
import { recordTimefree } from "../recorder.ts";
import { getOutputFilename } from "../output-filename.ts";
import { authorize } from "../auth-client.ts";

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

    await recordTimefree({
      station: messageBody.stationId,
      title: messageBody.title,
      artist: messageBody.personality,
      fromTime: formatTimefreeDateTime(fromDate),
      toTime: formatTimefreeDateTime(toDate),
      year: fromDate.getFullYear(),
      outputFileName: getOutputFilename(messageBody.title, recordDate),
    }, authToken);

    return {
      shouldBeDeleted: true,
    };
  } catch (error) {
    console.error("process SQS message failed.", error);
    return {
      error: error.message,
      shouldBeDeleted: false,
    };
  }
}
