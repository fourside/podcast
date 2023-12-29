import {
  addMinutes,
  formatTimefreeDateTime,
  getDateIfMidnightThenSubtracted,
  minusDays,
  parseAsFromTime,
} from "../date.ts";
import { getLogger } from "../logger.ts";
import { getOutputFilename } from "../output-filename.ts";
import type { ProgramTimefree } from "./record.ts";
import type { Task } from "./schema.ts";

type Result = {
  type: "in_the_future" | "over_a_week" | "already_done";
} | {
  type: "success";
  program: ProgramTimefree;
};

export async function convert(
  task: Task,
): Promise<Result> {
  const logger = getLogger("queue");
  const fromDate = parseAsFromTime(task.fromTime);
  const toDate = addMinutes(
    fromDate,
    Number.parseInt(task.duration, 10),
  );
  const today = new Date();
  if (toDate.getTime() > today.getTime()) {
    return { type: "in_the_future" };
  }

  const oneWeekAgo = minusDays(today, 7);
  if (toDate.getTime() < oneWeekAgo.getTime()) {
    return { type: "over_a_week" };
  }

  const recordDate = getDateIfMidnightThenSubtracted(fromDate);
  const fileName = getOutputFilename(task.title, recordDate);

  const isAlreadyRecoded = await fileExists(fileName);
  if (isAlreadyRecoded) {
    logger.info(`already handled message: title: ${task.title}`);
    return { type: "already_done" };
  }
  return {
    type: "success",
    program: {
      station: task.stationId,
      title: task.title,
      artist: task.personality,
      fromTime: formatTimefreeDateTime(fromDate),
      toTime: formatTimefreeDateTime(toDate),
      year: fromDate.getFullYear(),
      outputFileName: fileName,
    },
  };
}

async function fileExists(fileName: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(fileName);
    return stat.isFile;
  } catch (_error) {
    return false;
  }
}
